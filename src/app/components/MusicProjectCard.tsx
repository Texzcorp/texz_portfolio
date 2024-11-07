"use client";

import { Flex, Heading, Text, RevealFx } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import VideoPlayer from './VideoPlayer';
import styles from './MusicProjectCard.module.scss';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useMusicPlayerContext } from './MusicPlayerContext';
import { useBackground } from './BackgroundContext';
import VideoThumbnail from './VideoThumbnail';

// Définir l'interface Music ici en attendant
interface Music {
    src: string;
    title: string;
    style: string;
    cover: string;
    isVideo?: boolean; // Indique si cover est une vidéo
    thumbnailTime?: number; // Timecode en secondes pour la miniature
}

interface MusicProjectCardProps {
    href: string;
    mainMusic?: Music;
    extraMusics?: Music[];
    // Supprimé les props non utilisées (image, title, description)
}

export const MusicProjectCard: React.FC<MusicProjectCardProps> = ({
    mainMusic,
    extraMusics,
}) => {
    const [currentMusic, setCurrentMusic] = useState(mainMusic);
    const { activePlayerSrc, setActivePlayerSrc, stopMusic } = useMusicPlayerContext();
    const { startPlaying, stopPlaying } = useBackground();
    const allMusics = mainMusic ? [mainMusic, ...(extraMusics || [])] : extraMusics || [];

    const currentIndex = allMusics.findIndex(music => music.src === currentMusic?.src);
    
    const handleMusicSelect = useCallback((music: Music) => {
        setCurrentMusic(music);
        setActivePlayerSrc(music.src);
    }, [setActivePlayerSrc]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            const prevMusic = allMusics[currentIndex - 1];
            setCurrentMusic(prevMusic);
            setActivePlayerSrc(prevMusic.src);
        }
    }, [currentIndex, allMusics, setActivePlayerSrc]);

    const handleNext = useCallback(() => {
        if (currentIndex < allMusics.length - 1) {
            const nextMusic = allMusics[currentIndex + 1];
            setCurrentMusic(nextMusic);
            setActivePlayerSrc(nextMusic.src);
        }
    }, [currentIndex, allMusics, setActivePlayerSrc]);

    useEffect(() => {
        const currentlyPlayingMusic = allMusics.find(music => music.src === activePlayerSrc);
        if (currentlyPlayingMusic) {
            setCurrentMusic(currentlyPlayingMusic);
        }
    }, [activePlayerSrc, allMusics]);

    const handlePlay = useCallback((src: string) => {
        setActivePlayerSrc(src);
        startPlaying();
    }, [setActivePlayerSrc, startPlaying]);

    const handleStop = useCallback((src: string) => {
        stopMusic(src);
        stopPlaying();
    }, [stopMusic, stopPlaying]);

    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);

    const handleTimeUpdate = (time: number) => {
        setCurrentAudioTime(time);
    };

    const handlePlayingStateChange = (playing: boolean) => {
        setIsCurrentlyPlaying(playing);
    };

    const [isVideoVisible, setIsVideoVisible] = useState(false);
    const videoWrapperRef = useRef<HTMLDivElement>(null);

    // Ajouter un useEffect pour le debug
    // useEffect(() => {
    //     console.log('Debug:', {
    //         currentMusic,
    //         isVideoVisible,
    //         isCurrentlyPlaying,
    //         currentAudioTime
    //     });
    // }, [currentMusic, isVideoVisible, isCurrentlyPlaying, currentAudioTime]);

    // Observer d'intersection pour charger la vidéo uniquement quand elle est visible
    useEffect(() => {
        if (!videoWrapperRef.current) return;

        console.log('Setting up IntersectionObserver');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    console.log('Intersection:', entry.isIntersecting);
                    setIsVideoVisible(entry.isIntersecting);
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1
            }
        );

        observer.observe(videoWrapperRef.current);

        return () => observer.disconnect();
    }, []);

    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

    // Charger la vidéo uniquement quand nécessaire
    useEffect(() => {
        if (!videoWrapperRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoadVideo(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '100px',
                threshold: 0.1
            }
        );

        observer.observe(videoWrapperRef.current);
        return () => observer.disconnect();
    }, []);

    const [nextVideo, setNextVideo] = useState<string | null>(null);

    // Préchargement de la prochaine vidéo
    useEffect(() => {
        if (!currentMusic?.isVideo) return;
        
        const currentIndex = allMusics.findIndex(m => m.src === currentMusic.src);
        const nextMusic = allMusics[(currentIndex + 1) % allMusics.length];
        
        if (nextMusic?.isVideo) {
            const preloadVideo = new Image();
            preloadVideo.src = nextMusic.cover;
            setNextVideo(nextMusic.cover);
        }
    }, [currentMusic, allMusics]);

    return (
        <div className={styles.outerReveal}>
            <div className={styles.innerReveal}>
                <div className={styles.cardContainer}>
                    <div className={styles.mainSection}>
                        <div className={styles.imageWrapper} ref={videoWrapperRef}>
                            {currentMusic && currentMusic.cover && (
                                currentMusic.isVideo ? (
                                    shouldLoadVideo ? (
                                        <VideoPlayer
                                            src={currentMusic.cover}
                                            isPlaying={isCurrentlyPlaying}
                                            audioTime={currentAudioTime}
                                            className={styles.coverImage}
                                        />
                                    ) : (
                                        <img 
                                            src={currentMusic.cover}
                                            alt={currentMusic.title}
                                            className={styles.coverImage}
                                        />
                                    )
                                ) : (
                                    <img 
                                        src={currentMusic.cover}
                                        alt={currentMusic.title}
                                        className={styles.coverImage}
                                    />
                                )
                            )}
                        </div>
                        <div className={styles.mainContent}>
                            <div className={styles.titleSection}>
                                <Heading as="h3" variant="heading-strong-s">
                                    {currentMusic?.title}
                                </Heading>
                                <Text variant="body-strong-s" className={styles.styleText}>
                                    {currentMusic?.style}
                                </Text>
                            </div>
                            {currentMusic && (
                                <div className={styles.mainPlayer}>
                                    <MusicPlayer 
                                        src={currentMusic.src}
                                        onPrevious={handlePrevious}
                                        onNext={handleNext}
                                        hasPrevious={currentIndex > 0}
                                        hasNext={currentIndex < allMusics.length - 1}
                                        onTimeUpdate={(time) => setCurrentAudioTime(time)}
                                        onPlayingStateChange={(playing) => setIsCurrentlyPlaying(playing)}
                                        onEnded={() => {
                                            const nextIndex = (currentIndex + 1) % allMusics.length;
                                            const nextMusic = allMusics[nextIndex];
                                            setCurrentMusic(nextMusic);
                                            setActivePlayerSrc(nextMusic.src);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {allMusics.length > 0 && (
                        <div className={styles.playlistSection}>
                            <div className={styles.playlistHeader}>
                                <Text variant="heading-strong-s">Music Collection</Text>
                            </div>
                            <div className={styles.playlist}>
                                {allMusics.map((music, index) => (
                                    <div 
                                        key={index} 
                                        className={`${styles.playlistItem} ${music.src === activePlayerSrc ? styles.active : ''}`}
                                        onClick={() => handleMusicSelect(music)}
                                    >
                                        <div className={styles.playlistItemContent}>
                                            <div className={styles.miniCover}>
                                                {music.isVideo ? (
                                                    <VideoThumbnail 
                                                        src={music.cover}
                                                        time={music.thumbnailTime || 0}
                                                        className={styles.miniCoverImage}
                                                    />
                                                ) : (
                                                    <img 
                                                        src={music.cover} 
                                                        alt={music.title} 
                                                        className={styles.miniCoverImage}
                                                    />
                                                )}
                                            </div>
                                            <div className={styles.trackInfo}>
                                                <Text className={styles.trackTitle}>
                                                    {music.title}
                                                </Text>
                                                <Text className={styles.trackStyle}>
                                                    {music.style}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {nextVideo && (
                <link rel="preload" as="video" href={nextVideo} />
            )}
        </div>
    );
};

