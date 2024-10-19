"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useEffect, useState } from "react";

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
    avatars,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true); // On commence avec la transition activée
    const [isImageLoaded, setIsImageLoaded] = useState(false); // État pour le chargement de l'image
    const [isFadingOut, setIsFadingOut] = useState(false); // État pour le fade-out

    useEffect(() => {
        // Activer la transition de fade-in au montage
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageClick = () => {
        if (images.length > 1 && !isFadingOut) {
            setIsFadingOut(true); // Démarrer le fade-out
            setIsTransitioning(false); // Désactiver la transition pour la sortie
            const nextIndex = (activeIndex + 1) % images.length;
            setTimeout(() => handleControlClick(nextIndex), 630); // Délai pour synchroniser avec le fade-out
        }
    };

    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsImageLoaded(false); // On attend le chargement de la nouvelle image
            setActiveIndex(index);
        }
    };

    const handleImageLoad = () => {
        setIsImageLoaded(true); // Indiquer que l'image est bien chargée
        setTimeout(() => {
            setIsFadingOut(false); // Le fade-out est terminé
            setIsTransitioning(true); // Démarrer le fade-in
        }, 100); // Petite latence avant le fade-in
    };

    return (
        <Flex fillWidth gap="m" direction="column">
            <Flex onClick={handleImageClick}>
                <RevealFx
                    style={{ width: '100%' }}
                    delay={0.1}
                    trigger={isTransitioning} // Activer la transition de fade-in ou fade-out
                    speed={isFadingOut ? "fast" : "slow"} // Vitesse plus rapide pour le fade-out
                >
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        onLoad={handleImageLoad} // Déclencher une fois que l'image est chargée
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
                            ...(images.length > 1 && {
                                cursor: 'pointer',
                            }),
                            opacity: isImageLoaded ? 1 : 0, // Masquer l'image tant qu'elle n'est pas chargée
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />
                </RevealFx>
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
                        />
                    ))}
                </Flex>
            )}
            <Flex
                mobileDirection="column"
                fillWidth paddingX="l" paddingTop="xs" paddingBottom="m" gap="l"
            >
                <RevealFx
                    style={{ width: '100%' }}
                    translateY="8"
                    delay={0.1}
                    speed="medium"
                >
                    {title && (
                        <Flex flex={5}>
                            <Heading as="h2" wrap="balance" variant="display-strong-xs">
                                {title}
                            </Heading>
                        </Flex>
                    )}
                    {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
                        <Flex flex={7} direction="column" gap="s">
                            {avatars?.length > 0 && (
                                <AvatarGroup avatars={avatars} size="m" reverseOrder />
                            )}
                            {description?.trim() && (
                                <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                                    {description}
                                </Text>
                            )}
                            {content?.trim() && (
                                <SmartLink suffixIcon="chevronRight" style={{ margin: '0', width: 'fit-content' }} href={href}>
                                    <Text variant="body-default-s">Read more</Text>
                                </SmartLink>
                            )}
                        </Flex>
                    )}
                </RevealFx>
            </Flex>
        </Flex>
    );
};
