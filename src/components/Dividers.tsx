import { Box, Button, ButtonProps, Center, Divider, Text, type TextProps } from "@chakra-ui/react";
import { type PropsWithChildren, forwardRef } from "react";

export function DividerWithContent({ children }: PropsWithChildren) {
  return (
    <Center gap={2}>
      <Divider />
      <Box flexShrink={0}>{children}</Box>
      <Divider />
    </Center>
  );
}

export function DividerWithText({ text, ...props }: { text: string } & TextProps) {
  return (
    <DividerWithContent>
      <Text fontSize="sm" fontWeight="thin" {...props}>
        {text}
      </Text>
    </DividerWithContent>
  );
}
