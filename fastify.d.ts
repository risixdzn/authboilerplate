import "fastify";
import { nonSensitiveUser } from "./src/interfaces/auth";

interface UserJWT extends nonSensitiveUser {
    iat: number;
    exp: number;
}

declare module "fastify" {
    interface FastifyRequest {
        user: UserJWT; // You can replace 'any' with a more specific type if you know the shape of your JWT payload
    }
}
