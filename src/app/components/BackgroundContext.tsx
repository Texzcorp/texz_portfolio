"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BackgroundContextProps {
    effectActive: boolean;
    startPlaying: () => void;
    stopPlaying: () => void;
    checkActivePlayers: () => void;
}

const BackgroundContext = createContext<BackgroundContextProps>({
    effectActive: false,
    startPlaying: () => {},
    stopPlaying: () => {},
    checkActivePlayers: () => {},
});

interface BackgroundProviderProps {
    children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
    const [effectActive, setEffectActive] = useState(false);
    const [activePlayersCount, setActivePlayersCount] = useState(0);

    const startPlaying = useCallback(() => {
        setActivePlayersCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount > 0) {
                setEffectActive(true);
            }
            return newCount;
        });
    }, []);

    const stopPlaying = useCallback(() => {
        setActivePlayersCount((prevCount) => {
            const newCount = Math.max(0, prevCount - 1);
            if (newCount === 0) {
                setEffectActive(false);
            } else {
                // Forcer la vérification si des lecteurs sont actifs après l'arrêt d'un lecteur
                checkActivePlayers();
            }
            return newCount;
        });
    }, []);

    const checkActivePlayers = useCallback(() => {
        // Vérifie explicitement le nombre de lecteurs actifs
        const players = document.querySelectorAll('audio');
        const anyPlaying = Array.from(players).some((audio) => !audio.paused);

        if (anyPlaying) {
            setEffectActive(true);
        } else {
            setEffectActive(false);
        }
    }, []);

    return (
        <BackgroundContext.Provider value={{ effectActive, startPlaying, stopPlaying, checkActivePlayers }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => useContext(BackgroundContext);
