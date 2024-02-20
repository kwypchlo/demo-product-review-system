import { Container, Flex } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { Navigation } from "@/components/Navigation";

export function Layout({ children }: PropsWithChildren) {
  return (
    <Flex direction="column" flex="1">
      <Navigation />
      <Flex as="main" role="main" direction="column" flex="1" py={4} position="relative">
        <Container flex="1" maxW="7xl" w="full">
          {children}
        </Container>
      </Flex>
    </Flex>
  );
}
