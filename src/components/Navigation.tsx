import {
  Avatar,
  Box,
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
import { FiCode, FiMoon, FiSun } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const session = useSession();

  return (
    <Flex bg={useColorModeValue("gray.100", "gray.900")} justifyContent="center">
      <Container as={Flex} h={16} alignItems={"center"} justifyContent={"space-between"} maxW="7xl" w="full" gap={4}>
        <Box flexShrink={0}>
          <Link href="/">
            <Image src="/favicon.svg" alt="Product Review System Logo" width={36} height={36} />
          </Link>
        </Box>

        <Stack direction={"row"} spacing={4} alignItems={"center"}>
          <IconButton
            onClick={toggleColorMode}
            variant="outline"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            aria-label={colorMode === "light" ? "Toggle dark mode" : "Toggle light mode"}
          />

          {session.status === "authenticated" && (
            <>
              <Button type="button" onClick={() => signOut()} data-testid="sign-out">
                Sign out <Hide below="md">{session.data.user.email}</Hide>
              </Button>

              <Avatar src={session.data.user.image!} name={session.data.user.name ?? session.data.user.email ?? "-"} />
            </>
          )}

          {process.env.NODE_ENV === "development" && session.status !== "authenticated" && (
            <Button onClick={() => signIn("credentials")} leftIcon={<FiCode />} data-testid="sign-in-dev">
              <Hide below="md">Sign in with</Hide> Dev
            </Button>
          )}

          {session.status !== "authenticated" && (
            <Button type="button" onClick={() => signIn("github")} leftIcon={<SiGithub />} data-testid="sign-in-github">
              Sign in <Hide below="md">with GitHub</Hide>
            </Button>
          )}
        </Stack>
      </Container>
    </Flex>
  );
}
