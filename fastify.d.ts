import "fastify";
import { nonSensitiveUser } from "./src/interfaces/auth";
import { z } from "zod";

declare const userJWT = nonSensitiveUser.extend({
    iat: z.number(),
    exp: z.number(),
});

declare module "fastify" {
    interface FastifyRequest {
        user: z.infer<typeof userJWT>; // You can replace 'any' with a more specific type if you know the shape of your JWT payload
    }
}
