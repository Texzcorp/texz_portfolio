"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBackground } from "@/app/components/BackgroundContext";

interface MusicPlayerContextProps {
    activePlayerSrc: string | null;
    setActivePlayer: (src: string | null) => void;
    audioData: Float32Array | null;
    setAudioData: (data: Float32Array | null) => void;
    stopPlaying: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
    activePlayerSrc: null,
    setActivePlayer: () => {},
    audioData: null,
    setAudioData: () => {},
    stopPlaying: () => {},
});

interface MusicPlayerProviderProps {
    children: ReactNode;
}

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
    const [activePlayerSrc, setActivePlayerSrc] = useState<string | null>(null);
    const [audioData, setAudioData] = useState<Float32Array | null>(null);
    const { startPlaying, stopPlaying } = useBackground();

    useEffect(() => {
        if (activePlayerSrc) {
            startPlaying();
        } else {
            stopPlaying();
        }
    }, [activePlayerSrc, stopPlaying, startPlaying]);

    const setActivePlayer = (src: string | null) => {
        setActivePlayerSrc(src);
        if (src === null) {
            stopPlaying();
        }
    };

    return (
        <MusicPlayerContext.Provider value={{ activePlayerSrc, setActivePlayer, audioData, setAudioData, stopPlaying }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);
