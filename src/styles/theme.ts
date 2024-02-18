import { type Theme, extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/quicksand";

export const theme = extendTheme({
  initialColorMode: "system",
  useSystemColorMode: true,
  fonts: {
    heading: `'Quicksand Variable', sans-serif`,
    body: `'Quicksand Variable', sans-serif`,
  },
}) as Theme;
