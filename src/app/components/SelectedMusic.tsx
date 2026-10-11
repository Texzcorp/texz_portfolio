'use client';

import { useEffect, useState } from 'react';
import { musicSelection, supportingMusic } from '@/app/resources/portfolio';
import { useMusicPlayerContext } from './MusicPlayerContext';
import styles from './PortfolioUpdates.module.scss';

export function SelectedMusic({ compact = false }: { compact?: boolean }) {
    const [selectedId, setSelectedId] = useState(musicSelection[0].id);
    const [playerOpen, setPlayerOpen] = useState(false);
    const { stopAllMusic, activePlayerSrc } = useMusicPlayerContext();
    const selected = musicSelection.find(track => track.id === selectedId) ?? musicSelection[0];
    const tracks = compact ? musicSelection.slice(0, 3) : musicSelection;

    useEffect(() => {
        if (activePlayerSrc) setPlayerOpen(false);
    }, [activePlayerSrc]);

    return (
        <section className={styles.section} aria-label="Selected music">
            <div className={styles.stage}>
                <div className={`${styles.screen} ${playerOpen ? styles.loadedScreen : ''}`}>
                    {playerOpen ? (
                        <iframe
                            key={selected.videoId}
                            src={`https://www.youtube-nocookie.com/embed/${selected.videoId}?autoplay=0&rel=0`}
                            title={`${selected.title} — YouTube player`}
                            allow="encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                        />
                    ) : (
                        <div>
                            <p className={styles.eyebrow}>{selected.style}</p>
                            <h3>{selected.title}</h3>
                            <button type="button" className={styles.action} onClick={() => {
                                stopAllMusic();
                                setPlayerOpen(true);
                            }}>Open video player</button>
                        </div>
                    )}
                </div>
                <div className={styles.stageCopy} aria-live="polite">
                    <h3>{selected.title}</h3>
                    <p className={styles.muted}>{selected.description}</p>
                    {'note' in selected && <p className={styles.note}>{selected.note}</p>}
                    <a href={selected.url} target="_blank" rel="noopener noreferrer">Watch / listen on YouTube ↗</a>
                    {playerOpen && <button type="button" className={styles.action} style={{ marginLeft: '.8rem' }} onClick={() => setPlayerOpen(false)}>Close player</button>}
                </div>
            </div>
            <div className={styles.grid}>
                {tracks.map(track => (
                    <button key={track.id} type="button" className={styles.track} aria-pressed={selectedId === track.id} onClick={() => {
                        setPlayerOpen(false);
                        setSelectedId(track.id);
                    }}>
                        <span>{track.style}</span>
                        <strong>{track.title}</strong>
                    </button>
                ))}
            </div>
            {compact ? (
                <div className={styles.actions}><a className={styles.action} href="/music">Explore all music styles →</a></div>
            ) : (
                <>
                    <div className={styles.supporting}>
                        <p className={styles.eyebrow}>Also explore · orchestral</p>
                        <a href={supportingMusic[0].url} target="_blank" rel="noopener noreferrer">67 — short orchestral sketch ↗</a>
                        <p className={styles.note}>A complementary writing demonstration.</p>
                    </div>
                    <details className={styles.details}>
                        <summary>More directions, versions and influences</summary>
                        <ul className={styles.referenceList}>
                            {supportingMusic.slice(1).map(track => (
                                <li key={track.id}>
                                    <a href={track.url} target="_blank" rel="noopener noreferrer">{track.title} ↗</a>
                                    <p className={styles.note}>{track.style} · {track.note}</p>
                                    {'alternateUrl' in track && <a href={track.alternateUrl} target="_blank" rel="noopener noreferrer">{track.alternateLabel} ↗</a>}
                                </li>
                            ))}
                        </ul>
                    </details>
                </>
            )}
        </section>
    );
}
