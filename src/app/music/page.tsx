import { Flex } from '@/once-ui/components';
import { MusicProjects } from '@/app/music/components/Projects';
import { baseURL, person, music } from '../resources';
import VantaBackground from '@/app/components/VantaBackground';
import { SelectedMusic } from '@/app/components/SelectedMusic';
import { CompositionOffer } from '@/app/components/CompositionOffer';
import { musicSelection } from '@/app/resources/portfolio';
import updateStyles from '@/app/components/PortfolioUpdates.module.scss';

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
                            hasPart: musicSelection.map(track => ({
                                '@type': 'MusicRecording',
                                name: track.title,
                                genre: track.style,
                                url: track.url,
                            })),
                        }),
                    }}
                />

                <div className={updateStyles.section}>
                    <p className={updateStyles.eyebrow}>Terence Diaz · composer</p>
                    <h1>Music for pictures, brands and games.</h1>
                    <p className={updateStyles.muted}>Start with music to picture, then explore house, drum & bass, dark fantasy, retrowave, ambient and groove, with a complementary orchestral sketch. My work also brings these directions together.</p>
                    <a href="#composition-offer">Discuss a music brief →</a>
                </div>
                <SelectedMusic />
                <CompositionOffer />
                <details className={updateStyles.details}>
                    <summary>Earlier collection · listen with the on-site audio player</summary>
                    <MusicProjects />
                </details>
            </Flex>
        </>
    );
}
