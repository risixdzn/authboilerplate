import { FastifyReply, FastifyRequest } from "fastify";
import { queryUserById } from "../services/account.services";

export const authenticate = async (req: FastifyRequest, res: FastifyReply, next: () => void) => {
    try {
        //Verifies if the JWT is valid and not altered/expired
        await req.jwtVerify();

        //Verifies if the user on the JWT exists on db, preventing deleted accounts making changes with valid jwts.
        const { id } = req.user;

        const user = await queryUserById(id);

        if (!user) {
            return res.status(404).send({
                status: 404,
                error: "Not Found",
                code: "user_not_found",
                message: "User not found",
                data: null,
            });
        }

        next();
    } catch (error) {
        res.send(error);
    }
};
