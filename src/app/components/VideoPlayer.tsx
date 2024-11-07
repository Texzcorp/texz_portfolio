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
    const visibilityRef = useRef(true);

    // Configuration initiale optimisée pour petite vidéo
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Configuration de base optimisée pour 350x350
        video.playsInline = true;
        video.muted = true;
        video.loop = true;
        video.width = 350;
        video.height = 350;
        
        // Optimisation du buffer pour petite vidéo
        video.preload = "auto";
        video.setAttribute('playsinline', '');
        
        // Réduire la qualité pour performance
        if ('mediaKeys' in video) {
            video.style.objectFit = 'cover';
            video.style.transform = 'translateZ(0)';
        }

        const handleLoaded = () => setIsLoaded(true);
        video.addEventListener('loadeddata', handleLoaded);

        // Gestion optimisée de la visibilité
        const handleVisibilityChange = () => {
            visibilityRef.current = !document.hidden;
            if (document.hidden) {
                video.pause();
            } else if (isPlaying) {
                video.play().catch(() => {});
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            video.removeEventListener('loadeddata', handleLoaded);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [src]);

    // Gestion optimisée lecture/pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded || !visibilityRef.current) return;

        if (isPlaying) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isPlaying, isLoaded]);

    // Synchronisation optimisée
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded || !visibilityRef.current) return;

        // Synchroniser seulement si nécessaire
        const drift = Math.abs(video.currentTime - audioTime);
        if (drift > 0.1) {
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
                width="350"
                height="350"
                preload="auto"
            />
        </div>
    );
};

export default VideoPlayer;