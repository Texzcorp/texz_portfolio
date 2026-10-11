import { getPosts } from '@/app/utils';
import { Flex } from '@/once-ui/components';
import { Projects } from '@/app/programmation/components/Projects';
import { baseURL, person, programmation } from '../resources';
import { RecentProjects } from '@/app/components/RecentProjects';
import updateStyles from '@/app/components/PortfolioUpdates.module.scss';

export function generateMetadata() {
	const title = programmation.title;
	const description = programmation.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
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
                            image: `${baseURL}/${project.metadata.image}`,
                        })),
                    }),
                }}
            />
            <div className={updateStyles.section}>
                <h1>Software & games</h1>
                <p className={updateStyles.muted}>Public projects, product previews and work in development.</p>
            </div>
            <RecentProjects />
            <h2>Earlier projects</h2>
            <Projects/>
        </Flex>
    );
}
