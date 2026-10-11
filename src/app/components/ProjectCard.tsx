"use client";

import { AvatarGroup, Flex, Heading, SmartLink, Tag, Text } from "@/once-ui/components";
import { Carousel } from "./Carousel";

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
    status?: string;
    role?: string;
    links?: { label: string; href: string }[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars,
    status,
    role,
    links = [],
}) => {
    return (
        <Flex
            fillWidth gap="m"
            direction="column">
            {images.length > 0 && <Carousel
                images={images}
                title={title}
            />}

            <Flex
                mobileDirection="column"
                fillWidth paddingX="l" paddingTop="xs" paddingBottom="m" gap="l">
                {title && (
                    <Flex
                        flex={5} direction="column" gap="12">
                        {status && <Flex><Tag size="s">{status}</Tag></Flex>}
                        <Heading
                            as="h2"
                            wrap="balance"
                            variant="display-strong-xs">
                            {title}
                        </Heading>
                    </Flex>
                )}
                {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
                    <Flex
                        flex={7} direction="column"
                        gap="s">
                        {avatars?.length > 0 && (
                            <AvatarGroup
                                avatars={avatars}
                                size="m"
                                reverseOrder/>
                        )}
                        {description?.trim() && (
                            <Text
                                wrap="balance"
                                variant="body-default-s"
                                onBackground="neutral-weak">
                                {description}
                            </Text>
                        )}
                        {role && <Text variant="label-default-s" onBackground="neutral-weak">{role}</Text>}
                        {links.map(link => <SmartLink key={link.href} href={link.href} suffixIcon="arrowUpRight" style={{ margin: '0', width: 'fit-content' }}><Text variant="body-default-s">{link.label}</Text></SmartLink>)}
                        {content?.trim() && (
                            <SmartLink
                                suffixIcon="chevronRight"
                                style={{margin: '0', width: 'fit-content'}}
                                href={href}>
                                    <Text
                                        variant="body-default-s">
                                        Read case study
                                    </Text>
                            </SmartLink>
                        )}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
