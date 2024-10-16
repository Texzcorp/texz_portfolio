"use client";

import { useEffect } from 'react';
import { useBackground } from '@/app/components/BackgroundContext';

export default function ClientSideCheck() {
    const { checkActivePlayers } = useBackground();

    useEffect(() => {
        // Vérifier les joueurs actifs au montage du composant
        checkActivePlayers();
    }, [checkActivePlayers]);

    return null;
}
