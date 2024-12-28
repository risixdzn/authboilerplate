import chalk from "chalk";
import { fastify } from "fastify";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";

import { fastifyCookie } from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import scalarUi from "@scalar/fastify-api-reference";

import { env } from "./env";
import { accountRoutes } from "./routes/account.routes";
import { authRoutes } from "./routes/auth.routes";
import { credentialsRoutes } from "./routes/credentials.routes";

//Set Zod as the default request/response data serializer
const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

//Set Swagger as the openapi docs generator
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Auth Boilerplate API",
            version: "1.0.0",
            summary: "test",
            description: "test2",
        },
        tags: [
            {
                name: "Auth",
                description: "Routes used for authentication (register, login and confirmations)",
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
});

//Set SwaggerUi as the frontend for the docs
server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});

server.register(scalarUi, {
    routePrefix: "/reference",
    configuration: {
        title: "Our API Reference",
        spec: {
            url: "/docs/json",
        },
        metaData: {
            title: "Docs - Auth Boilerplate API",
        },
        theme: "none",
    },
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

server.register(authRoutes, {
    prefix: "/auth",
});

server.register(accountRoutes, {
    prefix: "/account",
});

server.register(credentialsRoutes, {
    prefix: "/credentials",
});

server.register(fastifyCors, { origin: "*" });

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
        console.log(chalk.greenBright("Server running!"));
    });

export default server;
