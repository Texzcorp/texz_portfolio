"use client";

import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
    src: string;
    time?: number;
    className?: string;
}

const VideoThumbnail = ({ src, time = 0, className }: VideoThumbnailProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedData = () => {
            video.currentTime = time;
            setIsReady(true);
        };

        video.addEventListener('loadeddata', handleLoadedData);
        
        return () => {
            video.removeEventListener('loadeddata', handleLoadedData);
        };
    }, [time]);

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            preload="metadata"
            muted
            playsInline
            style={{ opacity: isReady ? 1 : 0 }}
        />
    );
};

export default VideoThumbnail; 