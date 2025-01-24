import chalk from "chalk";
import { fastify } from "fastify";
import {
    createJsonSchemaTransformObject,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";

import { fastifyCookie } from "@fastify/cookie";
import { fastifyStatic } from "@fastify/static";
import fastifyCors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import scalarUi from "@scalar/fastify-api-reference";

import { env } from "./env";
import { accountRoutes } from "./routes/account.routes";
import { authRoutes } from "./routes/auth.routes";
import { credentialsRoutes } from "./routes/credentials.routes";
import { apiDescription } from "./docs/main";
import { join } from "path";
import { cwd } from "process";
import { nonSensitiveUser } from "@repo/schemas/auth";

const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                ignore: "pid,hostname",
                translateTime: "HH:MM:ss Z",
            },
        },
    },
    production: true,
    test: false,
};

//Set Zod as the default request/response data serializer
const server = fastify({ logger: envToLogger["development"] }).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

//Set Swagger as the openapi docs generator
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Auth Boilerplate API",
            version: "1.0.0",
            summary: "Auth Boilerplate API",
            description: apiDescription,
        },
        tags: [
            {
                name: "Auth",
                description: "Routes used for authentication (register, login and confirmations)",
            },
            {
                name: "Account",
                description: "Edit account data or delete it through these routes.",
            },
            {
                name: "Credentials",
                description: "Change account credentials (password) in different ways.",
            },
        ],
        security: [],
        components: {
            securitySchemes: {
                JWT: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "Bearer",
                },
            },
        },
    },
    transform: jsonSchemaTransform,
    transformObject: createJsonSchemaTransformObject({
        schemas: {
            User: nonSensitiveUser,
        },
    }),
});

//Set Scalar as the frontend for the docs
server.register(scalarUi, {
    routePrefix: "/docs",
    configuration: {
        // title: "Our API Reference",
        spec: {
            url: "/reference/json",
        },
        metaData: {
            title: "Docs - Auth Boilerplate API",
        },
        favicon: "/public/favicon.svg",
        theme: "none",
    },
});

//Also register Swagger for the classic API reference
server.register(fastifySwaggerUi, {
    routePrefix: "/reference",
});

//Register routes and plugins.
server.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: "token",
        signed: false,
    },
});

server.register(fastifyCookie, {
    secret: env.COOKIE_ENCRYPTION_SECRET,
});

server.register(fastifyStatic, {
    root: join(cwd(), "src", "public"),
    prefix: "/public/",
});

server.register(authRoutes, {
    prefix: "/auth",
});

server.register(accountRoutes, {
    prefix: "/account",
});

server.register(credentialsRoutes, {
    prefix: "/credentials",
});

server.get("/", (_, reply) => {
    reply.status(200).send("OK");
});

server.register(fastifyCors, {
    origin: [env.FRONTEND_URL, `http://localhost:${env.NODE_PORT}`],
    credentials: true,
});

//Map the zod errors to standart response
server.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        reply.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            issues: error.issues,
        });
        return;
    }

    reply.send(error);
});

//Run server.
server
    .listen({
        port: Number(env.NODE_PORT),
        host: "0.0.0.0",
    })
    .then(() => {
        console.log(chalk.greenBright(`✔ Server running at http://localhost:${env.NODE_PORT}`));
    });

export default server;
