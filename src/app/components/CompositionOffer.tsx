import { compositionContact } from '@/app/resources/portfolio';
import { Button, Flex, Heading, Text } from '@/once-ui/components';

export function CompositionOffer() {
    return (
        <Flex as="section" id="composition-offer" fillWidth paddingX="l" paddingY="40" gap="l" mobileDirection="column" border="neutral-medium" style={{ borderWidth: '1px 0 0' }}>
            <Flex flex={5} direction="column" gap="12">
                <Text variant="label-default-s" onBackground="brand-weak">Film · advertising · games</Text>
                <Heading as="h2" variant="display-strong-xs">Original composition</Heading>
                <Flex><Button href={compositionContact} variant="secondary" size="s" prefixIcon="email" suffixIcon="arrowUpRight">Discuss your project</Button></Flex>
            </Flex>
            <Flex flex={7} direction="column" gap="16">
                <Text as="p" variant="body-default-m">Music written around your picture, world or brief. Let's discuss your project and find the right musical direction together.</Text>
                <Text as="p" variant="body-default-s" onBackground="neutral-weak">Share your ideas, references and timeline so we can talk through what you have in mind.</Text>
            </Flex>
        </Flex>
    );
}
