import { formatDate, getPosts } from '@/app/utils';
import { Flex, Grid, Heading, SmartLink, Text } from '@/once-ui/components';
import styles from '@/app/writing/components/Posts.module.scss';

interface PostsProps {
    range?: [number] | [number, number];
    columns?: '1' | '2' | '3';
}

export function Posts({
    range,
    columns = '1'
}: PostsProps) {
    let allWritings = getPosts(['src', 'app', 'writing', 'posts']);

    const sortedWritings = allWritings.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedWritings = range
        ? sortedWritings.slice(
              range[0] - 1,
              range.length === 2 ? range[1] : sortedWritings.length 
          )
        : sortedWritings;

    return (
        <>
            { displayedWritings.length > 0 && (
                <Grid
                    columns={`repeat(${columns}, 1fr)`} mobileColumns="1col"
                    fillWidth marginBottom="40" gap="m" paddingX="l">
                    {displayedWritings.map((post) => (
                        <SmartLink
                            style={{
                                textDecoration: 'none',
                                margin: '0',
                                height: 'fit-content',
                            }}
                            className={styles.hover}
                            key={post.slug}
                            href={`/writing/${post.slug}`}>
                            <Flex
                                position="relative"
                                paddingX="16" paddingY="12" gap="8"
                                direction="column" justifyContent="center">
                                <Flex
                                    position="absolute"
                                    className={styles.indicator}
                                    width="20" height="2"
                                    background="neutral-strong"/>
                                <Heading as="h2" wrap="balance">
                                    {post.metadata.title}
                                </Heading>
                                <Text
                                    variant="body-default-s"
                                    onBackground="neutral-weak">
                                    {formatDate(post.metadata.publishedAt, false)}
                                </Text>
                            </Flex>
                        </SmartLink>
                    ))}
                </Grid>
            )}
        </>
    );
}