"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useEffect, useState, useRef } from "react";

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);
    const nextImageRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout>();
    const [preloadedVideos, setPreloadedVideos] = useState<HTMLVideoElement[]>([]);

    // Préchargement initial des images
    useEffect(() => {
        const preloadImages = async () => {
            const loadedImages = await Promise.all(
                images.map((src) => {
                    return new Promise<HTMLImageElement>((resolve) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = () => resolve(img);
                    });
                })
            );
            setPreloadedImages(loadedImages);
        };

        preloadImages(); // Correction ici : appel de la fonction preloadImages au lieu de loadedImages
    }, [images]);

    useEffect(() => {
        const preloadVideos = async () => {
            const videoUrls = images.filter(src => src.endsWith('.mp4'));
            
            const loadedVideos = await Promise.all(
                videoUrls.map((src) => {
                    return new Promise<HTMLVideoElement>((resolve) => {
                        const video = document.createElement('video');
                        video.preload = "metadata"; // Charge uniquement les métadonnées initialement
                        video.src = src;
                        video.onloadedmetadata = () => resolve(video);
                    });
                })
            );
            setPreloadedVideos(loadedVideos);
        };

        preloadVideos();
    }, [images]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const preloadNextImage = (nextIndex: number) => {
        if (nextIndex >= 0 && nextIndex < images.length) {
            const nextSrc = images[nextIndex];
            
            if (nextSrc.endsWith('.mp4')) {
                const videoElement = document.createElement('video');
                videoElement.preload = "metadata";
                videoElement.src = nextSrc;
                nextImageRef.current = videoElement;
            } else {
                const imgElement = new Image();
                imgElement.src = nextSrc;
                nextImageRef.current = imgElement;
            }
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
                setIsTransitioning(true);
                transitionTimeoutRef.current = undefined;
            }, 630);
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
        <Flex
            fillWidth gap="m"
            direction="column">
            <Flex onClick={handleImageClick}>
                <RevealFx
                    style={{
                        width: '100%',
                        willChange: 'transform, opacity' // Optimisation des performances
                    }}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast">
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        priority={activeIndex === 0}
                        videoPreloadStrategy="metadata"
                        posterImage={images[activeIndex].replace('.mp4', '-poster.jpg')} // Si vous avez des images poster
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
            </Flex>
            
            {images.length > 1 && (
                <Flex
                    gap="4" paddingX="s"
                    fillWidth maxWidth={32}
                    justifyContent="center">
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
                            height="2">
                        </Flex>
                    ))}
                </Flex>
            )}
            <Flex
                mobileDirection="column"
                fillWidth paddingX="l" paddingTop="xs" paddingBottom="m" gap="l">
                {title && (
                    <Flex
                        flex={5}>
                        <Heading
                            as="h2"
                            wrap="balance"
                            variant="display-strong-xs">
                            {title}
                        </Heading>
                    </Flex>
                )}
                {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
                    <Flex
                        flex={7} direction="column"
                        gap="s">
                        {avatars?.length > 0 && (
                            <AvatarGroup
                                avatars={avatars}
                                size="m"
                                reverseOrder/>
                        )}
                        {description?.trim() && (
                            <Text
                                wrap="balance"
                                variant="body-default-s"
                                onBackground="neutral-weak">
                                {description}
                            </Text>
                        )}
                        {content?.trim() && (
                            <SmartLink
                                suffixIcon="chevronRight"
                                style={{margin: '0', width: 'fit-content'}}
                                href={href}>
                                    <Text
                                        variant="body-default-s">
                                        Read case study
                                    </Text>
                            </SmartLink>
                        )}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
