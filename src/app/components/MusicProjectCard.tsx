"use client";

import { Flex, Heading, Text, RevealFx } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import styles from './MusicProjectCard.module.scss';
import { useState, useCallback, useEffect } from 'react';
import { useMusicPlayerContext } from './MusicPlayerContext';

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
}

export const MusicProjectCard: React.FC<MusicProjectCardProps> = ({
    mainMusic,
    extraMusics,
}) => {
    const [currentMusic, setCurrentMusic] = useState(mainMusic);
    const { activePlayerSrc, setActivePlayerSrc } = useMusicPlayerContext();
    const allMusics = mainMusic ? [mainMusic, ...(extraMusics || [])] : extraMusics || [];

    const handleMusicSelect = useCallback((music: Music) => {
        if (activePlayerSrc === music.src) {
            setActivePlayerSrc(null);
        } else {
            setCurrentMusic(music);
            setActivePlayerSrc(music.src);
        }
    }, [activePlayerSrc, setActivePlayerSrc]);

    useEffect(() => {
        const currentlyPlayingMusic = allMusics.find(music => music.src === activePlayerSrc);
        if (currentlyPlayingMusic) {
            setCurrentMusic(currentlyPlayingMusic);
        }
    }, [activePlayerSrc, allMusics]);

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
                                    title={currentMusic.title}
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

