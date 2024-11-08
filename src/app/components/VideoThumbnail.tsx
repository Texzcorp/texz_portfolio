"use client";

import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
    src: string;
    time?: number;
    className?: string;
}

const VideoThumbnail = ({ src, time = 0, className }: VideoThumbnailProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsReady(false);

        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
            video.src = '';
            video.load();
            URL.revokeObjectURL(video.src);
        };

        video.onloadedmetadata = () => {
            video.currentTime = Math.min(time, video.duration);
        };

        video.onseeked = () => {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                setIsReady(true);
                cleanup();
            }
        };

        video.onerror = () => {
            console.error('Error loading video thumbnail');
            setIsReady(false);
            cleanup();
        };

        video.src = src;

        return cleanup;
    }, [src, time]);

    return (
        <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    opacity: isReady ? 1 : 0,
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease-in-out'
                }}
            />
            {!isReady && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f0f0f0'
                }} />
            )}
        </div>
    );
};

export default VideoThumbnail; 