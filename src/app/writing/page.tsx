import { Flex, RevealFx, Heading } from '@/once-ui/components';
import { Mailchimp } from '@/app/components';
import { Posts } from '@/app/writing/components/Posts';

import { writing, newsletter, person } from '@/app/resources'
import { baseURL, mailchimp } from '@/app/resources'

export function generateMetadata() {
	const title = writing.title;
	const description = writing.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}/writing`,
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

export default function Writing() {
    return (
        <Flex
			fillWidth maxWidth="s"
			direction="column">
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Writing',
						headline: writing.title,
						description: writing.description,
						url: `https://${baseURL}/writing`,
						image: `${baseURL}/og?title=${encodeURIComponent(writing.title)}`,
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
			<div>
				<Heading
					marginBottom="l"
					variant="display-strong-s">
					{writing.title}
				</Heading>
				<Flex
					fillWidth flex={1}>
					<Posts range={[1,3]}/>
					<Posts range={[4]} columns="2"/>
				</Flex>
				{newsletter.display && (
					<Mailchimp/>
				)}
			</div>
        </Flex>
    );
}