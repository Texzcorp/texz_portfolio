'use client';

import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import classNames from 'classnames';

import { Flex, Skeleton } from '@/once-ui/components';

export type SmartImageProps = ImageProps & {
    className?: string;
    style?: React.CSSProperties;
    aspectRatio?: string;
    height?: number;
    radius?: string;
    alt?: string;
    isLoading?: boolean;
    objectFit?: CSSProperties['objectFit'];
    enlarge?: boolean;
    src: string;
    videoPreloadStrategy?: 'metadata' | 'auto' | 'none';
    posterImage?: string;
    carouselImages?: string[];  // Tableau des images du carousel
    currentIndex?: number;      // Index actuel dans le carousel
};

const SmartImage: React.FC<SmartImageProps> = ({
    className,
    style,
    aspectRatio,
    height,
    radius,
    alt = '',
    isLoading = false,
    objectFit = 'cover',
    enlarge = false,
    src,
    videoPreloadStrategy = 'metadata',
    posterImage,
    carouselImages,
    currentIndex,
    ...props
}) => {
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null); // Ajout d'une référence pour la vidéo
    const [isInView, setIsInView] = useState(false);
    const nextImageRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleClick = () => {
        if (enlarge) {
            setIsEnlarged(!isEnlarged);
        }
    };

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    useEffect(() => {
        if (isEnlarged) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isEnlarged]);

    const calculateTransform = () => {
        if (!imageRef.current) return {};

        const rect = imageRef.current.getBoundingClientRect();
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        const scale = Math.min(scaleX, scaleY) * 0.9;

        const translateX = (window.innerWidth - rect.width) / 2 - rect.left;
        const translateY = (window.innerHeight - rect.height) / 2 - rect.top;

        return {
            transform: isEnlarged
                ? `translate(${translateX}px, ${translateY}px) scale(${scale})`
                : 'translate(0, 0) scale(1)',
            transition: 'all 0.3s ease-in-out',
            zIndex: isEnlarged ? 2 : 1,
        };
    };

    const isVideo = src.endsWith('.mp4');

    // Ajoutez cette fonction pour précharger la prochaine ressource
    const preloadNextResource = (nextIndex: number) => {
        if (!carouselImages || nextIndex >= carouselImages.length) return;
        
        const nextSrc = carouselImages[nextIndex];
        const isNextVideo = nextSrc.endsWith('.mp4');

        if (isNextVideo) {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = nextSrc;
            nextImageRef.current = video;
        } else {
            // Correction ici : utiliser HTMLImageElement au lieu de Image
            const img = document.createElement('img');
            img.src = nextSrc;
            nextImageRef.current = img;
        }
    };

    // Effet pour précharger la prochaine ressource quand l'élément est visible
    useEffect(() => {
        if (isInView && carouselImages && typeof currentIndex === 'number') {
            const nextIndex = (currentIndex + 1) % carouselImages.length;
            preloadNextResource(nextIndex);
        }
    }, [isInView, currentIndex, carouselImages]);

    return (
        <>
            <Flex
                ref={imageRef}
                fillWidth
                position="relative"
                {...(!isEnlarged && { background: 'neutral-medium' })}
                style={{
                    outline: 'none',
                    overflow: 'hidden',
                    height: aspectRatio
                        ? undefined
                        : height
                        ? `${height}rem`
                        : '100%',
                    aspectRatio,
                    cursor: enlarge ? 'pointer' : 'default',
                    borderRadius: isEnlarged ? '0' : radius ? `var(--radius-${radius})` : undefined,
                    ...calculateTransform(),
                    ...style,
                }}
                className={classNames(className)}
                onClick={handleClick}>
                {(isLoading || (isVideo && !isVideoLoaded)) && (
                    <Skeleton shape="block" />
                )}
                {!isLoading && isVideo && isInView && (
                    <video
                        ref={videoRef}
                        src={src}
                        poster={posterImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload={videoPreloadStrategy}
                        onLoadedData={handleVideoLoad}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: isEnlarged ? 'contain' : objectFit,
                            opacity: isVideoLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                            transform: 'translate3d(0,0,0)',
                            willChange: 'transform, opacity',
                        }}
                    />
                )}
                {!isLoading && !isVideo && (
                    <Image
                        {...props}
                        src={src}
                        alt={alt}
                        fill
                        loading={props.priority ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        quality={95}
                        priority={props.priority}
                        style={{ 
                            objectFit: isEnlarged ? 'contain' : objectFit,
                            transform: 'translate3d(0,0,0)',
                            backfaceVisibility: 'hidden',
                            willChange: 'transform, opacity',
                        }}
                    />
                )}
            </Flex>

            {isEnlarged && enlarge && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    position="fixed"
                    zIndex={1}
                    onClick={handleClick}
                    style={{
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'var(--backdrop)',
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: isEnlarged ? 1 : 0,
                    }}>
                    <Flex
                        position="relative"
                        style={{
                            height: '100vh',
                            transform: 'translate(-50%, -50%)',
                        }}
                        onClick={(e) => e.stopPropagation()}>
                        {isVideo && videoRef.current ? (
                            <div
                                style={{
                                    width: '90vw',
                                    height: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <video
                                    ref={videoRef}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>
                        ) : (
                            <Image
                                {...props}
                                src={src}
                                alt={alt}
                                fill
                                sizes="90vw"
                                style={{ objectFit: 'contain' }}
                            />
                        )}
                    </Flex>
                </Flex>
            )}
        </>
    );
};

SmartImage.displayName = 'SmartImage';

export { SmartImage };
