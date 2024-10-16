"use client";

// Notification.tsx
import { useEffect, useState } from 'react';
import { Flex, Icon } from '@/once-ui/components';
import styles from '@/app/components/Notification.module.scss';

interface NotificationProps {
    message: string;
    link: string;
    linkText: string;
    iconName: string;
    delay?: number; // En millisecondes, délai avant l'apparition de la notification
}

export default function Notification({ message, link, linkText, iconName, delay = 1000 }: NotificationProps) {
    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            setTimeout(() => {
                setShow(true);
            }, 50); // Légère temporisation pour démarrer l'animation
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    if (!isVisible) return null;

    return (
        <div className={`${styles.notification} ${show ? styles.show : ''}`}>
            <Icon name={iconName} onBackground="brand-weak" />
            <span>{message}</span>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.notificationLink}
            >
                {linkText}
            </a>
        </div>
    );
}
