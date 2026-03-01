import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { VideoResult } from '@/lib/youtube';
import { getVideoRatings } from '@/lib/firestoreCache';

// ── In-Memory Global Random Pool ──
// To prevent excessive Firestore reads (one for every document in youtube_cache),
// we aggregate and cache the best videos in memory.
let globalRandomPool: VideoResult[] = [];
let poolExpiresAt = 0;
const POOL_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10', 10);
    // Optional mode parameter
    const mode = searchParams.get('mode') || 'scenic';

    try {
        if (Date.now() > poolExpiresAt || globalRandomPool.length === 0) {
            console.info('[api/random] Rebuilding global random pool from Firestore...');

            // 1. Fetch ALL cached searches (this costs 1 read per city cached, max ~300)
            const snap = await getDocs(collection(db, 'youtube_cache'));
            const allVideos: VideoResult[] = [];

            snap.forEach(docSnap => {
                const data = docSnap.data();
                if (data.videos && Array.isArray(data.videos)) {
                    // Try to filter by mode if possible. 
                    // cacheKey is encoded in doc ID. Let's just aggregate everything first,
                    // or parse the docId if we want to be specific.
                    // doc.id format: encodeURIComponent(`v5|City|Code|mode`).replace(/%/g, '_')
                    // It's easier to just decode it.
                    try {
                        const originalKey = decodeURIComponent(docSnap.id.replace(/_/g, '%'));
                        // If it's the old cache format without v5, it might just be City|Code|mode
                        const parts = originalKey.split('|');
                        const docMode = parts[parts.length - 1]; // usually mode is the last part

                        // We will add a hidden mode property if it doesn't exist
                        const vids = data.videos.map((v: VideoResult) => ({ ...v, _mode: docMode }));
                        allVideos.push(...vids);
                    } catch (e) {
                        allVideos.push(...data.videos);
                    }
                }
            });

            // Deduplicate by video ID
            const uniqueMap = new Map<string, VideoResult>();
            for (const v of allVideos) {
                if (!uniqueMap.has(v.id)) uniqueMap.set(v.id, v);
            }
            const uniqueVideos = Array.from(uniqueMap.values());

            // 2. Fetch Ratings for all these videos
            // Batch them in chunks of 10 to fetch from video_ratings
            const videoIds = uniqueVideos.map(v => v.id);
            const ratingsMap = await getVideoRatings(db, videoIds);

            // 3. Score and Filter
            const scoredVideos = uniqueVideos.map(vid => {
                const r = ratingsMap[vid.id] || { likes: 0, dislikes: 0 };
                // Calculate engagement score: likes heavily weighted, dislikes penalize
                const score = (r.likes * 5) - (r.dislikes * 10);
                return {
                    ...vid,
                    ratings: { ...r, score }
                };
            });

            // Sort by score descending
            scoredVideos.sort((a, b) => (b.ratings?.score || 0) - (a.ratings?.score || 0));

            // Keep top 300 to be our "Global Pool"
            globalRandomPool = scoredVideos.slice(0, 300);
            poolExpiresAt = Date.now() + POOL_TTL_MS;
            console.info(`[api/random] Rebuilt pool with ${globalRandomPool.length} top videos.`);
        }

        // Filter the pool by requested mode
        const poolForMode = globalRandomPool.filter((v: VideoResult & { _mode?: string }) => v._mode === mode || !v._mode);

        if (poolForMode.length === 0) {
            return NextResponse.json({ videos: [] });
        }

        // Pick `count` random videos from the mode pool
        const shuffled = [...poolForMode].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        // Remove the internal _mode flag before sending to client
        const cleanSelected = selected.map((v: VideoResult & { _mode?: string }) => {
            const { _mode, ...rest } = v;
            return rest;
        });

        return NextResponse.json({ videos: cleanSelected });
    } catch (error) {
        console.error('[api/random] Error fetching random videos:', error);
        return NextResponse.json({ error: 'Failed to fetch random videos' }, { status: 500 });
    }
}
