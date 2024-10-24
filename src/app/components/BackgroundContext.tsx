"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BackgroundContextProps {
    effectActive: boolean;
    startPlaying: () => void;
    stopPlaying: () => void;
}

const BackgroundContext = createContext<BackgroundContextProps>({
    effectActive: false,
    startPlaying: () => {},
    stopPlaying: () => {},
});

interface BackgroundProviderProps {
    children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
    const [effectActive, setEffectActive] = useState(false);

    const startPlaying = useCallback(() => {
        setEffectActive(true);
    }, []);

    const stopPlaying = useCallback(() => {
        setEffectActive(false);
    }, []);

    return (
        <BackgroundContext.Provider value={{ 
            effectActive, 
            startPlaying, 
            stopPlaying 
        }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => useContext(BackgroundContext);
