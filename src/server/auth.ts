import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type GetServerSidePropsContext } from "next";
import { type DefaultSession, type NextAuthOptions, getServerSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/server/db";
import { createTable, users } from "@/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const devProviders = [];

// credential provider only available for development
if (process.env.NODE_ENV === "development") {
  devProviders.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize() {
        // ensure the user exists, it's a hardcoded user for development in seed script
        const [user] = await db.select().from(users).where(eq(users.id, "test")).limit(1);

        return user ?? null;
      },
    }),
  );
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user, token }) => {
      const id = user?.id ?? token?.sub ?? null;

      if (id) {
        return { ...session, user: { ...session.user, id } };
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    ...devProviders,
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    // jwt vs database: https://next-auth.js.org/configuration/options#jwt
    strategy: process.env.NODE_ENV === "development" ? "jwt" : "database",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
