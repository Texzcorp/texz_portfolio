"use client";

import Masonry from 'react-masonry-css';
import { SmartImage } from "@/once-ui/components";
import { gallery } from "@/app/resources";
import styles from "@/app/gallery/Gallery.module.scss";

export default function MasonryGrid() {
    const breakpointColumnsObj = {
        default: 4,
        1440: 3,
        1024: 2,
        560: 1
    };

    // Fonction pour définir l'aspect ratio en fonction de l'orientation
    const getAspectRatio = (orientation: string) => {
        switch (orientation) {
            case "vertical":
                return "9 / 12";
            case "horizontal":
                return "16 / 9";
            case "square":
                return "1 / 1";
            default:
                return "16 / 9"; // Valeur par défaut si aucune orientation n'est définie
        }
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.masonryGrid}
            columnClassName={styles.masonryGridColumn}>
            {gallery.images.map((image, index) => (
                <SmartImage
                    key={index}
                    radius="m"
                    aspectRatio={getAspectRatio(image.orientation)}
                    src={image.src}
                    alt={image.alt}
                    className={styles.gridItem}
                />
            ))}
        </Masonry>
    );
}
