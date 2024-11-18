"use client";

import { Flex, RevealFx, SmartImage } from "@/once-ui/components";
import { useEffect, useState, useRef } from "react";

interface CarouselProps {
    images: string[];
    title: string;
    fadeThickness?: number;
    fadeIntensity?: number;
    fadeAngle?: number;
    fadeSubtlety?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ 
    images = [], 
    title,
    fadeThickness = 1300,
    fadeIntensity = 1,
    fadeAngle = 65,
    fadeSubtlety = 0.5
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const nextImageRef = useRef<HTMLImageElement | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout>();

    const preloadNextImage = (nextIndex: number) => {
        if (nextIndex >= 0 && nextIndex < images.length) {
            nextImageRef.current = new Image();
            nextImageRef.current.src = images[nextIndex];
        }
    };

    const handleImageClick = () => {
        if (images.length > 1) {
            const nextIndex = (activeIndex + 1) % images.length;
            handleControlClick(nextIndex);
        }
    };

    const handleControlClick = (nextIndex: number) => {
        if (nextIndex !== activeIndex && !transitionTimeoutRef.current) {
            // Précharger l'image suivante pendant la transition
            preloadNextImage(nextIndex);
            
            setIsTransitioning(false);
            
            transitionTimeoutRef.current = setTimeout(() => {
                setActiveIndex(nextIndex);
                
                setTimeout(() => {
                    setIsTransitioning(true);
                    transitionTimeoutRef.current = undefined;
                }, 200); // Pause entre fade out et fade in
                
            }, 630); // Durée du fade out
        }
    };

    // Nettoyage des timeouts
    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Flex fillWidth gap="m" direction="column">
            <Flex onClick={handleImageClick}>
                <div
                    style={{
                        width: '100%',
                        maskImage: `
                            linear-gradient(
                                ${fadeAngle}deg,
                                rgba(0, 0, 0, ${fadeSubtlety}) 0%,
                                black ${fadeThickness * 0.2}px,
                                black calc(100% - ${fadeThickness * 0.8}px),
                                rgba(0, 0, 0, ${fadeSubtlety}) 100%
                            )
                        `,
                        WebkitMaskImage: `
                            linear-gradient(
                                ${fadeAngle}deg,
                                rgba(0, 0, 0, ${fadeSubtlety}) 0%,
                                black ${fadeThickness * 0.2}px,
                                black calc(100% - ${fadeThickness * 0.8}px),
                                rgba(0, 0, 0, ${fadeSubtlety}) 100%
                            )
                        `,
                        opacity: fadeIntensity
                    }}
                >
                    <RevealFx
                        style={{
                            width: '100%',
                            willChange: 'transform, opacity',
                        }}
                        delay={0.4}
                        trigger={isTransitioning}
                        speed="fast"
                        skipInitialAnimation={true}
                    >
                        <SmartImage
                            tabIndex={0}
                            radius="l"
                            alt={title}
                            aspectRatio="16 / 9"
                            src={images[activeIndex]}
                            priority={activeIndex === 0}
                            style={{
                                border: '1px solid var(--neutral-alpha-weak)',
                                transform: `translate3d(0,0,0)`,
                                backfaceVisibility: 'hidden',
                                ...(images.length > 1 && {
                                    cursor: 'pointer',
                                }),
                            }}
                        />
                    </RevealFx>
                </div>
            </Flex>
            {images.length > 1 && (
                <Flex gap="4" paddingX="s" fillWidth maxWidth={32} justifyContent="center">
                    {images.map((_, index) => (
                        <Flex
                            key={index}
                            onClick={() => handleControlClick(index)}
                            style={{
                                background: activeIndex === index
                                    ? 'var(--neutral-on-background-strong)'
                                    : 'var(--neutral-alpha-medium)',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                            }}
                            fillWidth
                            height="2"
                        ></Flex>
                    ))}
                </Flex>
            )}
        </Flex>
    );
};
