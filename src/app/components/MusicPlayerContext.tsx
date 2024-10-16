"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBackground } from "@/app/components/BackgroundContext";

interface MusicPlayerContextProps {
    activePlayerSrc: string | null;
    setActivePlayer: (src: string | null) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
    activePlayerSrc: null,
    setActivePlayer: () => {},
});

interface MusicPlayerProviderProps {
    children: ReactNode;
}

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
    const [activePlayerSrc, setActivePlayerSrc] = useState<string | null>(null);
    const { startPlaying, stopPlaying } = useBackground();

    useEffect(() => {
        // Update the background effect based on the active player state
        startPlaying(); // Pour activer l'effet quand un lecteur commence
        stopPlaying(); // Pour désactiver l'effet quand un lecteur s'arrête
    }, [activePlayerSrc, stopPlaying, startPlaying]);

    const setActivePlayer = (src: string | null) => {
        setActivePlayerSrc(src);
    };

    return (
        <MusicPlayerContext.Provider value={{ activePlayerSrc, setActivePlayer }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);
