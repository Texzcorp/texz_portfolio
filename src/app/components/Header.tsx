"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Flex, ToggleButton } from "@/once-ui/components"
import styles from '@/app/components/Header.module.scss'
import Head from 'next/head'; // Import du composant Head

import { routes, display } from '@/app/resources'
import { person, home, about, writing, programmation, music, gallery, experimentalproj } from '@/app/resources'

type TimeDisplayProps = {
    timeZone: string;
    locale?: string;  // Optionally allow locale, defaulting to 'en-GB'
};

interface Gallery {
    label: string;
    preset: string;
    title: string;
    description: string;
    images: Image[];
}

interface Image {
    src: string;
    alt: string;
    orientation: string;
    span?: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = 'en-GB' }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(now);
            setCurrentTime(timeString);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return (
        <>
            {currentTime}
        </>
    );
};

export default TimeDisplay;

export const Header = () => {
    const pathname = usePathname() ?? '';

    return (
        <>
        <Head>
            <meta property="og:site_name" content="Terence's Portfolio" />
        </Head>
        <Flex style={{height: 'fit-content'}}
            className={styles.position}
            as="header"
            zIndex={9}
            fillWidth padding="8"
            justifyContent="center">
            <Flex
                hide="s"
                paddingLeft="12" fillWidth
                alignItems="center"
                textVariant="body-default-s">
                { display.location && (
                    <>{person.location}</>
                )}
            </Flex>
            <Flex
                background="surface" border="neutral-medium" borderStyle="solid-1" radius="m-4" shadow="l"
                padding="4"
                justifyContent="center">
                <Flex
                    gap="4"
                    textVariant="body-default-s">
                    { routes['/'] && (
                        <ToggleButton
                            prefixIcon="outlineHomeMd"
                            href="/"
                            selected={pathname === "/"}>
                            <Flex paddingX="2" hide="s">{home.label}</Flex>
                        </ToggleButton>
                    )}
                    { routes['/about'] && (
                        <ToggleButton
                            prefixIcon="person"
                            href="/about"
                            selected={pathname === "/about"}>
                            <Flex paddingX="2" hide="s">{about.label}</Flex>
                        </ToggleButton>
                    )}
                    { routes['/programmation'] && (
                        <ToggleButton
                            prefixIcon="unreal"
                            href="/programmation"
                            selected={pathname.startsWith('/programmation')}>
                            <Flex paddingX="2" hide="s">{programmation.label}</Flex>
                        </ToggleButton>
                    )}
                    { routes['/music'] && (
                        <ToggleButton
                            prefixIcon="musicNote"
                            href="/music"
                            selected={pathname.startsWith('/music')}>
                            <Flex paddingX="2" hide="s">{music.label}</Flex>
                        </ToggleButton>
                    )}
                    { routes['/gallery'] && (
                        <ToggleButton
                            prefixIcon="projector"
                            href="/gallery"
                            selected={pathname.startsWith('/gallery')}>
                            <Flex paddingX="2" hide="s">{gallery[0].label}</Flex> {/* Utilisation de gallery.label */}
                        </ToggleButton>
                    )}
                    { routes['/writing'] && (
                        <ToggleButton
                            prefixIcon="feather"
                            href="/writing"
                            selected={pathname.startsWith('/writing')}>
                            <Flex paddingX="2" hide="s">{writing.label}</Flex>
                        </ToggleButton>
                    )}
                    { routes['/experimentalproj'] && (
                        <ToggleButton
                            prefixIcon="lightbulb"
                            href="/experimentalproj"
                            selected={pathname.startsWith('/experimentalproj')}>
                            <Flex paddingX="2" hide="s">{experimentalproj.label}</Flex>
                        </ToggleButton>
                    )}
                </Flex>
            </Flex>
            <Flex
                hide="s"
                paddingRight="12" fillWidth
                justifyContent="flex-end" alignItems="center"
                textVariant="body-default-s">
                { display.time && (
                    <TimeDisplay timeZone={person.location}/>
                )}
            </Flex>
        </Flex></>
    )
}