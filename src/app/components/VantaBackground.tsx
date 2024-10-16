"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';
import { useBackground } from "@/app/components/BackgroundContext";
import styles from './VantaBackground.module.scss'; // Import du fichier SCSS

const VantaBackground = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const { effectActive, setEffectActive } = useBackground(); // Inclut la fonction pour modifier `effectActive`
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

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
                    cohesion: 80.0,
                    quantity: 2.0,
                    backgroundAlpha: 0.0,
                });

                setVantaEffect(newEffect);
                setIsVisible(true);
            }
        };

        // Activer ou désactiver l'effet en fonction de `effectActive`
        if (effectActive) {
            initVanta();
        } else {
            // Si `effectActive` devient false, détruire l'effet immédiatement
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
                setIsVisible(false);
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
    }, [effectActive]);

    // Forcer la réinitialisation de `effectActive` lors de chaque montage
    useEffect(() => {
        setEffectActive(false);
    }, [setEffectActive]);

    return (
        <div
            ref={vantaRef}
            className={`${styles.vantaBackground} ${isVisible ? styles.vantaBackgroundVisible : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -2,
                width: '100%',
                height: '100%',
            }}
        />
    );
};

export default VantaBackground;
