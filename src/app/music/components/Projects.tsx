import { getPosts } from '@/app/utils';
import { Flex } from '@/once-ui/components';
import { ProjectCard } from '@/app/components';
import { MusicProjectCard } from '@/app/components/MusicProjectCard'; // Importer le nouveau composant

interface ProjectsProps {
    range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
    let allProjects = getPosts(['src', 'app', 'music', 'projects']);

    const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedProjects = range
        ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
        : sortedProjects;

    return (
        <Flex fillWidth gap="l" marginBottom="40" paddingX="l" direction="column">
            {displayedProjects.map((post) => {
                // Si le projet contient de la musique, utiliser MusicProjectCard
                if (post.metadata.mainMusic || post.metadata.extraMusics) {
                    return (
                        <MusicProjectCard
                            key={post.slug}
                            href={`/work/${post.slug}`}
                            image={post.metadata.images[0]} // Utiliser la première image
                            title={post.metadata.title}
                            description={post.metadata.summary}
                            mainMusic={post.metadata.mainMusic}
                            extraMusics={post.metadata.extraMusics}
                        />
                    );
                }

                // Sinon, utiliser ProjectCard pour les autres projets
                return (
                    <ProjectCard
                        key={post.slug}
                        href={`/work/${post.slug}`}
                        images={post.metadata.images}
                        title={post.metadata.title}
                        description={post.metadata.summary}
                        content={post.content}
                        avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
                    />
                );
            })}
        </Flex>
    );
}
