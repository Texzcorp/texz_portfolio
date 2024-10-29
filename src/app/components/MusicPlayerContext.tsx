"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useBackground } from "@/app/components/BackgroundContext";

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

    const stopMusic = useCallback((src: string) => {
        if (activePlayerSrc === src) {
            setActivePlayerSrc(null);
            setAudioData(null);
            setIsAnyMusicPlaying(false);
            stopPlaying();
        }
    }, [activePlayerSrc, stopPlaying]);

    const stopAllMusic = useCallback(() => {
        setActivePlayerSrc(null);
        setAudioData(null);
        setIsAnyMusicPlaying(false);
        stopPlaying();
    }, [stopPlaying]);

    const handleActivePlayerChange = useCallback((newSrc: string | null) => {
        if (newSrc) {
            setActivePlayerSrc(newSrc);
            setIsAnyMusicPlaying(true);
            startPlaying();
        } else {
            stopAllMusic();
        }
    }, [startPlaying, stopAllMusic]);

    useEffect(() => {
        if (activePlayerSrc) {
            setIsAnyMusicPlaying(true);
            startPlaying();
        } else {
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

export const useMusicPlayerContext = () => useContext(MusicPlayerContext);

