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
    isCampMode: boolean = false,
): Promise<VideoResult[]> {
    // Build a rich multi-language query
    // Camp mode uses outdoor/camping keywords; Vlog mode uses walking tour + local language
    let fullQuery: string;
    if (isCampMode) {
        fullQuery = `${query} Solo Camping OR Bushcraft OR Outdoor vlog OR Nature ASMR`;
    } else {
        const localPart = localKeywords && localKeywords.length > 0
            ? localKeywords.join(' OR ')
            : '';
        const baseQuery = `${query} walking tour vlog`;
        fullQuery = localPart ? `(${baseQuery}) OR (${localPart})` : baseQuery;
    }

    // Fetch medium (4-20min) videos
    const fetchPage = async (duration: 'medium' | 'long') => {
        const params: Record<string, string> = {
            part: 'snippet',
            q: fullQuery,
            type: 'video',
            order: 'viewCount',
            videoEmbeddable: 'true',
            videoDuration: duration,
            maxResults: String(Math.ceil(maxResults * 1.5)), // fetch extra to compensate for filtering
            key: apiKey,
        };
        if (regionCode) {
            params.relevanceLanguage = getLanguageFromRegion(regionCode);
        }
        const res = await fetch(`${YOUTUBE_API_BASE}/search?${new URLSearchParams(params)}`);
        if (!res.ok) {
            throw new Error(`YouTube Search API error: ${res.status}`);
        }
        const data = await res.json();
        return data.items ?? [];
    };

    // Fetch both medium and long in parallel
    const [mediumItems, longItems] = await Promise.all([
        fetchPage('medium'),
        fetchPage('long'),
    ]);

    // Merge and de-duplicate by video ID
    const seen = new Set<string>();
    const allItems: Array<{ id: { videoId: string }; snippet: Record<string, unknown> }> = [];
    for (const item of [...mediumItems, ...longItems]) {
        const vid = item.id?.videoId;
        if (vid && !seen.has(vid)) {
            seen.add(vid);
            allItems.push(item);
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

    const MIN_VIEWS = 10000;
    const MIN_DURATION_SECONDS = 10 * 60; // 10 minutes

    const results: VideoResult[] = [];
    for (const item of allItems) {
        const vid = item.id.videoId;
        const details = detailsMap[vid];
        if (!details) continue;

        const viewCount = parseInt(details.viewCount, 10);
        const { durationSeconds } = details;

        // Quality filter: viewCount >= 10,000 AND duration >= 10 minutes
        if (viewCount < MIN_VIEWS || durationSeconds < MIN_DURATION_SECONDS) continue;

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
