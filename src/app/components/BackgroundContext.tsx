"use client";

// BackgroundContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type BackgroundContextType = {
    effectActive: boolean;
    setEffectActive: (active: boolean) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
    const [effectActive, setEffectActive] = useState(false);

    return (
        <BackgroundContext.Provider value={{ effectActive, setEffectActive }}>
            {children}
        </BackgroundContext.Provider>
    );
};

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useBackground must be used within a BackgroundProvider');
    }
    return context;
};
