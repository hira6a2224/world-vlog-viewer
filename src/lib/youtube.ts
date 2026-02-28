// YouTube Data API v3 Service
// Searches for walking tour / POV vlog videos by location
// Supports local language queries, quality filters, and 10+ minute duration filtering

export interface VideoResult {
    id: string;
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnail: string;
    viewCount: string;
    publishedAt: string;
    durationSeconds: number;
}

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Parse ISO 8601 duration (PT1H2M3S) to seconds
function parseDuration(iso: string): number {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
}

export async function searchVideos(
    query: string,
    apiKey: string,
    maxResults: number = 10,
    localKeywords?: string[],
    regionCode?: string,
    mode: 'vlog' | 'camp' | 'scenic' = 'vlog',
): Promise<VideoResult[]> {
    // Negative keywords to exclude nightlife / sketchy / reaction content
    const EXCLUDE_TERMS = [
        'nightlife', 'night walk', 'red light', 'reaction',
        'kabukicho', '歌舞伎町', 'tokoyoko', '東横',
        'dangerous', 'worst', 'scam', 'scary',
    ];

    // Build tiered search queries: specific → broader fallback
    const queries: string[] = [];

    if (mode === 'camp') {
        queries.push(`${query} Solo Camping OR Bushcraft OR Outdoor vlog`);
        queries.push(`${query} camping travel`);
    } else if (mode === 'scenic') {
        queries.push(`${query} drone 4K aerial view`);
        queries.push(`${query} scenic cinematic travel`);
    } else {
        // Vlog mode: combine walking tour with local keywords for tight relevance
        if (localKeywords && localKeywords.length > 0) {
            queries.push(`${query} walking tour 4K ${localKeywords[0]}`);
        } else {
            queries.push(`${query} walking tour 4K`);
        }
        // Broader fallback: travel vlog (catches regions like Hokkaido)
        queries.push(`${query} travel vlog walk`);
    }

    // Helper to fetch and filter a single query
    const fetchAndFilter = async (q: string): Promise<VideoResult[]> => {
        const params: Record<string, string> = {
            part: 'snippet',
            q: q,
            type: 'video',
            order: 'relevance',
            videoEmbeddable: 'true',
            // videoDuration removed: fetching all lengths at once saves 50% API quota
            maxResults: String(maxResults * 2), // fetch extra to account for filtering
            key: apiKey,
        };
        if (regionCode) {
            params.regionCode = regionCode;
            params.relevanceLanguage = getLanguageFromRegion(regionCode);
        }

        const res = await fetch(`${YOUTUBE_API_BASE}/search?${new URLSearchParams(params)}`);
        if (!res.ok) throw new Error(`YouTube Search API error: ${res.status}`);
        const data = await res.json();
        const items = data.items ?? [];
        if (items.length === 0) return [];

        // Get detailed video info: statistics + contentDetails (for duration)
        const videoIds = items.map((item: any) => item.id.videoId).join(',');
        const detailsParams = new URLSearchParams({
            part: 'statistics,contentDetails',
            id: videoIds,
            key: apiKey,
        });
        const detailsRes = await fetch(`${YOUTUBE_API_BASE}/videos?${detailsParams}`);
        const detailsData = await detailsRes.json();

        const detailsMap: Record<string, { viewCount: string; durationSeconds: number }> = {};
        if (detailsData.items) {
            for (const item of detailsData.items) {
                detailsMap[item.id] = {
                    viewCount: item.statistics?.viewCount || '0',
                    durationSeconds: parseDuration(item.contentDetails?.duration || ''),
                };
            }
        }

        const MIN_VIEWS = 3000;
        const MIN_DURATION_SECONDS = 5 * 60; // 5 minutes minimum

        // Build city name variants for title matching
        const queryLower = query.toLowerCase();
        const cityNameVariants = [queryLower];
        if (localKeywords && localKeywords.length > 0) {
            for (const kw of localKeywords) {
                const localCity = kw.split(/\s+/)[0].toLowerCase();
                if (localCity.length > 1) cityNameVariants.push(localCity);
            }
        }

        const results: VideoResult[] = [];
        for (const item of items) {
            const vid = item.id.videoId;
            const details = detailsMap[vid];
            if (!details) continue;

            const viewCount = parseInt(details.viewCount, 10);
            const { durationSeconds } = details;

            // Quality filter
            if (viewCount < MIN_VIEWS || durationSeconds < MIN_DURATION_SECONDS) continue;

            const title = ((item.snippet as { title: string }).title || '').toLowerCase();
            const description = ((item.snippet as { description: string }).description || '').toLowerCase();
            const channelTitle = ((item.snippet as { channelTitle: string }).channelTitle || '').toLowerCase();

            // Relevance filter: city name should appear in title OR description
            const matchesCity = cityNameVariants.some(variant =>
                title.includes(variant) || description.includes(variant)
            );

            if (!matchesCity) continue;

            // Negative filter: exclude nightlife, dangerous areas, etc.
            const hasNegativeTerm = EXCLUDE_TERMS.some(term =>
                title.includes(term) || description.includes(term)
            );

            if (hasNegativeTerm) continue;

            results.push({
                id: vid,
                title: (item.snippet as any).title,
                channelId: (item.snippet as any).channelId,
                channelTitle: (item.snippet as any).channelTitle,
                publishedAt: (item.snippet as any).publishedAt,
                thumbnail: (item.snippet as any).thumbnails?.high?.url || (item.snippet as any).thumbnails?.default?.url,
                viewCount: details.viewCount,
                durationSeconds,
            });
        }

        return results;
    };

    // ── Lazy Fetching: Run queries sequentially ──
    // If the first (most specific) query returns enough good results, we don't even run the fallbacks.
    const finalResults: VideoResult[] = [];
    const seenVids = new Set<string>();

    for (const q of queries) {
        if (finalResults.length >= maxResults) break; // We have enough! Stop wasting API quota.
        try {
            const batch = await fetchAndFilter(q);
            for (const video of batch) {
                if (!seenVids.has(video.id)) {
                    seenVids.add(video.id);
                    finalResults.push(video);
                }
            }
        } catch (err) {
            console.error(`Error fetching query "${q}":`, err);
            // If it's a quota error, we should probably abort entirely instead of trying the next query
            if (err instanceof Error && (err.message.includes('403') || err.message.includes('quota'))) {
                throw err;
            }
        }
    }

    // Sort by relevance (we rely on YouTube's inherent relevance sorting from the API, 
    // but if we mixed queries we just keep the order they were found in, 
    // which naturally prioritizes the first, most specific query.)

    return finalResults.slice(0, maxResults);
}

// Map YouTube regionCode to a primary language for relevanceLanguage
function getLanguageFromRegion(regionCode: string): string {
    const map: Record<string, string> = {
        JP: 'ja', KR: 'ko', CN: 'zh-Hans', TH: 'th', VN: 'vi',
        SG: 'en', ID: 'id', AE: 'ar', TR: 'tr', SA: 'ar',
        MA: 'ar', FR: 'fr', IT: 'it', ES: 'es', GB: 'en',
        CZ: 'cs', NL: 'nl', US: 'en', MX: 'es', BR: 'pt',
        ZA: 'en', KE: 'en', AU: 'en',
    };
    return map[regionCode] ?? 'en';
}

export function formatViewCount(count: string): string {
    const n = parseInt(count, 10);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
}
