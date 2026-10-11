"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';
import { useMusicPlayerContext } from './MusicPlayerContext';
import styles from './VantaBackground.module.scss';

const VantaBackground = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const effectRef = useRef<{ destroy: () => void } | null>(null);
    const fadeTimer = useRef<ReturnType<typeof setTimeout>>();
    const { isAnyMusicPlaying } = useMusicPlayerContext();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        clearTimeout(fadeTimer.current);
        if (isAnyMusicPlaying && vantaRef.current) {
            if (!effectRef.current) {
                effectRef.current = BIRDS({
                    el: vantaRef.current, THREE,
                    mouseControls: true, touchControls: true, gyroControls: false,
                    minHeight: 200.0, minWidth: 200.0, scale: 1.0, scaleMobile: 1.0,
                    color1: 0x4d4229, color2: 0x69b2ff,
                    birdSize: 0.7, wingSpan: 10.0, speedLimit: 5.0,
                    separation: 7.0, alignment: 50.0, cohesion: 90.0, quantity: 3.0,
                    backgroundAlpha: 0.0,
                });
            }
            setVisible(true);
        } else {
            setVisible(false);
            fadeTimer.current = setTimeout(() => {
                effectRef.current?.destroy();
                effectRef.current = null;
            }, 1000);
        }
        return () => clearTimeout(fadeTimer.current);
    }, [isAnyMusicPlaying]);

    useEffect(() => () => {
        clearTimeout(fadeTimer.current);
        effectRef.current?.destroy();
    }, []);

    return <div ref={vantaRef} className={styles.vantaBackground + (visible ? ' ' + styles.vantaBackgroundVisible : ' ' + styles.fadeOut)}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: -2, width: '100%', height: '100%', opacity: visible ? 0.5 : 0, pointerEvents: 'none' }} />;
};

export default VantaBackground;
