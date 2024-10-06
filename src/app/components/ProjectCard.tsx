"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useEffect, useState } from "react";
import MusicPlayer from './MusicPlayer'; // Import du lecteur audio

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
    mainMusic?: string; // Ajouter la musique principale
    extraMusics?: string[]; // Ajouter les musiques supplémentaires
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars,
    mainMusic, // Prop pour la musique principale
    extraMusics, // Prop pour les musiques supplémentaires
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageClick = () => {
        if(images.length > 1) {
            setIsTransitioning(false);
            setTimeout(() => {
                const nextIndex = (activeIndex + 1) % images.length;
                setActiveIndex(nextIndex);
                setTimeout(() => {
                    setIsTransitioning(true);
                }, 630);
            }, 630);
        }
    };
    
    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
                setActiveIndex(index);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 630);
            }, 630);
        }
    };

    return (
        <Flex
            fillWidth gap="m"
            direction="column">
            <Flex onClick={handleImageClick}>
            <RevealFx
                    style={{width: '100%'}}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast">
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
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
                
                {/* Section Musique */}
                {mainMusic && (
                    <div>
                        <Text variant="body-default-s">Écouter la musique principale :</Text>
                        <MusicPlayer src={mainMusic} />
                    </div>
                )}

                {extraMusics && extraMusics.length > 0 && (
                    <div>
                        <Text variant="body-default-s">Autres musiques :</Text>
                        <ul>
                            {extraMusics.map((music, index) => (
                                <li key={index}>
                                    <a href={music}>Musique {index + 1}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Flex>
        </Flex>
    );
};