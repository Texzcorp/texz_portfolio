"use client";

import { useEffect, useRef } from 'react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
    src: string;
    isPlaying: boolean;
    audioTime: number;
    className?: string;
}

const VideoPlayer = ({ src, isPlaying, audioTime, className }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Synchroniser la vidéo avec l'audio
        if (Math.abs(video.currentTime - audioTime) > 0.1) {
            video.currentTime = audioTime;
        }

        if (isPlaying) {
            video.play().catch(error => console.error('Error playing video:', error));
        } else {
            video.pause();
        }
    }, [isPlaying, audioTime]);

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            muted // Important : la vidéo doit être muette car le son vient du MusicPlayer
            playsInline
            loop // Optionnel : faire boucler la vidéo si elle est plus courte que l'audio
        />
    );
};

export default VideoPlayer; 