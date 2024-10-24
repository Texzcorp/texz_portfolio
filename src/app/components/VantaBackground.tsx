"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';
import { useBackground } from "@/app/components/BackgroundContext";
import { useMusicPlayerContext } from "@/app/components/MusicPlayerContext";
import styles from './VantaBackground.module.scss'; // Import du fichier SCSS

const VantaBackground = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const { effectActive } = useBackground();
    const { isAnyMusicPlaying } = useMusicPlayerContext();  // Add this
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        let isComponentMounted = true;

        // Fonction pour initialiser l'effet Vanta
        const initVanta = () => {
            if (vantaRef.current && isComponentMounted) {
                if (vantaEffect) {
                    vantaEffect.destroy();
                    setVantaEffect(null);
                }

                const newEffect = BIRDS({
                    el: vantaRef.current,
                    THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color1: 0x4d4229,
                    color2: 0x69b2ff,
                    birdSize: 0.7,
                    wingSpan: 10.0,
                    speedLimit: 5.0,
                    separation: 7.0,
                    alignment: 50.0,
                    cohesion: 90.0,
                    quantity: 3.0,
                    backgroundAlpha: 0.0,
                });

                setVantaEffect(newEffect);
                setIsVisible(true);
                setIsFadingOut(false);
            }
        };

        // Only show birds if music is playing
        if (isAnyMusicPlaying) {
            initVanta();
        } else {
            if (vantaEffect) {
                setIsFadingOut(true);
                setTimeout(() => {
                    if (isComponentMounted) {
                        vantaEffect.destroy();
                        setVantaEffect(null);
                        setIsVisible(false);
                    }
                }, 1000); // Durée du fade out en millisecondes (ici, 1000ms = 1s)
            }
        }

        // Cleanup à la destruction du composant ou au changement de `effectActive`
        return () => {
            isComponentMounted = false;
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
            }
        };
    }, [isAnyMusicPlaying]); // Changed from effectActive to isAnyMusicPlaying

    return (
        <div
            ref={vantaRef}
            className={`${styles.vantaBackground} ${isVisible ? styles.vantaBackgroundVisible : ''} ${isFadingOut ? styles.fadeOut : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -2,
                width: '100%',
                height: '100%',
                opacity: isVisible && !isFadingOut ? 0.5 : 0, // Réduit l'opacité à 0 pendant le fade out
            }}
        />
    );
};

export default VantaBackground;
