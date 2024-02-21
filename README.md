# Product Review App

Demo: https://product-review-system.vercel.app/

## Development environment setup

### Required before installation

- Install Docker - https://docs.docker.com/get-docker/
- Install Node.js 18 - https://nodejs.org/en/learn/getting-started/how-to-install-nodejs

### First time installation steps

1. `npm i` - install dependencies
1. `cp .env-e .env` - copy example .env file
1. Create GitHub OAuth App for authentication
   1. Go to https://github.com/settings/applications/new
   1. Fill required necessary fields
      - "Application name" - any name
      - "Homepage URL" - http://localhost:3000
      - "Authorization callback URL" - http://localhost:3000/api/auth/callback/github
   1. Confirm with "Register application"
   1. Click "Generate a new client secret" and fill env variables in .env file
      - "GITHUB_ID" - copy "Client ID"
      - "GITHUB_SECRET" - copy newly generated client secret
   1. Confirm changes with "Update application"
1. Set "NEXTAUTH_SECRET" in .env file
   - generate random secret with `openssl rand -base64 32`
1. Run `./start-database.sh` (Docker has to be running)
   - follow instructions - select `y` to generate a random password
   - in case of getting "bad flag in substitute command" error, delete the database in docker and try again or set your password manually
1. Run `npm run db:push` to bootstrap the database schema

### Seeding database

Run `npm run db:seed` any time to reset database completely and bootstrap it with seed data.

### Starting dev environment

Run `npm run dev` to start application at http://localhost:3000

### Running end to end tests

Run `npm test` to run a end to end test suite - database has to be running.

### Development environment authentication

On developement environment, there is an additional authentication option "Sign in as Dev" that creates a test user and authenticates without a need to connect to GitHub or remember the password. This option is not available on production environment.

## Production deployment

Currently, demo app is deployed to Vercel and as the application runs on Next.js, it is easy and straightforward to deploy on their platform.

### Vercel project setup

