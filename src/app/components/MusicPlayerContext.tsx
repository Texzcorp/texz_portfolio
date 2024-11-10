"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useBackground } from "@/app/components/BackgroundContext";
import { useRouter, usePathname } from 'next/navigation';

interface MusicPlayerContextProps {
    activePlayerSrc: string | null;
    setActivePlayerSrc: (src: string | null) => void;
    audioData: Float32Array | null;
    setAudioData: (data: Float32Array | null) => void;
    stopMusic: (src: string) => void;
    stopAllMusic: () => void;
    isAnyMusicPlaying: boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
    activePlayerSrc: null,
    setActivePlayerSrc: () => {},
    audioData: null,
    setAudioData: () => {},
    stopMusic: () => {},
    stopAllMusic: () => {},
    isAnyMusicPlaying: false,
});

interface MusicPlayerProviderProps {
    children: ReactNode;
}

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
    const [activePlayerSrc, setActivePlayerSrc] = useState<string | null>(null);
    const [audioData, setAudioData] = useState<Float32Array | null>(null);
    const { startPlaying, stopPlaying } = useBackground();
    const [isAnyMusicPlaying, setIsAnyMusicPlaying] = useState(false);
    const pathname = usePathname();

    // Effet pour gérer le changement de route
    useEffect(() => {
        stopAllMusic();
    }, [pathname]); // Se déclenche à chaque changement de route

    const stopAllMusic = useCallback(() => {
        setActivePlayerSrc(null);
        setAudioData(null);
        setIsAnyMusicPlaying(false);
        stopPlaying();
        
        // Arrêter tous les éléments audio de la page
        const audioElements = document.getElementsByTagName('audio');
        Array.from(audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }, [stopPlaying]);

    // Effet pour gérer le nettoyage lors de la navigation
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopAllMusic();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            stopAllMusic();
        };
    }, [stopAllMusic]);

    // Effet pour gérer l'état de lecture
    useEffect(() => {
        if (activePlayerSrc) {
            setIsAnyMusicPlaying(true);
            startPlaying();
        } else {
            setIsAnyMusicPlaying(false);
            stopPlaying();
        }
    }, [activePlayerSrc, startPlaying, stopPlaying]);

    const stopMusic = useCallback((src: string) => {
        if (activePlayerSrc === src) {
            setActivePlayerSrc(null);
            setAudioData(null);
            setIsAnyMusicPlaying(false);
            stopPlaying();
        }
    }, [activePlayerSrc, stopPlaying]);

    const handleActivePlayerChange = useCallback((newSrc: string | null) => {
        if (newSrc && newSrc !== activePlayerSrc) {
            setActivePlayerSrc(newSrc);
            setIsAnyMusicPlaying(true);
            startPlaying();
        } else if (!newSrc) {
            setActivePlayerSrc(null);
            setIsAnyMusicPlaying(false);
            stopPlaying();
        }
    }, [activePlayerSrc, startPlaying, stopPlaying]);

    return (
        <MusicPlayerContext.Provider value={{
            activePlayerSrc,
            setActivePlayerSrc: handleActivePlayerChange,
            audioData,
            setAudioData,
            stopMusic,
            stopAllMusic,
            isAnyMusicPlaying
        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayerContext must be used within a MusicPlayerProvider');
    }
    return context;
};

