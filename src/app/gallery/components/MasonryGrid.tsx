"use client";

import { SmartImage, RevealFx } from "@/once-ui/components";
import { gallery } from "@/app/resources";
import styles from "@/app/gallery/Gallery.module.scss";

// Définition du type pour une image
interface Image {
    src: string;
    alt: string;
    orientation: "vertical" | "horizontal" | "square";  // Type limité à ces valeurs
    span?: number;
}

interface Gallery {
    label: string;
    preset: string;
    title: string;
    description: string;
    images: Image[];
}

interface MasonryGridProps {
    gallery: Gallery; // On attend un objet gallery en prop
    rowGapAdjustment?: number; // Ajout d'une option de réduction de la hauteur entre les lignes
}

// Définition des presets avec leur configuration
const presetSettings: Record<"art3D" | "dessins" | "logo", { columns: string; columnGap: string; rowGap: string }> = {
    art3D: {
        columns: 'repeat(2, 1fr)',  // 2 colonnes en mode art3D
        columnGap: '16px',
        rowGap: '0px',
    },
    dessins: {
        columns: 'repeat(5, 1fr)',  // 5 colonnes en mode dessins
        columnGap: '16px',
        rowGap: '0px',
    },
    logo: {
        columns: 'repeat(4, 1fr)',  // 4 colonnes en mode logo
        columnGap: '16px',
        rowGap: '0px',
    }
};

export default function MasonryGrid({ gallery, rowGapAdjustment = 0 }: MasonryGridProps) { // Option de réduction de hauteur
    const { preset = 'art3D' } = gallery;
    const { columns, columnGap, rowGap } = presetSettings[preset as keyof typeof presetSettings];

    const getAspectRatio = (orientation: string): string => {
        switch (orientation) {
            case "vertical":
                return "9 / 12";
            case "horizontal":
                return "16 / 9";
            case "square":
                return "1 / 1";
            default:
                return "16 / 9";
        }
    };

    const getGridSpan = (preset: string, span?: number): number => {
        switch (preset) {
            case 'art3D':
                return span || 2;
            case 'dessins':
                return span || 1;
            case 'logo':
                return span || 1;
            default:
                return span || 1;
        }
    };

    const getGridRowSpan = (preset: string, span?: number): number => {
        // Si l'image prend 2 colonnes, elle prend aussi 2 lignes
        if (span === 2) {
            return 2;
        }
        // Sinon, elle prend 1 ligne par défaut
        return 1;
    };

    return (
        <div
            className={styles.gridContainer}
            style={{
                gridTemplateColumns: columns,
                gap: columnGap,
                rowGap: `calc(${rowGap} - ${rowGapAdjustment}px)`  // Ajustement de la hauteur entre les lignes
            }}
        >
            {gallery.images.map((image, index) => (
                <div
                    key={index}
                    className={styles.gridItem}
                    style={{ 
                        gridColumnEnd: `span ${getGridSpan(preset, image.span)}`, 
                        gridRowEnd: `span ${getGridRowSpan(preset, image.span)}`  // Ajout de la gestion des lignes
                    }}
                >
                    <RevealFx
                        style={{width: '100%'}}
                        delay={0.4}
                        speed="slow"
                    >
                        <SmartImage
                            radius="m"
                            aspectRatio={getAspectRatio(image.orientation)}
                            src={image.src}
                            alt={image.alt}
                            className={styles.gridImage}
                        />
                    </RevealFx>
                </div>
            ))}
        </div>
    );
}
