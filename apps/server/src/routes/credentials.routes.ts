import { changePasswordAuthenticatedHandler } from "../controllers/credentials/changePasswordAuthenticatedHandler";
import { credentialDocs } from "../docs/credentials.docs";
import { changePasswordAuthenticatedSchema } from "@repo/schemas/credentials";
import { FastifyTypedInstance } from "../interfaces/fastify";
import { authenticate } from "../middlewares/authenticate";
import { userJWT } from "@/fastifyjwt";
import { z } from "zod";

export async function credentialsRoutes(fastify: FastifyTypedInstance) {
    fastify.put(
        "/password/change",
        { preHandler: authenticate, schema: credentialDocs.changePasswordAuthenticatedSchema },
        async (request, response) => {
            const userJwt = request.user as z.infer<typeof userJWT>;
            const body = changePasswordAuthenticatedSchema.parse(request.body);

            await changePasswordAuthenticatedHandler({ user: userJwt, body, response });
        }
    );
}
