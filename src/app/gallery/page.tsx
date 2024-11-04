import { Flex, RevealFx } from "@/once-ui/components";
import MasonryGrid from "./components/MasonryGrid";
import { baseURL, gallery as galleries, person } from "../resources"; // Renommer pour éviter confusion
import styles from './Gallery.module.scss'; // Si ton fichier SCSS est dans le même dossier que page.tsx

// Type explicite pour les galleries
interface Image {
    src: string;
    alt: string;
    orientation: "vertical" | "horizontal" | "square"; // Assure que les types sont bien reconnus
    span?: number;
}

interface Gallery {
    label: string;
    preset: string;
    title: string;
    description: string;
    images: Image[];
}

export function generateMetadata() {
    const activeGallery = galleries[0] as Gallery; // Cast pour assurer que TypeScript reconnaît le type
    const title = activeGallery.title;
    const description = activeGallery.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/gallery`,
            images: [
                {
                    url: ogImage,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

export default function Gallery() {
    return (
        <Flex fillWidth direction="column" className={styles.galleryContainer}> {/* Ajout de la classe */}
            {galleries.map((g, index) => {
                const gallery = g as Gallery; // Cast pour s'assurer du bon typage

                return (
                    <div key={index}>
                        <RevealFx
                            style={{width: '100%'}}
                            delay={0.4}
                        >
                            <h2 className={styles.galleryTitle}>{gallery.title}</h2> 
                            <p className={styles.galleryDescription}>{gallery.description}</p> {/* Ajout de la classe */}
                        </RevealFx>

                        <script
                            type="application/ld+json"
                            suppressHydrationWarning
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'ImageGallery',
                                    name: gallery.title,
                                    description: gallery.description,
                                    url: `https://${baseURL}/gallery`,
                                    image: gallery.images.map((image) => ({
                                        '@type': 'ImageObject',
                                        url: `${baseURL}${image.src}`,
                                        description: image.alt,
                                    })),
                                    author: {
                                        '@type': 'Person',
                                        name: person.name,
                                        image: {
                                            '@type': 'ImageObject',
                                            url: `${baseURL}${person.avatar}`,
                                        },
                                    },
                                }),
                            }}
                        />

                        <RevealFx
                            style={{width: '100%'}}
                            delay={0.4}
                            speed="slow"
                        >
                            <MasonryGrid gallery={gallery} /> {/* Pass the typed gallery */}
                        </RevealFx>
                    </div>
                );
            })}
        </Flex>
    );
}
