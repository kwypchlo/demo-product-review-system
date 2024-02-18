import { ChakraProvider } from "@chakra-ui/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";
import { theme } from "@/styles/theme";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import "@smastrom/react-rating/style.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