1. Sign up on [Vercel](https://vercel.com/)
1. Connect your repo (or fork) on Vercel dashboard
1. On "Storage" tab in Vercel dashboard, create a Postgres database and connect it to your project
   - when configuring database, be sure to rename env variables prefix to DATABASE\_ so the env variables are picked up automatically

### GitHub OAuth for production deploy

Follow the steps to set up a new OAuth application on your GitHub account from "First time installation steps". Every enviroment requires a separate OAuth application. When configuring the OAuth application, use Vercel's production url.

- "Homepage URL" - https://your-project-name.vercel.app
- "Authorization callback URL" - http://your-project-name.vercel.app/api/auth/callback/github

After the OAuth application is created, go to your project settings on Vercel dashboard and select "Environment Variables" from the left side panel. Add new variables "GITHUB_ID" and "GITHUB_SECRET" with the values from your production OAuth GitHub application.

### Seeding the production database

After first deploy, the production database is empty. You might want to consider filling it with data or using the seed script.

To use the seed script, replace DATABASE_URL value in your .env file with a remote DATABASE_URL to your production database. That variable can be obtained from database settings in "Storage" tab on Vercel dashboard. Once replaced, run `npm run db:seed` to generate seed data and push it to production. Remember that seed script purges the database every time it is ran.

### Deployment

Any push to main branch should trigger a new deploy, Vercel provides a stable url for a production deployment that you can share with your friends.

## Technical choices and engineering considerations

### Technologies used

Initially this project has been bootstrapped with [Create T3 App](https://create.t3.gg/). It provides an initially set up dev environment with choice of libraries on top of [Next.js](https://nextjs.org) framework.

This project has been bootstrapped with:

- [Next.js](https://nextjs.org) - framework for building full stack applications with NodeJS and React
- [NextAuth.js](https://next-auth.js.org) - authentication for Next.js with a large set of preconfigured providers
- [Drizzle ORM](https://orm.drizzle.team) - headless TypeScript ORM for database connection management
- [tRPC](https://trpc.io) - TypeScript drop in replacement for Next.js API server
- [React Query](https://tanstack.com/query/latest/) - asynchronous state management that integrates seamlessly with tRPC

Additionally, personal choices:

- [Chakra UI](https://chakra-ui.com/) - simple, modular and accessible component library that gives you the building blocks you need to build your React applications.
- [Playwright](https://playwright.dev/) - reliable end-to-end testing for modern web apps
- [Faker](https://fakerjs.dev/) - library for generating fake (but realistic) data for testing and development

Database choice:

- [PostgreSQL](https://www.postgresql.org/) - object-relational database system

Deployment platform:

- [Vercel](https://vercel.com/) - Continous Deployment cloud environment with database services and edge caching

### Technology choices discussion

When selecting technologies for a project, you have to consider what is a best choice for your use case and what will get you production ready in shortest amount of time. When selecting technologies for this particular project, I also biased towards technologies that will be fun to use or the ones that I wanted to try for some time but did not have an opportunity to do so.

#### Authentication: NextAuth vs Clerk

Authentication is a vast topic and seeing many data breaches even in companies that spend milions of dollars on security shows that it's also very complicated even if it boils down to a sign up and sign in form in the application. When selecting a technology for this application I reviewed 3 choices:

- self hosted credentials authentication (username + password)
- self hosted OAuth integration with choice of providers
- cloud hosted OAuth service [Clerk](https://clerk.com/)

To minimise potential security concerns when building an application from scratch in couple of days, I have rejected the self hosted credentials authentication. Aside of setting up the authentication, I would have to set up mailing service to confirm accounts, provide password recovery and make sure passwords are securely hashed in database.

Second consideration was self hosted OAuth integration. Aside from initial setup on Github, it worked like a charm and allowed me to leverage full security model provided by Github. Aditionally it allows almost every developer to sign in seamlessly account setup since most of us already have at least one Github account.

Unfortunately, with self hosted OAuth providers, at least in my implementation, you can only choose one provider for your account. This means that even if I would provide an option to use Google, Discord, Slack and Github OAuth and all of your accounts would be assigned to the same email address, you will be able to log in only with the provider that you created the account initally with. This feature is called account merging and it was not available out of the box.

Third option was using cloud hosted OAuth service like [Clerk](https://clerk.com/). It basically outsources whole authentication and user management to an external application very much like what Stripe does with payments. I was very tempted to use it since it also provides account merging (you are able to sign in with any of the providers if your email matches) but I decided to use a self hosted OAuth providers solution to simplify the initial app setup and keep data in one place.

At the end of development I also added additional developement authentication based on credentials, available only when app is run in developement mode. It allows a developer to log in as a test user without worrying about Github but also allowed me to simplify End To End testing as it was easier to use local authentication when running tests.

#### Database ORM: Drizzle vs Prisma

When bootrapping the project I have originally selected [Prisma](https://www.prisma.io/) as my ORM choice since it was a dominant library and I have used neither so I wanted to try both. My first impression was that creating a schema in Prisma feels very manual and outdated - it is a specific syntax you have to learn. I have replaced it with [Drizzle](https://orm.drizzle.team/) and it felt much more elegant from the get go. Drizzle schema is written in typescript and can be imported anywhere in the code without a manual translation step. Aditionally it allows a seamless integration with other parts of the app that rely on database connection like tRPC APIs. I have been immensely surprised how easy and fun it was to write queries with Drizzle. Aditionally since it's an ORM, it handles security internally and that's one less thing to worry about.

#### API Layer: tRPC vs native Next.JS API

Next.JS provides a simple file based API system that is really easy to use when setting up a simple application with one or two endpoints. Once you get to more endpoints and you add authentication and other middlewares, it's starting to get cluttered very quickly. I have worked with tRPC for a bit in one of my projects and I've never been happier. It integrates seamlessly with Next.JS, adds API security through input validation with [Zod](https://zod.dev/), all of the endpoints are fully typed through inferrence without adding typescript types manually and it integrates with React Query, batches requests, handles errors and error messages. Scafolding an application with tRPC is also really easy and authentication middleware works out of the box. It provides great documentation and improves developement velocity.

#### Routing: Next.JS App router vs Pages router

I have tried using App router 3 times in the past and always there was an issue with it slowing me down. For this task I chose to go with Pages router to finish quickly in an environment that I knew will not work against me.

#### Async Operations: React Query vs SWR

[React Query](https://tanstack.com/query/latest/) was an easy choice as a supplement to tRPC stack. Before using tRPC I have used [SWR](https://swr.vercel.app/) in all of my projects and it's a great tool, really similar to React Query but the benefit of out of the box integration with tRPC make React Query an obvious choice. It's worth noting that both these tools have built in query caching, infinite loading support, invalidation, react hooks integration and anything a developer needs to interact between frontend and backend.

#### UI Components: Chakra vs Tailwind

While I love Tailwind for it's flexibility, for this specific project I have selected [Chakra UI](https://chakra-ui.com/) as a component library. I have worked with both in the past, I even have [Talwind UI](https://tailwindui.com/) package bought and wanted to try [shadcn](https://ui.shadcn.com/) which is based on Tailwind and it should allow me to quickly come up with a good looking user interface. Unfortunately, with the flexibility of Tailwind you get a lot of boilerplate and configuration and components creation, even for a small app like this one. I have actually bootstrapped this project with Tailwind but removed it afterwards and replaced it with Chakra simply because it was faster to come up with a good looking interface without changing almost anything in the theme except for a font. Creating a responsive design was really easy too, adding couple of fully typed props instead of working with classes was faster and more intuitive.

#### End To End Testing: Playwright vs Cypress

For many years [Cypress](https://www.cypress.io/) was an obvious choice but I never worked with [Playwright](https://playwright.dev/) and I really wanted to try it. It was easy to set up and the studio is really intuitive. Unfortunately I spend a lot of time learning basics and running tests and failing them before I came up with couple of reliable tests. That said, I would use Playwright again since it feels a bit snappier than Cypress.

#### Database: PostgreSQL vs MongoDB

For this particular application there would be no performance difference between using PostgreSQL and MongoDB or any other database for that matter. I chose relational database since I wanted to try Drizzle. Initially I wanted to try [Planetscale](https://planetscale.com/) which runs some sort of MySQL flavor in cloud instead of running local PostgreSQL but developement with local database was faster and it was easier to manage. For the purpose of this application I have only used simple indexes and basic data types so any database engine would be sufficient. Interestingly, Drizzle allows building a schema agnostic to the database of choice so it would be easy to swith to other db engine if necessary with minimal schema adjustments.

#### Deployment: Vercel vs GitHub Actions

While Github actions are great CI environment, they do not provide you with a CD out of the box. For this specific project, with just me as a sole developer working on it, I needed an easy deployment platform more than continous integration. For static code analysis I have set up [husky](https://typicode.github.io/husky/) with [lint-staged](https://www.npmjs.com/package/lint-staged) running eslint and typescript check on every commit and parsing codebase with [prettier](https://prettier.io/) both on commit and in vscode formatter. For the deployment, Vercel integrated with my repository, provided a free tier of build time, static url for production use, free postgres db integration and the only drawback of it is that the free tier runs out quick and using their service can get expensive for a hobby project like this one if you don't pay attention to what's happening in your code.
