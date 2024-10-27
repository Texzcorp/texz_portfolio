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
    ...props
}) => {
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const imageRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [placeholderSrc, setPlaceholderSrc] = useState<string>('');

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
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 10;
                canvas.height = 10;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                    ctx.drawImage(img, 0, 0, 10, 10);
                    const placeholder = canvas.toDataURL('image/jpeg', 0.1);
                    setPlaceholderSrc(placeholder);
                }
            };

            img.src = src;
        }
    }, [src, isVideo]);

    // Gestion des vidéos
    useEffect(() => {
        if (isVideo && videoRef.current && isInView) {
            videoRef.current.src = src;
            videoRef.current.load();
        }
    }, [isVideo, isInView, src]);

    // Gestion du chargement des images
    useEffect(() => {
        if (!isVideo) {
            setIsImageLoading(true);
            const img = document.createElement('img'); // Utilisation de createElement au lieu de new Image()
            img.src = src;
            
            img.onload = () => {
                setIsImageLoading(false);
            };
            
            img.onerror = () => {
                setIsImageLoading(false);
            };
        }
    }, [src, isVideo]);

    const handleClick = () => {
        if (enlarge) {
            setIsEnlarged(!isEnlarged);
        }
    };

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
        setIsImageLoading(false); // Ajout de cette ligne pour arrêter le loading
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
                {(isLoading || isImageLoading || (isVideo && !isVideoLoaded)) && (
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
                            opacity: isVideoLoaded ? 1 : 0,
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
                        placeholder={placeholderSrc ? 'blur' : 'empty'}
                        blurDataURL={placeholderSrc}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={75}
                        onLoadingComplete={() => setIsImageLoading(false)}
                        style={{
                            objectFit: isEnlarged ? 'contain' : objectFit,
                            transform: 'translate3d(0,0,0)',
                            backfaceVisibility: 'hidden',
                            willChange: 'transform, opacity',
                            opacity: !isImageLoading ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
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
