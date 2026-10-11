"use client";

import { Flex, Heading, Icon, Text } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import VideoPlayer from './VideoPlayer';
import styles from './MusicProjectCard.module.scss';
import { useState, useCallback, useMemo } from 'react';
import { useMusicPlayerContext } from './MusicPlayerContext';

interface Music {
    src: string;
    title: string;
    style: string;
    cover: string;
    isVideo?: boolean;
    thumbnailTime?: number;
    description?: string;
}

interface MusicProjectCardProps {
    href: string;
    mainMusic?: Music;
    extraMusics?: Music[];
    headingLevel?: 'h1' | 'h2' | 'h3';
}

export const MusicProjectCard: React.FC<MusicProjectCardProps> = ({ mainMusic, extraMusics, headingLevel = 'h2' }) => {
    const allMusics = useMemo(() => mainMusic ? [mainMusic, ...(extraMusics || [])] : extraMusics || [], [mainMusic, extraMusics]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const { activePlayerSrc, setActivePlayerSrc } = useMusicPlayerContext();
    const currentMusic = allMusics[currentIndex];

    const selectTrack = useCallback((index: number) => {
        if (index !== currentIndex) {
            setCurrentAudioTime(0);
            setIsPlaying(false);
        }
        setCurrentIndex(index);
        setActivePlayerSrc(allMusics[index].src);
    }, [allMusics, currentIndex, setActivePlayerSrc]);

    const onTimeUpdate = useCallback((time: number) => setCurrentAudioTime(time), []);
    const onPlayingStateChange = useCallback((playing: boolean) => setIsPlaying(playing), []);
    const onEnded = useCallback(() => selectTrack((currentIndex + 1) % allMusics.length), [currentIndex, allMusics.length, selectTrack]);

    if (!currentMusic) return null;

    return (
        <div className={styles.outerReveal}>
            <div className={styles.innerReveal}>
                <Flex className={styles.cardContainer}>
                    <Flex direction="column" className={styles.mainSection}>
                        <div className={styles.imageWrapper}>
                            {currentMusic.isVideo ? (
                                <VideoPlayer
                                    key={currentMusic.cover}
                                    src={currentMusic.cover}
                                    poster={currentMusic.cover.replace('.mp4', '.jpg')}
                                    thumbnailTime={currentMusic.thumbnailTime}
                                    isPlaying={isPlaying}
                                    audioTime={currentAudioTime}
                                    className={styles.coverImage}
                                />
                            ) : <img src={currentMusic.cover} alt={currentMusic.title + ' artwork'} className={styles.coverImage} />}
                        </div>
                        <Flex direction="column" className={styles.mainContent}>
                            <Flex direction="column" className={styles.titleSection}>
                                <Heading as="h3" variant="heading-strong-m">{currentMusic.title}</Heading>
                                <Text variant="body-default-s" onBackground="brand-weak">{currentMusic.style}</Text>
                                {currentMusic.description && <Text as="p" variant="body-default-xs" onBackground="neutral-weak" align="center">{currentMusic.description}</Text>}
                            </Flex>
                            <div className={styles.mainPlayer}>
                                <MusicPlayer
                                    src={currentMusic.src}
                                    title={currentMusic.title}
                                    onPrevious={() => selectTrack(currentIndex - 1)}
                                    onNext={() => selectTrack(currentIndex + 1)}
                                    hasPrevious={currentIndex > 0}
                                    hasNext={currentIndex < allMusics.length - 1}
                                    onTimeUpdate={onTimeUpdate}
                                    onPlayingStateChange={onPlayingStateChange}
                                    onEnded={onEnded}
                                />
                            </div>
                        </Flex>
                    </Flex>
                    <Flex direction="column" className={styles.playlistSection}>
                        <Flex className={styles.playlistHeader} gap="8" direction="column">
                            <Heading as={headingLevel} variant="heading-strong-s">Music Collection</Heading>
                            <Text variant="body-default-xs" onBackground="neutral-weak">Selected pieces, different directions. Choose a track to listen.</Text>
                        </Flex>
                        <div className={styles.playlist} aria-label="On-site audio collection">
                            {allMusics.map((music, index) => (
                                <button key={music.src} type="button" aria-label={'Play ' + music.title} aria-pressed={currentIndex === index} className={styles.playlistItem + (currentIndex === index ? ' ' + styles.active : '')} onClick={() => selectTrack(index)}>
                                    <Flex gap="16" alignItems="center" fillWidth>
                                        <div className={styles.miniCover}>
                                            <img src={music.isVideo ? music.cover.replace('.mp4', '.jpg') : music.cover} alt="" className={styles.miniCoverImage} loading="lazy" />
                                        </div>
                                        <Flex direction="column" gap="4" className={styles.trackInfo}>
                                            <Text variant="body-strong-s" className={styles.trackTitle}>{music.title}</Text>
                                            <Text variant="body-default-xs" onBackground="brand-weak">{music.style}</Text>
                                        </Flex>
                                        {activePlayerSrc === music.src && <Icon name="musicNote" onBackground="brand-weak" size="s" />}
                                    </Flex>
                                </button>
                            ))}
                        </div>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
};

