// API Route: YouTube video search with in-memory + Firestore result cache
// Cache order:
//   1. In-memory (fastest, resets on server restart, 6h TTL)
//   2. Firestore  (persistent across restarts, 24h TTL)
//   3. YouTube API (actual network call, result saved to Firestore)
import { NextRequest, NextResponse } from 'next/server';
import { searchVideos, type VideoResult } from '@/lib/youtube';
import { db } from '@/lib/firebase';
import { makeCacheKey, getCachedVideos, setCachedVideos } from '@/lib/firestoreCache';

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
    isCampMode: boolean,
    localKeywords: string[] | undefined,
): string {
    return `${query}|${regionCode ?? ''}|${isCampMode}|${(localKeywords ?? []).join(',')}`;
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
    const isCampMode = searchParams.get('isCampMode') === 'true';

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
    const memKey = makeMemCacheKey(query, regionCode, isCampMode, localKeywords);
    const memCached = cache.get(memKey);

    if (memCached && memCached.expiresAt > Date.now()) {
        memCached.hits++;
        console.info(`[memory HIT]    "${query}" (hits: ${memCached.hits})`);
        return NextResponse.json({ videos: memCached.videos, fromCache: 'memory' });
    }

    // ── ② Firestore Cache lookup ──
    const fsKey = makeCacheKey(query, regionCode ?? '', isCampMode);
    const fsVideos = await getCachedVideos(db, fsKey);

    if (fsVideos) {
        // Warm up the in-memory cache from Firestore result
        evictExpiredOrOldest();
        cache.set(memKey, { videos: fsVideos, expiresAt: Date.now() + CACHE_TTL_MS, hits: 1 });
        return NextResponse.json({ videos: fsVideos, fromCache: 'firestore' });
    }

    // ── ③ Cache miss → call YouTube API ──
    console.info(`[cache MISS]    "${query}" → calling YouTube API`);

    try {
        const videos = await searchVideos(query, apiKey, maxResults, localKeywords, regionCode, isCampMode);

        // Save to Firestore (persistent)
        await setCachedVideos(db, fsKey, videos);

        // Save to in-memory (fast)
        evictExpiredOrOldest();
        cache.set(memKey, {
            videos,
            expiresAt: Date.now() + CACHE_TTL_MS,
            hits: 0,
        });

        console.info(`[cache SET]     "${query}" (${videos.length} videos) — mem: ${cache.size}/${CACHE_MAX_ITEMS}`);

        return NextResponse.json({ videos, fromCache: false });
    } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}

// ── Debug endpoint: cache stats ───────────────────────────────────────────────
// POST /api/youtube  (only in development)
// Returns: { size, entries: [{key, hits, expiresIn}] }
export async function POST(request: NextRequest) {
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
