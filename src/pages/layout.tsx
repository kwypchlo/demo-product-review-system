import { Container } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navigation from "@/components/Navigation";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full">
      <Navigation />

      <Container className="my-10" maxW="7xl">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs />
          </div>
        </header>
        <main>
          <div className="mx-auto mt-10 max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </main>
      </Container>
    </div>
  );
}
