"use client";

// BackgroundContext.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Définition du contexte avec les types nécessaires
interface BackgroundContextProps {
    effectActive: boolean;
    setEffectActive: (active: boolean) => void;
    updateIsPlaying: (id: string, isPlaying: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextProps>({
    effectActive: false,
    setEffectActive: () => {},
    updateIsPlaying: () => {},
});

interface BackgroundProviderProps {
    children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
    const [effectActive, setEffectActive] = useState(false);
    const [players, setPlayers] = useState<Record<string, boolean>>({});

    const updateIsPlaying = useCallback((id: string, isPlaying: boolean) => {
        setPlayers((prev) => {
            const updatedPlayers = { ...prev, [id]: isPlaying };
            const isAnyPlaying = Object.values(updatedPlayers).some((playing) => playing);
            setEffectActive(isAnyPlaying);
            return updatedPlayers;
        });
    }, []);

    return (
        <BackgroundContext.Provider value={{ effectActive, setEffectActive, updateIsPlaying }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => useContext(BackgroundContext);
