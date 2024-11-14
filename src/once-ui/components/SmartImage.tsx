'use client';

import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import classNames from 'classnames';

import { Flex, Skeleton } from '@/once-ui/components';
import { LoadingAnimation } from './LoadingAnimation';

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
    variant?: 'default' | 'glow';
};

// Ajout de l'interface pour le NetworkInformation
interface NetworkInformation {
    downlink: number;
    saveData: boolean;
}

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
    variant = 'default',
    ...props
}) => {
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [placeholderSrc, setPlaceholderSrc] = useState<string>('');
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const isVideo = src.endsWith('.mp4');

    // Intersection Observer pour le lazy loading
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

        return () => observer.disconnect();
    }, []);

    // Génération du placeholder uniquement pour les images
    useEffect(() => {
        if (!isVideo && src) {
            setPlaceholderSrc(src);
        }
    }, [src, isVideo]);

    // Gestion optimisée des vidéos
    useEffect(() => {
        if (isVideo && videoRef.current && isInView) {
            const video = videoRef.current;
            video.src = src;
            video.preload = "metadata";

            const handleWaiting = () => setIsBuffering(true);
            const handlePlaying = () => setIsBuffering(false);
            const handleError = () => setHasError(true);

            video.addEventListener('waiting', handleWaiting);
            video.addEventListener('playing', handlePlaying);
            video.addEventListener('error', handleError);

            // Qualité adaptative basique
            video.addEventListener('loadedmetadata', () => {
                if (video.videoHeight > 720) {
                    // Typage sécurisé de l'API Connection
                    const connection = (navigator as any).connection as NetworkInformation | undefined;
                    if (connection && (connection.downlink < 2 || connection.saveData)) {
                        // Réduire la qualité pour les connexions lentes
                        video.style.maxHeight = '480px';
                    }
                }
            });

            return () => {
                video.removeEventListener('waiting', handleWaiting);
                video.removeEventListener('playing', handlePlaying);
                video.removeEventListener('error', handleError);
            };
        }
    }, [isVideo, isInView, src]);

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

    const glowEffect = {
        boxShadow: '0 0 20px rgba(30, 30, 80, 0.9)',
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    // Réinitialiser l'état de chargement quand la source change
    useEffect(() => {
        setIsImageLoaded(false);
        if (isVideo) {
            setIsVideoLoaded(false);
        }
    }, [src, isVideo]);

    return (
        <>
            {variant === 'glow' ? (
                <Flex
                    position="relative"
                    style={{
                        position: 'relative',
                        aspectRatio,
                        WebkitMaskImage: 'linear-gradient(black 100%, transparent 100%)',
                        maskImage: 'linear-gradient(black 100%, transparent 100%)',
                        filter: 'blur(0px)',
                        transform: 'scale(1.1)',
                        overflow: 'visible',
                        zIndex: 0,
                    }}>
                    <Flex
                        ref={imageRef}
                        fillWidth
                        position="relative"
                        {...(!isEnlarged && { background: 'neutral-medium' })}
                        style={{
                            outline: 'none',
                            overflow: 'hidden',
                            width: '90%',
                            height: '90%',
                            margin: '5rem',
                            cursor: enlarge ? 'pointer' : 'default',
                            borderRadius: isEnlarged ? '0' : radius ? `var(--radius-${radius})` : undefined,
                            ...calculateTransform(),
                            ...style,
                            ...glowEffect,
                        }}
                        className={classNames(className)}
                        onClick={handleClick}>
                        {(isLoading || 
                          (isVideo && !isVideoLoaded) || 
                          (!isVideo && !isImageLoaded) || 
                          isBuffering) && (
                            <>
                                <Skeleton shape="block" />
                                <LoadingAnimation />
                            </>
                        )}
                        {!isLoading && isVideo && isInView && (
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                onLoadedData={handleVideoLoad}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: isEnlarged ? 'contain' : objectFit,
                                    opacity: isVideoLoaded && !isBuffering ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                }}
                            />
                        )}
                        {!isLoading && !isVideo && (
                            <Image
                                {...props}
                                src={src}
                                alt={alt}
                                fill
                                placeholder="empty"
                                sizes="100vw"
                                quality={50}
                                unoptimized={false}
                                onLoad={handleImageLoad}
                                style={{
                                    objectFit: isEnlarged ? 'contain' : objectFit,
                                    transform: 'translate3d(0,0,0)',
                                    backfaceVisibility: 'hidden',
                                    willChange: 'transform, opacity',
                                    opacity: isImageLoaded ? 1 : 0,
                                    transition: 'opacity 0.3s ease-in-out',
                                }}
                            />
                        )}
                    </Flex>
                </Flex>
            ) : (
                <Flex
                    ref={imageRef}
                    fillWidth
                    position="relative"
                    {...(!isEnlarged && { background: 'neutral-medium' })}
                    style={{
                        outline: 'none',
                        overflow: 'hidden',
                        height: aspectRatio ? undefined : height ? `${height}rem` : '100%',
                        aspectRatio,
                        cursor: enlarge ? 'pointer' : 'default',
                        borderRadius: isEnlarged ? '0' : radius ? `var(--radius-${radius})` : undefined,
                        ...calculateTransform(),
                        ...style,
                    }}
                    className={classNames(className)}
                    onClick={handleClick}>
                    {(isLoading || 
                      (isVideo && !isVideoLoaded) || 
                      (!isVideo && !isImageLoaded) || 
                      isBuffering) && (
                        <>
                            <Skeleton shape="block" />
                            <LoadingAnimation />
                        </>
                    )}
                    {!isLoading && isVideo && isInView && (
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedData={handleVideoLoad}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: isEnlarged ? 'contain' : objectFit,
                                opacity: isVideoLoaded && !isBuffering ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                            }}
                        />
                    )}
                    {!isLoading && !isVideo && (
                        <Image
                            {...props}
                            src={src}
                            alt={alt}
                            fill
                            placeholder="empty"
                            sizes="100vw"
                            quality={50}
                            unoptimized={false}
                            onLoad={handleImageLoad}
                            style={{
                                objectFit: isEnlarged ? 'contain' : objectFit,
                                transform: 'translate3d(0,0,0)',
                                backfaceVisibility: 'hidden',
                                willChange: 'transform, opacity',
                                opacity: isImageLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                            }}
                        />
                    )}
                </Flex>
            )}

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
                                sizes="100vw"
                                quality={100}
                                unoptimized={true}
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
