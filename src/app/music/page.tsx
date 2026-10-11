import { getPosts } from '@/app/utils';
import { Flex } from '@/once-ui/components';
import { MusicProjects } from '@/app/music/components/Projects';
import { baseURL, person, music } from '../resources';
import VantaBackground from '@/app/components/VantaBackground';
import { CompositionOffer } from '@/app/components/CompositionOffer';

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
                            url: `https://${baseURL}/music`,
                            image: `https://${baseURL}/og?title=Music`,
                            author: {
                                '@type': 'Person',
                                name: person.name,
                            },
                            hasPart: allProjects.map(project => ({
                                '@type': 'CreativeWork',
                                headline: project.metadata.title,
                                description: project.metadata.summary,
                                url: `https://${baseURL}/music/${project.slug}`,
                            })),
                        }),
                    }}
                />

                <MusicProjects headingLevel="h1" />
                <CompositionOffer />
            </Flex>
        </>
    );
}
