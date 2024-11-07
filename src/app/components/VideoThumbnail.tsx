"use client";

import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
    src: string;
    time?: number;
    className?: string;
}

const VideoThumbnail = ({ src, time = 0, className }: VideoThumbnailProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const handleLoadedMetadata = () => {
            video.currentTime = time;
        };

        const handleSeeked = () => {
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                setIsReady(true);
            }
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('seeked', handleSeeked);

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('seeked', handleSeeked);
        };
    }, [time]);

    return (
        <div className={className} style={{ position: 'relative' }}>
            <video
                ref={videoRef}
                src={src}
                preload="metadata"
                muted
                playsInline
                style={{ display: 'none' }}
            />
            <canvas
                ref={canvasRef}
                width={160} // Set the desired width
                height={160} // Set the desired height
                style={{ opacity: isReady ? 1 : 0, width: '100%', height: 'auto' }}
            />
        </div>
    );
};

export default VideoThumbnail; 