"use client";

import { Flex, Heading, Text, RevealFx } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import styles from './MusicProjectCard.module.scss';
import { useState, useCallback, useEffect } from 'react';
import { useMusicPlayerContext } from './MusicPlayerContext';
import { useBackground } from './BackgroundContext';

// Définir l'interface Music ici en attendant
interface Music {
    src: string;
    title: string;
    style: string;
    cover: string;
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

    return (
        <div className={styles.cardContainer}>
            <div className={styles.mainSection}>
                <RevealFx delay={0.25} speed="slow">
                    <div className={styles.imageWrapper}>
                        {currentMusic?.cover && (
                            <img 
                                src={currentMusic.cover} 
                                alt={currentMusic.title} 
                                className={styles.coverImage} 
                            />
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
                                />
                            </div>
                        )}
                    </div>
                </RevealFx>
            </div>

            {allMusics.length > 0 && (
                <div className={styles.playlistSection}>
                    <RevealFx delay={0.4} speed="slow">
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
                                            <img 
                                                src={music.cover} 
                                                alt={music.title} 
                                                className={styles.miniCoverImage}
                                            />
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
                    </RevealFx>
                </div>
            )}
        </div>
    );
};

