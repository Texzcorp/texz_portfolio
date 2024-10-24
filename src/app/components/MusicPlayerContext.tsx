"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useBackground } from "@/app/components/BackgroundContext";

interface MusicPlayerContextProps {
    activePlayerSrc: string | null;
    setActivePlayerSrc: (src: string | null) => void;
    audioData: Float32Array | null;
    setAudioData: (data: Float32Array | null) => void;
    stopMusic: (src: string) => void;
    isAnyMusicPlaying: boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps>({
    activePlayerSrc: null,
    setActivePlayerSrc: () => {},
    audioData: null,
    setAudioData: () => {},
    stopMusic: () => {},
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

    // Update when activePlayerSrc changes
    useEffect(() => {
        setIsAnyMusicPlaying(!!activePlayerSrc);
        if (activePlayerSrc) {
            startPlaying();
        } else {
            stopPlaying();
        }
    }, [activePlayerSrc, startPlaying, stopPlaying]);

    const stopMusic = useCallback((src: string) => {
        if (activePlayerSrc === src) {
            setActivePlayerSrc(null);
            setAudioData(null);
            stopPlaying();
        }
    }, [activePlayerSrc, stopPlaying]);

    return (
        <MusicPlayerContext.Provider value={{ 
            activePlayerSrc, 
            setActivePlayerSrc,
            audioData, 
            setAudioData,
            stopMusic,
            isAnyMusicPlaying
        }}>
            {children}
        </MusicPlayerContext.Provider>
    );
};

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);
