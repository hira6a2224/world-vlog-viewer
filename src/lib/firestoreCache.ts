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
    updateDoc,
    increment,
    collection,
    getDocs,
    query,
    where,
    type Firestore,
} from 'firebase/firestore';
import type { VideoResult } from './youtube';

const COLLECTION = 'youtube_cache';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days (extended to save API quota)
// Bump this version whenever search logic changes to invalidate old cached results
const CACHE_VERSION = 5;

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

// ── Video Ratings ────────────────────────────────────────────────────────────
export interface VideoRating {
    likes: number;
    dislikes: number;
}

export async function rateVideo(
    db: Firestore,
    videoId: string,
    isGood: boolean
): Promise<void> {
    try {
        const ref = doc(db, 'video_ratings', videoId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            await updateDoc(ref, {
                [isGood ? 'likes' : 'dislikes']: increment(1),
            });
        } else {
            await setDoc(ref, {
                likes: isGood ? 1 : 0,
                dislikes: isGood ? 0 : 1,
            });
        }
    } catch (err) {
        console.error('[firestore] rateVideo error:', err);
    }
}

export async function getVideoRatings(
    db: Firestore,
    videoIds: string[],
): Promise<Record<string, VideoRating>> {
    if (videoIds.length === 0) return {};
    try {
        const ratingsMap: Record<string, VideoRating> = {};
        // Firestore 'in' query supports up to 10 elements
        const chunks = [];
        for (let i = 0; i < videoIds.length; i += 10) {
            chunks.push(videoIds.slice(i, i + 10));
        }

        for (const chunk of chunks) {
            const q = query(collection(db, 'video_ratings'), where('__name__', 'in', chunk));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                ratingsMap[docSnap.id] = {
                    likes: data.likes || 0,
                    dislikes: data.dislikes || 0,
                };
            });
        }
        return ratingsMap;
    } catch (err) {
        console.error('[firestore] getVideoRatings error:', err);
        return {};
    }
}
