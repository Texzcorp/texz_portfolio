import { getPosts } from '@/app/utils';
import { Flex } from '@/once-ui/components';
import { ProjectCard } from '@/app/components';
import { MusicProjectCard } from '@/app/components/MusicProjectCard'; // Importer le nouveau composant

interface ProjectsProps {
    range?: [number, number?];
}

// Définir l'interface Music ici en attendant
interface Music {
    src: string;
    title: string;
    style: string;
    cover: string;
}

export function MusicProjects({ range }: ProjectsProps) {
    let allProjects = getPosts(['src', 'app', 'music', 'projects']);

    const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedProjects = range
        ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
        : sortedProjects;

    return (
        <Flex 
            fillWidth 
            gap="l" 
            marginBottom="40" 
            direction="column"
            paddingX="l"
        >
            {displayedProjects.map((post) => {
                if (post.metadata.mainMusic || post.metadata.extraMusics) {
                    return (
                        <MusicProjectCard
                            key={post.slug}
                            href={`/programmation/${post.slug}`}
                            mainMusic={post.metadata.mainMusic}
                            extraMusics={post.metadata.extraMusics}
                        />
                    );
                }

                return (
                    <ProjectCard
                        key={post.slug}
                        href={`/programmation/${post.slug}`}
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
