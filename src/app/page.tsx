import React from 'react';

import { Heading, Icon, IconButton, SmartImage, Flex, Tag, Text, Button,  Avatar, RevealFx } from '@/once-ui/components';
import { Projects } from '@/app/programmation/components/Projects';
import { MusicProjects } from '@/app/music/components/Projects';
import MasonryGrid from '@/app/gallery/components/MasonryGrid';
import { gallery as galleries } from '@/app/resources'; // Renommer pour éviter confusion

import { about, baseURL, social, home, newsletter, person, routes } from '@/app/resources'
import { Mailchimp } from '@/app/components';
import { Posts } from '@/app/writing/components/Posts';
import TableOfContents from '@/app/about/components/TableOfContents';
import styles from '@/app/about/about.module.scss'
import VantaBackground from '@/app/components/VantaBackground';

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

const structure = [
    { 
        title: about.intro.title,
        display: about.intro.display,
        items: []
    },
    { 
        title: about.programmation.title,
        display: about.programmation.display,
        items: about.programmation.experiences.map(experience => experience.company)
    },
    { 
        title: about.studies.title,
        display: about.studies.display,
        items: about.studies.institutions.map(institution => institution.name)
    },
    { 
        title: about.writing.title,
        display: about.writing.display,
        items: []
    },
    { 
        title: about.progvideogames.title,
        display: about.progvideogames.display,
        items: []
    },
    { 
        title: about.technical.title,
        display: about.technical.display,
        items: about.technical.skills.map(skill => skill.title)
    },
]

