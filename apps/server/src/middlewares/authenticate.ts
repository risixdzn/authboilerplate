import { FastifyReply, FastifyRequest } from "fastify";

export const authenticate = async (req: FastifyRequest, res: FastifyReply, next: () => void) => {
    try {
        await req.jwtVerify();
    } catch (error) {
        res.send(error);
    }
};
