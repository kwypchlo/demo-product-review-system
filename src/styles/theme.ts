import { type Theme, extendTheme } from "@chakra-ui/react";
import "@fontsource/sora";

export const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: {
    heading: `'Sora', sans-serif`,
    body: `'Sora', sans-serif`,
  },
}) as Theme;
