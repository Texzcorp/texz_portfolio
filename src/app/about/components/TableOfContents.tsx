'use client';

import React from 'react';
import { Flex, Text } from '@/once-ui/components';
import styles from '@/app/about/about.module.scss';

interface TableOfContentsProps {
    structure: {
        title: string;
        display: boolean;
    }[];
    about: {
        tableOfContent: {
            display: boolean;
        };
    };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
    const scrollTo = (id: string, offset: number) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    if (!about.tableOfContent.display) return null;

    return (
        <Flex
            style={{
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap'
            }}
            position="fixed"
            paddingLeft="24" gap="32"
            direction="column" hide="s">
            {structure
                .filter(section => section.display)
                .map((section, sectionIndex) => (
                <Flex key={sectionIndex} gap="12" direction="column">
                    <Flex
                        style={{ cursor: 'pointer' }}
                        className={styles.hover}
                        gap="8"
                        alignItems="center"
                        onClick={() => scrollTo(section.title, 80)}>
                        <Flex
                            height="1" width="16"
                            background="neutral-strong">
                        </Flex>
                        <Text>
                            {section.title}
                        </Text>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    );
};

export default TableOfContents;
