import {
  Avatar,
  Button,
  Container,
  Flex,
  Hide,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const session = useSession();

  return (
    <Flex bg={useColorModeValue("gray.100", "gray.900")} justifyContent="center">
      <Container as={Flex} h={16} alignItems={"center"} justifyContent={"space-between"} maxW="7xl" w="full" gap={4}>
        <Link href="/">
          <Image src="/favicon.svg" alt="Product Review System Logo" width={36} height={36} />
        </Link>

        <Stack direction={"row"} spacing={4} alignItems={"center"}>
          <IconButton
            onClick={toggleColorMode}
            variant="outline"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            aria-label={colorMode === "light" ? "Toggle dark mode" : "Toggle light mode"}
          />

          {session.status === "authenticated" && (
            <>
              <Button type="button" onClick={() => signOut()} variant="outline">
                Sign out <Hide below="md">{session.data.user.email}</Hide>
              </Button>

              <Avatar src={session.data.user.image!} name={session.data.user.name ?? session.data.user.email ?? "-"} />
            </>
          )}

          {session.status !== "authenticated" && (
            <Button type="button" onClick={() => signIn("github")} variant="outline" leftIcon={<SiGithub />}>
              Sign in with GitHub
            </Button>
          )}
        </Stack>
      </Container>
    </Flex>
  );
}
