"use client";

import { Flex, RevealFx, SmartImage } from "@/once-ui/components";
import { useEffect, useState } from "react";

interface CarouselProps {
    images: string[];
    title: string;
}

export const Carousel: React.FC<CarouselProps> = ({ images = [], title }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageClick = () => {
        if (images.length > 1) {
            setIsTransitioning(false);
            const nextIndex = (activeIndex + 1) % images.length;
            handleControlClick(nextIndex);
        }
    };

    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    };

    return (
        <Flex fillWidth gap="m" direction="column">
            <Flex onClick={handleImageClick}>
                <RevealFx
                    style={{ width: '100%' }}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast"
                >
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
                        ></Flex>
                    ))}
                </Flex>
            )}
        </Flex>
    );
};
