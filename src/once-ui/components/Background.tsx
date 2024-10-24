"use client";

import React, { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';
import { useMusicPlayerContext } from '@/app/components/MusicPlayerContext';

interface BackgroundProps {
    position?: CSSProperties['position'];
    gradient?: boolean;
    dots?: boolean;
    lines?: boolean;
    shootingStars?: boolean; 
    className?: string;
    style?: React.CSSProperties;
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(({
    position = 'fixed',
    gradient = true,
    dots = true,
    lines = true,
    shootingStars = false,
    className,
    style
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { audioData, isAnyMusicPlaying } = useMusicPlayerContext();
    const [stars, setStars] = useState<Array<{ id: number, top: string, left: string }>>([]);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (canvas && ctx) {
            let w = canvas.width = window.innerWidth;
            let h = canvas.height = window.innerHeight;
            let t = 0;
            let mouseX = w / 2;
            let mouseY = h / 2;

            const resizeCanvas = () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
                ctx.clearRect(0, 0, w, h);
            };

            window.addEventListener('resize', resizeCanvas);
            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const lerp = (start: number, end: number, t: number): number => {
                return start + (end - start) * t;
            };

            let targetScrollInfluence = 0;
            let currentScrollInfluence = 0;

            const clampAudioData = (value: number): number => {
                const minDb = -180;
                const maxDb = -0;
                return Math.max(minDb, Math.min(maxDb, value));
            };

            const dbToLinear = (dbValue: number): number => {
                return Math.pow(10, dbValue / 20);
            };

            const drawVerticalFluidWaves = () => {
                const waveCount = 7;
                const baseFrequency = 0.0005;
                const waveSpeed = 0.0025;

                const pageHeight = Math.max(document.body.scrollHeight, window.innerHeight) + 120;
                targetScrollInfluence = Math.sin(window.scrollY * 0.002) * 100;
                const smoothingFactor = 0.05;
                currentScrollInfluence = lerp(currentScrollInfluence, targetScrollInfluence, smoothingFactor);

                for (let i = 0; i < waveCount; i++) {
                    let frequency = baseFrequency + (i * 0.05) + (mouseX / w) * 0.008;
                    const color = `hsla(${Math.sin(t * 0.0001 + i) * 180 + 180}, 100%, 70%, ${0.2 + (i * 0.05)})`;

                    ctx.beginPath();
                    ctx.lineWidth = 2 + (i * 0.2);
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = color;
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = 0.95 + (i * 0.1);

                    let previousY = 0, previousX = w / 2;

                    if (isAnyMusicPlaying && audioData && audioData.length > 0) {
                        const audioLength = audioData.length;
                        const segmentLength = Math.floor(pageHeight / audioLength);

                        // Trouver la valeur minimale dans audioData pour la normalisation
                        const minAudioValue = Math.min(...audioData);

                        for (let y = 0; y < audioLength; y++) {
                            // Inverser et normaliser l'amplitude
                            const invertedValue = minAudioValue - audioData[y];
                            const normalizedValue = invertedValue / Math.abs(minAudioValue);
                            const amplitude = normalizedValue * 200; // Ajuster le facteur pour augmenter l'amplitude
                            const x = w / 2 + Math.sin((y * frequency) + (t * waveSpeed) + (i * Math.PI / 2)) * amplitude;

                            if (y === 0) {
                                ctx.moveTo(x, y * segmentLength);
                            } else {
                                const midX = (previousX + x) / 2;
                                const midY = (previousY + y * segmentLength) / 2;
                                ctx.quadraticCurveTo(previousX, previousY, midX, midY);
                            }
                            previousX = x;
                            previousY = y * segmentLength;
                        }
                    } else {
                        // Switch to idle animation if no music is playing or no audio data is available
                        const idleAmplitude = 80 + currentScrollInfluence + i * 4 + (mouseY / h) * 0.2;
                        const idleLength = 100;
                        const segmentLength = Math.floor(pageHeight / idleLength);

                        for (let y = 0; y < idleLength; y++) {
                            const mouseEffect = Math.sin((y - mouseY) * 0.01) * (mouseX / w) * 25;
                            const x = w / 2 + Math.sin((y * frequency) + (t * waveSpeed) + (i * Math.PI / 2)) * (idleAmplitude + mouseEffect);

                            if (y === 0) {
                                ctx.moveTo(x, y * segmentLength);
                            } else {
                                const midX = (previousX + x) / 2;
                                const midY = (previousY + y * segmentLength) / 2;
                                ctx.quadraticCurveTo(previousX, previousY, midX, midY);
                            }
                            previousX = x;
                            previousY = y * segmentLength;
                        }
                    }
                    ctx.lineTo(w / 2, pageHeight);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
            };

            const animate = () => {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, w, h);
                drawVerticalFluidWaves();
                t++;
                animationFrameId.current = requestAnimationFrame(animate);
            };

            animate();

            return () => {
                if (animationFrameId.current !== null) {
                    cancelAnimationFrame(animationFrameId.current);
                }
                window.removeEventListener('resize', resizeCanvas);
                window.removeEventListener('mousemove', () => {});
            };
        }
    }, [audioData, isAnyMusicPlaying]);

    useEffect(() => {
        if (shootingStars) {
            const interval = setInterval(() => {
                const newStar = {
                    id: Math.random(),
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                };
                setStars((prevStars) => [...prevStars, newStar]);

                setTimeout(() => {
                    setStars((prevStars) => prevStars.filter((star) => star.id !== newStar.id));
                }, 5000);
            }, Math.random() * 5000 + 5000);

            return () => clearInterval(interval);
        }
    }, [shootingStars]);

    return (
        <>
            {gradient && (
                <div
                    ref={ref}
                    className={className}
                    style={{
                        position: position,
                        top: '0',
                        left: '0',
                        zIndex: '0',
                        width: '100%',
                        height: '100%',
                        filter: 'contrast(1.5)',
                        background: 'radial-gradient(circle at 50% 110%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 0) 25%), radial-gradient(100% 300% at 25.99% 0%, var(--static-transparent) 0%, var(--page-background) 100%), radial-gradient(87.4% 84.04% at 6.82% 16.24%, var(--brand-background-medium) 0%, var(--static-transparent) 100%), radial-gradient(217.89% 86.62% at 68.04% 0%, var(--accent-solid-medium) 0%, var(--static-transparent) 100%)',
                        ...style,
                    }}
                />
            )}
            <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
            {shootingStars && stars.map((star) => (
                <div
                    key={star.id}
                    className={className}
                    style={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        width: '1px',
                        height: '1px',
                        background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
                        animation: 'shooting-star 5s ease-out forwards',
                        perspective: '1000px',
                        ...style,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes shooting-star {
                    0% { width: 1px; opacity: 0; transform: translateZ(-1000px) scale(0.1) rotateY(45deg); transform-origin: left center; }
                    20% { width: 400px; opacity: 1; transform: translateZ(-500px) scale(0.5) rotateY(45deg); }
                    80% { width: 400px; opacity: 1; transform: translateZ(0px) scale(1) rotateY(45deg); }
                    100% { width: 0px; opacity: 0; transform: translateZ(300px) scale(2) rotateY(45deg); }
                }
            `}</style>
        </>
    );
});

Background.displayName = 'Background';

export { Background };
