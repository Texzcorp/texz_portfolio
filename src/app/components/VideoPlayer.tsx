"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
    src: string;
    isPlaying: boolean;
    audioTime: number;
    className?: string;
}

const VideoPlayer = ({ src, isPlaying, audioTime, className }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialisation unique de la vidéo
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Configuration de base
        video.playsInline = true;
        video.muted = true;
        video.loop = true;
        video.preload = "auto";

        const handleLoad = () => setIsLoaded(true);
        video.addEventListener('loadeddata', handleLoad);
        
        return () => {
            video.removeEventListener('loadeddata', handleLoad);
        };
    }, []);

    // Gestion de la lecture/pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded) return;

        if (isPlaying) {
            video.play();
        } else {
            video.pause();
        }
    }, [isPlaying, isLoaded]);

    // Gestion du temps
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded) return;

        // Seulement mettre à jour si le décalage est significatif
        if (Math.abs(video.currentTime - audioTime) > 0.2) {
            video.currentTime = audioTime;
        }
    }, [audioTime, isLoaded]);

    return (
        <div className={styles.videoWrapper}>
            <video
                ref={videoRef}
                src={src}
                className={`${className} ${styles.video} ${isLoaded ? styles.loaded : ''}`}
                muted
                playsInline
                loop
            />
        </div>
    );
};

export default VideoPlayer;