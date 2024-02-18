"use client";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Flex, IconButton, Stack, useColorMode, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const session = useSession();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Image src="/favicon.svg" alt="Product Review System Logo" width={36} height={36} />

        <Stack direction={"row"} spacing={4} alignItems={"center"}>
          <IconButton
            onClick={toggleColorMode}
            variant="outline"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            aria-label={colorMode === "light" ? "Toggle dark mode" : "Toggle light mode"}
          />

          {session.status === "authenticated" && (
            <>
              <Button type="button" onClick={() => signOut()} variant="outline">
                Sign out {session.data.user.email}
              </Button>

              <Avatar src={session.data.user.image!} name={session.data.user.name ?? session.data.user.email ?? "-"} />
            </>
          )}

          {session.status !== "authenticated" && (
            <Button type="button" onClick={() => signIn()} variant="outline">
              Sign in
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
