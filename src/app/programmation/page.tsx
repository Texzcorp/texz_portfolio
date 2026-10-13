import { getPosts } from '@/app/utils';
import { Flex, Heading, Text, RevealFx } from '@/once-ui/components';
import { Projects } from '@/app/programmation/components/Projects';
import { baseURL, person, programmation } from '../resources';

export function generateMetadata() {
	const title = programmation.title;
	const description = programmation.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		alternates: { canonical: '/programmation' },
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/programmation`,
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

export default function Programmation() {
    let allProjects = getPosts(['src', 'app', 'programmation', 'projects']);

    return (
        <Flex
			fillWidth maxWidth="m"
			direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        headline: programmation.title,
                        description: programmation.description,
                        url: `https://${baseURL}/programmation`,
                        image: `https://${baseURL}/og?title=Software%20and%20games`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                        hasPart: allProjects.map(project => ({
                            '@type': 'CreativeWork',
                            headline: project.metadata.title,
                            description: project.metadata.summary,
                            url: `https://${baseURL}/programmation/${project.slug}`,
                        })),
                    }),
                }}
            />
            <RevealFx translateY="16" style={{ width: '100%' }}>
                <Flex fillWidth paddingX="l" paddingTop="24" paddingBottom="40" direction="column" gap="12">
                    <Heading variant="display-strong-s">Software & games</Heading>
                    <Text as="p" variant="body-default-m" onBackground="neutral-weak">Interactive worlds, tools and systems. Current projects alongside earlier experiments.</Text>
                </Flex>
            </RevealFx>
            <Projects/>
        </Flex>
    );
}
