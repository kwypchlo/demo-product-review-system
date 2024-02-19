import { Box, Center, Divider, Text } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export default function DividerWithContent({ children }: PropsWithChildren) {
  return (
    <Center gap={2}>
      <Divider />
      <Box flexShrink={0}>{children}</Box>
      <Divider />
    </Center>
  );
}
