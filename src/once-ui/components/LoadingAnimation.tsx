'use client';

import React from 'react';
import styles from './LoadingAnimation.module.scss';

const LoadingAnimation = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
        </div>
    );
};

export { LoadingAnimation };
