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

    // Build search queries - we'll run 2 focused queries and merge
    const queries: string[] = [];

    if (mode === 'camp') {
        queries.push(`"${query}" Solo Camping OR Bushcraft OR Outdoor vlog`);
    } else if (mode === 'scenic') {
        queries.push(`"${query}" drone 4K aerial view`);
        queries.push(`"${query}" scenic cinematic travel`);
    } else {
        // Vlog mode: city name is always required (quoted for exact match)
        queries.push(`"${query}" walking tour daytime 4K`);
        // Also add a local-language query if available
        if (localKeywords && localKeywords.length > 0) {
            // Include the city name with local keywords for tight relevance
            queries.push(`"${query}" ${localKeywords[0]}`);
        }
    }

    // Fetch videos for a single query + duration combo
    const fetchPage = async (q: string, duration: 'medium' | 'long') => {
        const params: Record<string, string> = {
            part: 'snippet',
            q: q,
            type: 'video',
            order: 'relevance', // relevance instead of viewCount for better topic match
            videoEmbeddable: 'true',
            videoDuration: duration,
            maxResults: String(Math.ceil(maxResults * 1.5)),
            key: apiKey,
        };
        if (regionCode) {
            params.regionCode = regionCode; // restrict results to the target country
            params.relevanceLanguage = getLanguageFromRegion(regionCode);
        }
        const res = await fetch(`${YOUTUBE_API_BASE}/search?${new URLSearchParams(params)}`);
        if (!res.ok) {
            throw new Error(`YouTube Search API error: ${res.status}`);
        }
        const data = await res.json();
        return data.items ?? [];
    };

    // Run all query + duration combinations in parallel
    const fetchPromises = queries.flatMap(q => [
        fetchPage(q, 'medium'),
        fetchPage(q, 'long'),
    ]);
    const allResults = await Promise.all(fetchPromises);

    // Merge and de-duplicate by video ID
    const seen = new Set<string>();
    const allItems: Array<{ id: { videoId: string }; snippet: Record<string, unknown> }> = [];
    for (const items of allResults) {
        for (const item of items) {
            const vid = item.id?.videoId;
            if (vid && !seen.has(vid)) {
                seen.add(vid);
                allItems.push(item);
            }
        }
    }

    if (allItems.length === 0) return [];

    // Get detailed video info: statistics + contentDetails (for duration)
    const videoIds = allItems.map(item => item.id.videoId).join(',');
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

    const MIN_VIEWS = 5000; // slightly relaxed to get more relevant hits
    const MIN_DURATION_SECONDS = 8 * 60; // 8 minutes to allow slightly shorter well-made content
    const queryLower = query.toLowerCase();

    const results: VideoResult[] = [];
    for (const item of allItems) {
        const vid = item.id.videoId;
        const details = detailsMap[vid];
        if (!details) continue;

        const viewCount = parseInt(details.viewCount, 10);
        const { durationSeconds } = details;

        // Quality filter: viewCount and duration
        if (viewCount < MIN_VIEWS || durationSeconds < MIN_DURATION_SECONDS) continue;

        const title = ((item.snippet as { title: string }).title || '').toLowerCase();
        const channelTitle = ((item.snippet as { channelTitle: string }).channelTitle || '').toLowerCase();

        // Title relevance filter: the video title should mention the city name
        // (skip this for camp/scenic where the title might not contain the city name exactly)
        if (mode === 'vlog') {
            const cityNameVariants = [queryLower];
            // For Japanese cities, also check common transliterations
            if (localKeywords && localKeywords.length > 0) {
                for (const kw of localKeywords) {
                    // Extract the first word (likely the city name in local language)
                    const localCity = kw.split(/\s+/)[0].toLowerCase();
                    if (localCity.length > 1) cityNameVariants.push(localCity);
                }
            }
            const titleMatchesCity = cityNameVariants.some(variant => title.includes(variant));
            if (!titleMatchesCity) continue; // skip videos that don't mention the city
        }

        // Exclude negative content
        const hasExcludedTerm = EXCLUDE_TERMS.some(term =>
            title.includes(term.toLowerCase()) || channelTitle.includes(term.toLowerCase())
        );
        if (hasExcludedTerm) continue;

        results.push({
            id: vid,
            title: (item.snippet as { title: string }).title,
            channelTitle: (item.snippet as { channelTitle: string }).channelTitle,
            channelId: (item.snippet as { channelId: string }).channelId,
            thumbnail: (item.snippet as { thumbnails: { high: { url: string } } }).thumbnails?.high?.url || '',
            viewCount: details.viewCount,
            publishedAt: (item.snippet as { publishedAt: string }).publishedAt,
            durationSeconds,
        });

        if (results.length >= maxResults) break;
    }

    // Sort results by view count descending (best videos first among filtered set)
    results.sort((a, b) => parseInt(b.viewCount, 10) - parseInt(a.viewCount, 10));

    return results;
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
