'use client';

import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
    videoId: string;
    onEnded?: () => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function YouTubePlayer({ videoId, onEnded }: YouTubePlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const createPlayer = () => {
            if (!containerRef.current || cancelled) return;

            // Destroy old player
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { }
                playerRef.current = null;
            }

            // Create a fresh div for the player
            const playerDiv = document.createElement('div');
            playerDiv.id = 'yt-player-' + Date.now();
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(playerDiv);

            playerRef.current = new window.YT.Player(playerDiv.id, {
                videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                    controls: 1,
                    fs: 1,
                    playsinline: 1,
                },
                events: {
                    onReady: () => { if (!cancelled) setIsReady(true); },
                    onStateChange: (event: any) => {
                        if (event.data === window.YT.PlayerState.ENDED && onEnded) {
                            onEnded();
                        }
                    },
                },
            });
        };

        const loadAPI = () => {
            if (window.YT && window.YT.Player) {
                createPlayer();
                return;
            }

            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prev) prev();
                createPlayer();
            };

            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(script);
            }
        };

        // 描画の連鎖を防ぐため（ESLintエラー回避）、非同期でStateを更新します
        setTimeout(() => setIsReady(false), 0);
        loadAPI();

        return () => {
            cancelled = true;
            if (playerRef.current) {
                try { playerRef.current.destroy(); } catch { }
                playerRef.current = null;
            }
        };
    }, [videoId, onEnded]);

    return (
        <div className="relative w-full h-full bg-black">
            <div
                ref={containerRef}
                className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>div]:w-full [&>div]:h-full"
                style={{ position: 'absolute', inset: 0 }}
            />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
/* eslint-enable @typescript-eslint/no-explicit-any */
