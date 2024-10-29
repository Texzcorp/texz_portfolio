"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useBackground } from './BackgroundContext';

interface MusicPlayerContextType {
    activePlayerSrc: string | null;
    setActivePlayerSrc: (src: string | null) => void;
    audioData: Float32Array | null;
    setAudioData: (data: Float32Array | null) => void;
    stopMusic: (src: string) => void;
    stopAllMusic: () => void;
    isAnyMusicPlaying: boolean;
}

interface MusicPlayerProviderProps {
    children: React.ReactNode;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

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

