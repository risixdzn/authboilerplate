import { FastifyRequest } from 'fastify';

import { editAccountHandler, getAccountHandler } from '../controllers/account/accountHandler';
import {
    confirmAccountDeletionHandler, requestAccountDeletionHandler
} from '../controllers/account/deleteHandler';
import { confirmAccountDeletionSchema, editAccountSchema } from '../interfaces/account';
import { FastifyTypedInstance } from '../interfaces/fastify';
import { authenticate } from '../middlewares/authenticate';

export async function accountRoutes(fastify: FastifyTypedInstance) {
    fastify.get("/", { preHandler: authenticate }, async (request, response) => {
        const userJwt = request.user;

        await getAccountHandler({ userId: userJwt.id, response });
    });

    fastify.patch("/", { preHandler: authenticate }, async (request, response) => {
        const userJwt = request.user;
        const body = editAccountSchema.parse(request.body);

        await editAccountHandler({ body: body, user: userJwt, response });
    });

    fastify.post("/request-deletion", { preHandler: authenticate }, async (request, response) => {
        const userJwt = request.user;

        await requestAccountDeletionHandler({ userId: userJwt.id, request, response });
    });

    fastify.get(
        "/confirm-deletion",
        async (request: FastifyRequest<{ Querystring: { token: string } }>, response) => {
            const query = await confirmAccountDeletionSchema.parseAsync(request.query);

            await confirmAccountDeletionHandler({ token: query.token, response });
        }
    );
}