export function generateMetadata() {
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}`,
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

export default function Home() {
	return (
		<Flex
			maxWidth="m" fillWidth gap="xl"
			direction="column" alignItems="center">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
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
			<script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: person.name,
                        jobTitle: person.role,
                        description: about.intro.description,
                        url: `https://${baseURL}/about`,
                        image: `${baseURL}/images/${person.avatar}`,
                        sameAs: social
                            .filter((item) => item.link && !item.link.startsWith('mailto:')) // Filter out empty links and email links
                            .map((item) => item.link),
                        programmationsFor: {
                            '@type': 'Organization',
                            name: about.programmation.experiences[0].company || ''
                        },
                    }),
                }}
            />
			













			{ about.tableOfContent.display && (
                <Flex
                    style={{ left: '0', top: '50%', transform: 'translateY(-50%)' }}
                    position="fixed"
                    paddingLeft="24" gap="32"
                    direction="column" hide="s">
                    <TableOfContents
                        structure={structure}
                        about={about} />
                </Flex>
            )}
            
						
            
            <Flex
                fillWidth
                mobileDirection="column" justifyContent="center">
                <RevealFx translateY="16" delay={0.6}>
                    { about.avatar.display && (
                        <Flex
                            minWidth="160" paddingX="l" paddingBottom="xl" gap="m"
                            flex={3} direction="column" alignItems="center">
                            <Avatar
                                src={person.avatar}
                                size="xl"/>
                            <Flex
                                gap="8"
                                alignItems="center">
                                <Icon
                                    onBackground="accent-weak"
                                    name="globe"/>
                                {person.location}
                            </Flex>
                            { person.languages.length > 0 && (
                                <Flex
                                    wrap
                                    gap="8">
                                    {person.languages.map((language, index) => (
                                        <Tag
                                            key={index}
                                            size="l">
                                            {language}
                                        </Tag>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    )}
                </RevealFx>
                <Flex
                    className={styles.blockAlign}
                    fillWidth flex={9} maxWidth={80} direction="column">
                    <RevealFx translateY="16" delay={0.1}>
                        <Flex
                            id={about.intro.title}
                            fillWidth minHeight="160"
                            direction="column" justifyContent="center"
                            marginBottom="32">
                            {/* {about.calendar.display && (
                                <Flex
                                    className={styles.blockAlign}
                                    style={{
                                        backdropFilter: 'blur(var(--static-space-1))',
                                        border: '1px solid var(--brand-alpha-medium)',
                                        width: 'fit-content'
                                    }}
                                    alpha="brand-weak" radius="full"
                                    fillWidth padding="4" gap="8" marginBottom="m"
                                    alignItems="center">
                                    <Flex paddingLeft="12">
                                        <Icon
                                            name="calendar"
                                            onBackground="brand-weak"/>
                                    </Flex>
                                    <Flex
                                        paddingX="8">
                                        Schedule a call
                                    </Flex>
                                    <IconButton
                                        href={about.calendar.link}
                                        data-border="rounded"
                                        variant="tertiary"
                                        icon="chevronRight"/>
                                </Flex>
                            )} */}
                            <Heading
                                className={styles.textAlign}
                                variant="display-strong-xl">
                                {person.name}
                            </Heading>
                            <Text
                                className={styles.textAlign}
                                variant="display-default-xs"
                                onBackground="neutral-weak"
                                style={{ fontSize: '28px' }}  // Ajuste la taille selon tes besoins
                                >
                                {person.role}
                            </Text>
                            {social.length > 0 && (
                                <Flex
                                    className={styles.blockAlign}
                                    paddingTop="20" paddingBottom="8" gap="8" wrap>
                                    {social.map((item) => (
                                        item.link && (
                                            <Button
                                                key={item.name}
                                                href={item.link}
                                                prefixIcon={item.icon}
                                                label={item.name}
                                                size="s"
                                                variant="tertiary"/>
                                        )
                                    ))}
                                </Flex>
                            )}
                            
                        </Flex>
                    </RevealFx>
                    

                    { about.intro.display && (
                        <Flex
                            direction="column"
                            textVariant="body-default-m"
                            fillWidth gap="l" marginBottom="xl">
                            <RevealFx translateY="16" delay={0.6} speed="slow">{about.intro.description}</RevealFx>
                        </Flex>
                    )}

                    <RevealFx translateY="16" delay={0.8} speed="slow">
                        <Heading
                            as="h2"
                            id={about.programmation.title}
                            variant="display-strong-s" marginBottom="8">
                            Virtual production
                        </Heading>
                    </RevealFx>

                    <Flex
                            direction="column"
                            textVariant="body-default-m"
                            fillWidth
                            gap="8"
                            marginBottom="l"
                            textSize="l"
                            onBackground="neutral-strong"
                            >
                            <RevealFx translateY="16" delay={0.6} speed="slow">
                                I showcase a blend of real-world elements and imaginative artistic creations, aiming to present environments and styles that are rarely seen. By leveraging specialized tools and real-time engines like UE5, I craft virtual production setups that seamlessly integrate with live streaming, focusing on organic transitions between the tangible and the visionary.
                            </RevealFx>
                    </Flex>
                    
                    {/* Exemple de call de ma gallerie de projet virtual production */}
                    <RevealFx translateY="16" delay={1.0} speed="slow">
                        <Flex fillWidth direction="column" className={styles.galleryContainer}> 
                            {galleries
                                .filter((g) => g.preset === 'art3D')
                                .map((g, index) => {
                                    const gallery = g as Gallery;

                                    return (
                                        <div key={index}>
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

                                            <MasonryGrid gallery={gallery} />
                                        </div>
                                    );
                                })}
                        </Flex>
                    </RevealFx>

                    <Heading
                        as="h2"
                        id={about.studies.title}
                        variant="display-strong-s" marginBottom="8" marginTop="40">
                        Music composition
                    </Heading>

                    <Flex
                            direction="column"
                            textVariant="body-default-m"
                            fillWidth
                            gap="8"
                            marginBottom="l"
                            textSize="l"
                            onBackground="neutral-strong"
                            >
                            <RevealFx translateY="16" delay={0.6} speed="slow">As a versatile composer, I focus on blending genres and creating unique musical styles. While my portfolio may categorize pieces into distinct genres, most of my work defies simple classification. I consistently bring something extra—whether it's harmonic richness, melodic depth, or intricate rhythms. Jazz-inspired chords often add emotional complexity and ambiguity to my compositions.</RevealFx>
                    </Flex>
                    
                    {/* Exemple de call de projet musique */}

                    <VantaBackground />
					<MusicProjects range={[1,1]}/>

                    <Heading
                        as="h2"
                        id={about.writing.title}
                        variant="display-strong-s" marginBottom="8" marginTop="40">
                        Narration & Scriptwriting
                    </Heading>

                    <Flex
                            direction="column"
                            textVariant="body-default-m"
                            fillWidth
                            gap="8"
                            marginBottom="l"
                            textSize="l"
                            onBackground="neutral-strong"
                            >
                            <RevealFx translateY="16" delay={0.6} speed="slow">
                                I craft narratives that weave together intricate world-building with nuanced character development. My writing oscillates between subtle humor and complex dramatic themes, exploring moral ambiguity through carefully structured storylines. I believe in creating antagonists whose motivations challenge conventional storytelling expectations.
                            </RevealFx>
                    </Flex>

                    {/* Exemple de call de projet d'écriture */}
					{routes['/writing'] && (
						<Flex fillWidth paddingX="20">
							<Posts range={[3,3]} columns="1"/>
						</Flex>
					)}
                    {routes['/writing'] && (
						<Flex fillWidth paddingX="20">
							<Posts range={[1,1]} columns="1"/>
						</Flex>
					)}

                    <Heading
                        as="h2"
                        id={about.progvideogames.title}
                        variant="display-strong-s" marginBottom="8" marginTop="40">
                        Programmation & video games
                    </Heading>

                    <Flex
                            direction="column"
                            textVariant="body-default-m"
                            fillWidth
                            gap="8"
                            marginBottom="l"
                            textSize="l"
                            onBackground="neutral-strong"
                            >
                            <RevealFx translateY="16" delay={0.6} speed="slow">
                                I develop modular and optimized methods, creating well-thought-out systems that save time and enhance efficiency. By incorporating procedural generation, I balance this with a keen attention to detail, ensuring that each project is both robust and refined. My focus is on designing intuitive UI/UX while maintaining complex, interconnected systems that reveal their depth over time.
                            </RevealFx>
                    </Flex>

                    {/* Exemple de call d'un projet de jeu vidéo */}
                    <Projects range={[1,1]}/>
                    
                    <hr style={{ marginBottom: '60px', border: 'none', borderTop: '1px solid #ccc', width: '70%' }} />
                    
                    { about.technical.display && (
                        <>
                            <Heading
                                as="h2"
                                id={about.technical.title}
                                variant="display-strong-s" marginBottom="20">
                                {about.technical.title}
                            </Heading>
                            <Flex
                                direction="column"
                                fillWidth gap="l">
                                {about.technical.skills.map((skill, index) => (
                                    <Flex
                                        key={`${skill}-${index}`}
                                        fillWidth gap="4"
                                        direction="column">
                                        <Text
                                            variant="heading-strong-l">
                                            {skill.title}
                                        </Text>
                                        <Text
                                            variant="body-default-m"
                                            onBackground="neutral-weak">
                                            {skill.description}
                                        </Text>
                                        {skill.images.length > 0 && (
                                            <Flex
                                                fillWidth paddingTop="m" gap="12"
                                                wrap>
                                                {skill.images.map((image, index) => (
                                                    <Flex
                                                        key={index}
                                                        border="neutral-medium"
                                                        borderStyle="solid-1"
                                                        radius="m"
                                                        minWidth={image.width} height={image.height}>
                                                        <SmartImage
                                                            enlarge
                                                            radius="m"
                                                            sizes={image.width.toString()}
                                                            alt={image.alt}
                                                            src={image.src}/>
                                                    </Flex>
                                                ))}
                                            </Flex>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>
            { newsletter.display &&
				<Mailchimp/>
			}
        </Flex>
    );
}

// 		</Flex>
// 	);
// }
// export default function About() {
//     return (
//         <Flex
//             fillWidth maxWidth="m"
//             direction="column">
            // <script
            //     type="application/ld+json"
            //     suppressHydrationWarning
            //     dangerouslySetInnerHTML={{
            //         __html: JSON.stringify({
            //             '@context': 'https://schema.org',
            //             '@type': 'Person',
            //             name: person.name,
            //             jobTitle: person.role,
            //             description: about.intro.description,
            //             url: `https://${baseURL}/about`,
            //             image: `${baseURL}/images/${person.avatar}`,
            //             sameAs: social
            //                 .filter((item) => item.link && !item.link.startsWith('mailto:')) // Filter out empty links and email links
            //                 .map((item) => item.link),
            //             worksFor: {
            //                 '@type': 'Organization',
            //                 name: about.work.experiences[0].company || ''
            //             },
            //         }),
            //     }}
            // />
