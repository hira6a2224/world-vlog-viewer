// API Route: YouTube video search with in-memory + Firestore result cache
// Cache order:
//   1. In-memory (fastest, resets on server restart, 6h TTL)
//   2. Firestore  (persistent across restarts, 24h TTL)
//   3. YouTube API (actual network call, result saved to Firestore)
import { NextRequest, NextResponse } from 'next/server';
import { searchVideos, type VideoResult } from '@/lib/youtube';
import { db } from '@/lib/firebase';
import { makeCacheKey, getCachedVideos, setCachedVideos, getVideoRatings } from '@/lib/firestoreCache';

import type { Firestore } from 'firebase/firestore';

async function attachRatingsAndSort(videos: VideoResult[], firestoreDb: Firestore): Promise<VideoResult[]> {
    if (!videos || videos.length === 0) return videos;
    const videoIds = videos.map(v => v.id);
    const ratingsMap = await getVideoRatings(firestoreDb, videoIds);

    const ratedVideos = videos.map(vid => {
        const r = ratingsMap[vid.id] || { likes: 0, dislikes: 0 };
        const score = r.likes - r.dislikes;
        return {
            ...vid,
            ratings: { ...r, score }
        };
    });

    // Sort descending by score. Stable sort is approximated here.
    // To keep original order for zero scores, we can just return bScore - aScore
    // because JS sort is stable in modern engines.
    ratedVideos.sort((a, b) => {
        const aScore = a.ratings?.score || 0;
        const bScore = b.ratings?.score || 0;
        return bScore - aScore;
    });

    return ratedVideos;
}

// ── In-Memory Cache ──────────────────────────────────────────────────────────
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_MAX_ITEMS = 300;                  // ~300 city × mode combos before eviction

interface CacheEntry {
    videos: VideoResult[];
    expiresAt: number;
    hits: number;
}

// Module-level map (persists across requests within the same server process)
const cache = new Map<string, CacheEntry>();

function makeMemCacheKey(
    query: string,
    regionCode: string | undefined,
    mode: string,
    localKeywords: string[] | undefined,
): string {
    return `${query}|${regionCode ?? ''}|${mode}|${(localKeywords ?? []).join(',')}`;
}

function evictExpiredOrOldest() {
    const now = Date.now();
    // First: remove expired
    for (const [key, entry] of cache) {
        if (entry.expiresAt <= now) {
            cache.delete(key);
        }
    }
    // If still over limit, remove the entry with the fewest hits (LFU)
    if (cache.size >= CACHE_MAX_ITEMS) {
        let minHits = Infinity;
        let minKey = '';
        for (const [key, entry] of cache) {
            if (entry.hits < minHits) { minHits = entry.hits; minKey = key; }
        }
        if (minKey) cache.delete(minKey);
    }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('maxResults') || '8', 10);
    const regionCode = searchParams.get('regionCode') || undefined;

    // mode: 'vlog' | 'camp' | 'scenic'
    const mode = (searchParams.get('mode') || 'vlog') as 'vlog' | 'camp' | 'scenic';

    // Local language keywords (JSON array)
    let localKeywords: string[] | undefined;
    const rawKeywords = searchParams.get('localKeywords');
    if (rawKeywords) {
        try { localKeywords = JSON.parse(rawKeywords); } catch { /* ignore */ }
    }

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
    }

    // ── ① In-Memory Cache lookup ──
    const memKey = makeMemCacheKey(query, regionCode, mode, localKeywords);
    const memCached = cache.get(memKey);

    if (memCached && memCached.expiresAt > Date.now()) {
        memCached.hits++;
        console.info(`[memory HIT]    "${query}" (hits: ${memCached.hits})`);
        const finalVideos = await attachRatingsAndSort(memCached.videos, db);
        return NextResponse.json({ videos: finalVideos, fromCache: 'memory' });
    }

    // ── ② Firestore Cache lookup ──
    const fsKey = makeCacheKey(query, regionCode ?? '', mode);
    const fsVideos = await getCachedVideos(db, fsKey);

    if (fsVideos) {
        // Warm up the in-memory cache from Firestore result
        evictExpiredOrOldest();
        cache.set(memKey, { videos: fsVideos, expiresAt: Date.now() + CACHE_TTL_MS, hits: 1 });
        const finalVideos = await attachRatingsAndSort(fsVideos, db);
        return NextResponse.json({ videos: finalVideos, fromCache: 'firestore' });
    }

    // ── ③ Cache miss → call YouTube API ──
    console.info(`[cache MISS]    "${query}" → calling YouTube API`);

    try {
        const videos = await searchVideos(query, apiKey, maxResults, localKeywords, regionCode, mode);

        // Only cache non-empty results — empty results should be retried later
        if (videos.length > 0) {
            await setCachedVideos(db, fsKey, videos);
            evictExpiredOrOldest();
            cache.set(memKey, {
                videos,
                expiresAt: Date.now() + CACHE_TTL_MS,
                hits: 0,
            });
            console.info(`[cache SET]     "${query}" (${videos.length} videos) — mem: ${cache.size}/${CACHE_MAX_ITEMS}`);
        } else {
            console.warn(`[NO RESULTS]    "${query}" — not caching empty result`);
        }

        const finalVideos = await attachRatingsAndSort(videos, db);
        return NextResponse.json({ videos: finalVideos, fromCache: false });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`YouTube API error for "${query}": ${errMsg}`);
        // If quota exceeded, return a specific error so frontend can show a message
        const isQuota = errMsg.includes('403') || errMsg.includes('quota');
        return NextResponse.json(
            { error: isQuota ? 'API quota exceeded. Please try again later.' : 'Failed to fetch videos', videos: [] },
            { status: isQuota ? 429 : 500 }
        );
    }
}

// ── Debug endpoint: cache stats ───────────────────────────────────────────────
// POST /api/youtube  (only in development)
// Returns: { size, entries: [{key, hits, expiresIn}] }
export async function POST(_request: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }
    const now = Date.now();
    const entries = [...cache.entries()].map(([key, e]) => ({
        key,
        hits: e.hits,
        videos: e.videos.length,
        expiresIn: Math.round((e.expiresAt - now) / 60000) + 'm',
    }));
    return NextResponse.json({ size: cache.size, max: CACHE_MAX_ITEMS, entries });
}
