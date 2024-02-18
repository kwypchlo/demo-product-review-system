import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";
import { theme } from "@/styles/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Ecommerce Review App</title>
        <meta name="description" content="Browse and review your favorite products" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
