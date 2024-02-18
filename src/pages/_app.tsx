import { ChakraProvider } from "@chakra-ui/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "./layout";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import "@smastrom/react-rating/style.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Ecommerce Review App</title>
        <meta name="description" content="Task for Consesnsys" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ChakraProvider>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
