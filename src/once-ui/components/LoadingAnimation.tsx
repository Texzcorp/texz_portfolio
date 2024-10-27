'use client';

import React from 'react';
import styles from './LoadingAnimation.module.scss';

const LoadingAnimation = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.glassBox}>
                <div className={styles.orb}></div>
                <div className={styles.orbTrail}></div>
                <div className={styles.glowRing}></div>
            </div>
        </div>
    );
};

export { LoadingAnimation };
