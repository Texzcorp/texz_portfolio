import { getPosts } from '@/app/utils';
import { Flex } from '@/once-ui/components';
import { MusicProjects } from '@/app/music/components/Projects';
import { baseURL, person, music } from '../resources';
import VantaBackground from '@/app/components/VantaBackground';
import Notification from '@/app/components/Notification';
import ClientSideCheck from '@/app/components/ClientSideCheck'; // Assurez-vous que le chemin est correct
import styles from '@/app/about/about.module.scss';

export function generateMetadata() {
    const title = music.title;
    const description = music.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://${baseURL}/music`,
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

export default function Music() {
    let allProjects = getPosts(['src', 'app', 'music', 'projects']);

    return (
        <>
            {/* Appel côté client pour vérifier les lecteurs actifs */}
            <ClientSideCheck />

            <VantaBackground />
            <Flex fillWidth maxWidth="m" direction="column">
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            headline: music.title,
                            description: music.description,
                            url: `https://${baseURL}/projects`,
                            image: `${baseURL}/og?title=Design%20Projects`,
                            author: {
                                '@type': 'Person',
                                name: person.name,
                            },
                            hasPart: allProjects.map(project => ({
                                '@type': 'CreativeMusic',
                                headline: project.metadata.title,
                                description: project.metadata.summary,
                                url: `https://${baseURL}/projects/${project.slug}`,
                                image: `${baseURL}/${project.metadata.image}`,
                            })),
                        }),
                    }}
                />

                <Notification
                    message="Never miss my latest releases"
                    link="https://www.youtube.com/@texzmusic9981?sub_confirmation=1"
                    linkText="Subscribe"
                    iconName="youtube"
                    delay={3000}
                />

                <MusicProjects />
            </Flex>
        </>
    );
}
