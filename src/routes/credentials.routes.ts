import {
    changePasswordAuthenticatedHandler
} from '../controllers/credentials/changePasswordAuthenticatedHandler';
import { changePasswordAuthenticatedSchema } from '../interfaces/credentials';
import { FastifyTypedInstance } from '../interfaces/fastify';
import { authenticate } from '../middlewares/authenticate';

export async function credentialsRoutes(fastify: FastifyTypedInstance) {
    fastify.put("/password/change", { preHandler: authenticate }, async (request, response) => {
        const userJwt = request.user;
        const body = changePasswordAuthenticatedSchema.parse(request.body);

        await changePasswordAuthenticatedHandler({ user: userJwt, body, response });
    });
}
