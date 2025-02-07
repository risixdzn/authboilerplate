# Authentication Boilerplate Monorepo

A starting point for custom authentication without magic libraries. This monorepo provides:

- A **Fastify API** using JWT refresh tokens, accepting credentials via the `Authorization` header or a `token` cookie.
- A **Next.js 14 Frontend** with server/client authentication, middleware revalidation, and Axios interceptors.
- Shared [Zod](https://zod.dev) schemas via the `@repo/schemas` package.
- Turborepo for local package sharing and scripting.

## API

Built with [Fastify](https://www.fastify.io), the API handles auth using:

- **Type Validation:** [Zod](https://zod.dev)
- **ORM:** [Drizzle](https://orm.drizzle.team) with [PostgreSQL](https://www.postgresql.org)
- **Mailing:** [Resend](https://resend.com) & [React Email](https://react.email)
- **Encryption:** [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Caching:** [Redis](https://redis.io)

Documentation is available on the following API routes:

- [Scalar UI](https://scalar-ui.com) for a modern interface at `/docs`
- [Swagger](https://swagger.io) for the classic one at `/reference`

## Frontend

The frontend leverages [Next.js 14](https://nextjs.org) for seamless server/client authentication, with revalidation in middleware and auth interceptors powered by [Axios](https://axios-http.com).

## Authentication Flow

Users authenticate via JWT refresh tokens. Supported actions include:

- Password reset (authenticated and "forgot password")
- Email confirmation before signup
- Account deletion
- Display name updates

![Authentication Flow](apps/server/src/public/flux.svg)

## Development Setup

Begin by configuring your environment. Rename and update the provided `.env.example` files:

- **Global secrets:** [.env.example](.env.example) for DB, Redis, etc.
- **API secrets:** [apps/server/.env.example](apps/server/.env.example) for JWT signing keys and API keys.
- **Next.js variables:** [apps/web/.env.example](apps/web/.env.example).

Next, spin up your Postgres and Redis databases with Docker Compose:

```sh
docker compose up
```

Install dependencies and run database migrations:

```sh
npm install
npm run migrate
```

Finally, start the development server:

```sh
npm run dev
```
