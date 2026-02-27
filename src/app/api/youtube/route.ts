// API Route: YouTube video search
import { NextRequest, NextResponse } from 'next/server';
import { searchVideos } from '@/lib/youtube';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('maxResults') || '8', 10);
    const regionCode = searchParams.get('regionCode') || undefined;
    const isCampMode = searchParams.get('isCampMode') === 'true';

    // Local language keywords passed as JSON array string
    // e.g. ["東京 散歩 vlog", "Tokyo walking tour"]
    let localKeywords: string[] | undefined;
    const localKeywordsParam = searchParams.get('localKeywords');
    if (localKeywordsParam) {
        try {
            localKeywords = JSON.parse(localKeywordsParam);
        } catch {
            // ignore parse errors
        }
    }

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
    }

    try {
        const videos = await searchVideos(query, apiKey, maxResults, localKeywords, regionCode, isCampMode);
        return NextResponse.json({ videos });
    } catch (error) {
        console.error('YouTube API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}
