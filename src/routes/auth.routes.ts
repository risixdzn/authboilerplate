import { FastifyRequest } from 'fastify';
import { z } from 'zod';

import { loginHandler } from '../controllers/auth/loginHandler';
import { registerHandler } from '../controllers/auth/registerHandler';
import { revalidateHandler } from '../controllers/auth/revalidateHandler';
import { verifyHandler } from '../controllers/auth/verifyHandler';
import { authDocs } from '../docs/auth.docs';
import { createUserSchema, loginUserSchema, verifyEmailSchema } from '../interfaces/auth';
import { FastifyTypedInstance } from '../interfaces/fastify';
import { authenticate } from '../middlewares/authenticate';

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

    fastify.post("/login", async (request, response) => {
        const body = await loginUserSchema.parseAsync(request.body);

        await loginHandler({ body, response });
    });

    fastify.get(
        "/verify",
        async (request: FastifyRequest<{ Querystring: { token: string } }>, response) => {
            const query = await verifyEmailSchema.parseAsync(request.query);

            console.log(query.token);
            await verifyHandler({ token: query.token, response });
        }
    );

    fastify.post("/token", async (request, response) => {
        const refreshToken = request.cookies["refreshToken"];

        await revalidateHandler({ refreshToken, response });
    });

    fastify.get("/foo", { preHandler: authenticate }, (request, response) => {
        response.send(request.user);
    });
}
