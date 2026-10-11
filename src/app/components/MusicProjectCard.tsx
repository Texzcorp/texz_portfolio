"use client";

import { Flex, Heading, Icon, SmartLink, Text, ToggleButton } from '@/once-ui/components';
import MusicPlayer from './MusicPlayer';
import VideoPlayer from './VideoPlayer';
import styles from './MusicProjectCard.module.scss';
import { useState, useCallback, useMemo } from 'react';
import { useMusicPlayerContext } from './MusicPlayerContext';
import { musicSelection, supportingMusic } from '@/app/resources/portfolio';

interface Music {
    src: string;
    title: string;
    style: string;
    cover: string;
    isVideo?: boolean;
    thumbnailTime?: number;
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
    const [view, setView] = useState<'collection' | 'references'>('collection');
    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const { activePlayerSrc, setActivePlayerSrc, stopAllMusic } = useMusicPlayerContext();
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
                            <Flex gap="4" padding="4" radius="m" background="surface" border="neutral-medium" borderStyle="solid-1" role="group" aria-label="Music library">
                                <ToggleButton selected={view === 'collection'} onClick={() => setView('collection')} width="fill" size="s">Listen here</ToggleButton>
                                <ToggleButton selected={view === 'references'} onClick={() => setView('references')} width="fill" size="s" prefixIcon="youtube">On YouTube</ToggleButton>
                            </Flex>
                        </Flex>
                        <div className={styles.playlist} aria-label={view === 'collection' ? 'On-site audio collection' : 'YouTube references'}>
                            {view === 'collection' ? allMusics.map((music, index) => (
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
                            )) : (
                                <>
                                    <Text variant="label-default-s" onBackground="neutral-weak" paddingX="12" paddingBottom="8">Selected directions</Text>
                                    {musicSelection.map(track => (
                                        <Flex key={track.id} direction="column" className={styles.referenceItem}>
                                            <SmartLink href={track.url} onClick={stopAllMusic} suffixIcon="arrowUpRight" className={styles.referenceLink}>
                                                <Flex direction="column" gap="4" fillWidth>
                                                    <Text variant="body-strong-s">{track.title}</Text>
                                                    <Text variant="body-default-xs" onBackground="brand-weak">{track.style}</Text>
                                                </Flex>
                                            </SmartLink>
                                            {'note' in track && <Text as="p" variant="body-default-xs" onBackground="neutral-weak" paddingX="12">{track.note}</Text>}
                                        </Flex>
                                    ))}
                                    <Text variant="label-default-s" onBackground="neutral-weak" paddingX="12" paddingTop="16">Orchestral · further explorations</Text>
                                    {supportingMusic.map(track => (
                                        <Flex key={track.id} direction="column" className={styles.referenceItem}>
                                            <SmartLink href={track.url} onClick={stopAllMusic} suffixIcon="arrowUpRight" className={styles.referenceLink}>
                                                <Flex direction="column" gap="4" fillWidth>
                                                    <Text variant="body-strong-s">{track.title}</Text>
                                                    <Text variant="body-default-xs" onBackground="brand-weak">{track.style}</Text>
                                                </Flex>
                                            </SmartLink>
                                            <Text as="p" variant="body-default-xs" onBackground="neutral-weak" paddingX="12">{track.note}</Text>
                                            {'alternateUrl' in track && track.alternateUrl && <SmartLink href={track.alternateUrl} onClick={stopAllMusic} suffixIcon="arrowUpRight"><Text variant="body-default-xs">{track.alternateLabel}</Text></SmartLink>}
                                        </Flex>
                                    ))}
                                </>
                            )}
                        </div>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
};

