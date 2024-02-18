import { Container, Flex } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navigation from "@/components/Navigation";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Flex minH="full" w="full" flexDirection="column" gap={4}>
      <nav>
        <Navigation />
      </nav>

      <Flex minH="full" w="full" justifyContent="center">
        <Container maxW="7xl" w="full">
          {/* <header>
            <Breadcrumbs />
          </header> */}
          <main>{children}</main>
        </Container>
      </Flex>
    </Flex>
  );
}
