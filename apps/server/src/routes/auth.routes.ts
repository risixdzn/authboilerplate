import { FastifyRequest } from "fastify";

import { loginHandler } from "../controllers/auth/loginHandler";
import { registerHandler } from "../controllers/auth/registerHandler";
import { revalidateHandler } from "../controllers/auth/revalidateHandler";
import { verifyHandler } from "../controllers/auth/verifyHandler";
import { authDocs } from "../docs/auth.docs";
import { createUserSchema, loginUserSchema, verifyEmailSchema } from "@repo/schemas/auth";
import { FastifyTypedInstance } from "../interfaces/fastify";

export async function authRoutes(fastify: FastifyTypedInstance) {
    fastify.post(
        "/register",
        {
            schema: authDocs.registerSchema,
        },
        async (request, response) => {
            const body = await createUserSchema.parseAsync(request.body);

            await registerHandler({ body, request, response });
        }
    );

    fastify.post("/login", { schema: authDocs.loginSchema }, async (request, response) => {
        const body = await loginUserSchema.parseAsync(request.body);

        await loginHandler({ body, response });
    });

    fastify.get(
        "/verify",
        { schema: authDocs.verifySchema },
        async (request: FastifyRequest<{ Querystring: { token: string } }>, response) => {
            const query = await verifyEmailSchema.parseAsync(request.query);

            console.log(query.token);
            await verifyHandler({ token: query.token, response });
        }
    );

    fastify.post("/token", { schema: authDocs.revalidateSchema }, async (request, response) => {
        const refreshToken = request.cookies["refreshToken"];

        await revalidateHandler({ refreshToken, response });
    });
}
