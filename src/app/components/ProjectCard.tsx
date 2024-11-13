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
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);
    const nextImageRef = useRef<HTMLImageElement | null>(null);
    const transitionTimeoutRef = useRef<NodeJS.Timeout>();

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
            
            // Premier timeout pour le fade out
            transitionTimeoutRef.current = setTimeout(() => {
                setActiveIndex(nextIndex);
                
                // Deuxième timeout pour le fade in (ajout d'une pause de 200ms)
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
                    speed="fast"
                    skipInitialAnimation={true}>
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        variant="glow"
                        priority={activeIndex === 0} // Priorité pour la première image
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
                            transform: `translate3d(0,0,0)`, // Force l'accélération matérielle
                            backfaceVisibility: 'hidden',
                            ...(images.length > 1 && {
                                cursor: 'pointer',
                            }),
                        }}/>
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
