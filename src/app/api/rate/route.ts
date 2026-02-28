import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { rateVideo } from '@/lib/firestoreCache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { videoId, isGood } = body;

        if (!videoId || typeof isGood !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        await rateVideo(db, videoId, isGood);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to rate video:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
