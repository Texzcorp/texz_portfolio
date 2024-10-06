"use client";

import React, { CSSProperties, forwardRef, useEffect, useState, useRef } from 'react';

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
    const [stars, setStars] = useState<Array<{ id: number, top: string, left: string }>>([]);

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
            };

            window.addEventListener('resize', resizeCanvas);

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Fonction d'interpolation (lerp)
            const lerp = (start: number, end: number, t: number): number => {
                return start + (end - start) * t;
            };            

            let targetScrollInfluence = 0;
            let currentScrollInfluence = 0;

            const drawVerticalFluidWaves = () => {
                const waveCount = 7; // Nombre d'ondes pour plus de richesse visuelle
                const baseAmplitude = 80;
                const baseFrequency = 0.0005;
                const waveSpeed = 0.0025;
            
                const pageHeight = Math.max(document.body.scrollHeight, window.innerHeight);
                targetScrollInfluence = Math.sin(window.scrollY * 0.002) * 100;
            
                const smoothingFactor = 0.05;
                currentScrollInfluence = lerp(currentScrollInfluence, targetScrollInfluence, smoothingFactor);
            
                for (let i = 0; i < waveCount; i++) {
                    const amplitude = baseAmplitude + currentScrollInfluence + i * 4 + (mouseY / h) * 0.2;
                    const frequency = baseFrequency + (i * 0.05) + (mouseX / w) * 0.008;
            
                    const color = `hsla(${Math.sin(t * 0.0001 + i) * 180 + 180}, 100%, 70%, ${0.2 + (i * 0.05)})`;
                    ctx.beginPath();
                    ctx.lineWidth = 2 + (i * 0.2);
            
                    // Ajout de l'effet néon "baveux"
                    ctx.shadowBlur = 20; // Le flou de l'ombre pour simuler la lumière diffuse
                    ctx.shadowColor = color; // Couleur de l'ombre, identique à celle des ondes pour l'effet néon
                    ctx.shadowOffsetX = 0; // Aucune déviation horizontale
                    ctx.shadowOffsetY = 0; // Aucune déviation verticale
                    ctx.strokeStyle = color;
            
                    ctx.globalAlpha = 0.3 + (i * 0.1);
            
                    const controlPoints = 10;
                    let previousY = 0, previousX = w / 2;
            
                    for (let y = 0; y <= pageHeight; y += pageHeight / controlPoints) {
                        const mouseEffect = Math.sin((y - mouseY) * 0.01) * (mouseX / w) * 25;
            
                        const x = w / 2 + Math.sin((y * frequency) + (t * waveSpeed) + (i * Math.PI / 2)) * (amplitude + mouseEffect);
            
                        if (y === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            const midX = (previousX + x) / 2;
                            const midY = (previousY + y) / 2;
                            ctx.quadraticCurveTo(previousX, previousY, midX, midY);
                        }
                        previousX = x;
                        previousY = y;
                    }
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            
                // Réinitialiser l'effet d'ombre pour ne pas l'appliquer à d'autres éléments
                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
            };
            
       

            const animate = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, w, h);
                drawVerticalFluidWaves();
                t++;
                requestAnimationFrame(animate);
            };

            animate();
            return () => {
                window.removeEventListener('resize', resizeCanvas);
            };
        }
    }, []);

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
                        background: 'radial-gradient(100% 100% at 49.99% 0%, var(--static-transparent) 0%, var(--page-background) 100%), radial-gradient(87.4% 84.04% at 6.82% 16.24%, var(--brand-background-medium) 0%, var(--static-transparent) 100%), radial-gradient(217.89% 126.62% at 48.04% 0%, var(--accent-solid-medium) 0%, var(--static-transparent) 100%)',
                        ...style,
                    }}></div>
            )}
            <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}></canvas>
            {dots && (
                <div
                    ref={ref}
                    className={className}
                    style={{
                        position: position,
                        zIndex: '0',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'radial-gradient(var(--brand-on-background-weak) 0.5px, var(--static-transparent) 0.5px)',
                        opacity: '0.25',
                        backgroundSize: 'var(--static-space-16) var(--static-space-16)',
                        ...style,
                    }}></div>
            )}
            {lines && (
                <div
                    ref={ref}
                    className={className}
                    style={{
                        position: position,
                        zIndex: '0',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'repeating-linear-gradient(45deg, var(--brand-on-background-weak) 0, var(--brand-on-background-weak) 0.5px, var(--static-transparent) 0.5px, var(--static-transparent) var(--static-space-8))',
                        maskImage: 'linear-gradient(to bottom left, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0) 70%)',
                        maskSize: '100% 100%',
                        maskPosition: 'top right',
                        maskRepeat: 'no-repeat',
                        opacity: '0.2',
                        ...style,
                    }}></div>
            )}
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
                    }} />
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
