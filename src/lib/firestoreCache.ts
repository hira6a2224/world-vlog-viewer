// Firestore Cache Utility for YouTube Search Results
//
// Collection: youtube_cache
// Document ID: sha-safe base64 of cacheKey (cityName|regionCode|isCampMode)
// Fields:
//   - videos: VideoResult[]   (serialized)
//   - cachedAt: number        (Unix ms timestamp)
//   - expiresAt: number       (Unix ms timestamp)
//
// TTL: 24 hours (configurable via CACHE_TTL_MS)

import {
    doc,
    getDoc,
    setDoc,
    type Firestore,
} from 'firebase/firestore';
import type { VideoResult } from './youtube';

const COLLECTION = 'youtube_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
// Bump this version whenever search logic changes to invalidate old cached results
const CACHE_VERSION = 2;

// Encode cacheKey to a safe Firestore document ID (no '/', '.' etc.)
function encodeDocId(key: string): string {
    // btoa only works in browser; Buffer in Node. Use encodeURIComponent to be isomorphic.
    return encodeURIComponent(key).replace(/%/g, '_');
}

export function makeCacheKey(
    cityName: string,
    regionCode: string,
    mode: string,
): string {
    return `v${CACHE_VERSION}|${cityName}|${regionCode}|${mode}`;
}

interface CacheDoc {
    videos: VideoResult[];
    cachedAt: number;
    expiresAt: number;
}

/**
 * Retrieve cached videos from Firestore.
 * Returns null if no valid (non-expired) cache found.
 */
export async function getCachedVideos(
    db: Firestore,
    cacheKey: string,
): Promise<VideoResult[] | null> {
    try {
        const docId = encodeDocId(cacheKey);
        const ref = doc(db, COLLECTION, docId);
        const snap = await getDoc(ref);

        if (!snap.exists()) return null;

        const data = snap.data() as CacheDoc;
        if (Date.now() > data.expiresAt) {
            console.info(`[firestore EXPIRED] "${cacheKey}"`);
            return null;
        }

        const remainMinutes = Math.round((data.expiresAt - Date.now()) / 60000);
        console.info(`[firestore HIT] "${cacheKey}" (expires in ${remainMinutes}m)`);
        return data.videos;
    } catch (err) {
        // Never crash the user request due to cache read failure
        console.error('[firestore] getCachedVideos error:', err);
        return null;
    }
}

/**
 * Save videos to Firestore cache.
 */
export async function setCachedVideos(
    db: Firestore,
    cacheKey: string,
    videos: VideoResult[],
): Promise<void> {
    try {
        const docId = encodeDocId(cacheKey);
        const ref = doc(db, COLLECTION, docId);
        const now = Date.now();
        const payload: CacheDoc = {
            videos,
            cachedAt: now,
            expiresAt: now + CACHE_TTL_MS,
        };
        await setDoc(ref, payload);
        console.info(`[firestore SET] "${cacheKey}" (${videos.length} videos, TTL 24h)`);
    } catch (err) {
        // Don't break the response if caching fails
        console.error('[firestore] setCachedVideos error:', err);
    }
}
