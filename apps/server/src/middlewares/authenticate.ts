import { FastifyReply, FastifyRequest } from "fastify";
import { queryUserById } from "../services/account.services";
import { apiResponse, httpStatusCodes } from "../helpers/response";

interface FastifyErrorLike extends Error {
    code: string;
    name: string;
    statusCode?: number;
}

function isFastifyError(err: unknown): err is FastifyErrorLike {
    if (typeof err !== "object" || err === null) return false;
    const errorObj = err as Record<string, unknown>;
    return typeof errorObj.code === "string" && typeof errorObj.name === "string";
}

export const authenticate = async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
    try {
        // Validate JWT; this populates req.user if successful
        await req.jwtVerify();

        const { id } = req.user;

        // Verify that the user exists in the database
        const user = await queryUserById(id);
        if (!user) {
            return res.status(404).send(
                apiResponse({
                    status: 404,
                    error: "Not Found",
                    code: "user_not_found",
                    message: "User not found",
                    data: null,
                })
            );
        }
    } catch (error) {
        if (isFastifyError(error)) {
            return res.status(error.statusCode!).send(
                apiResponse({
                    status: error.statusCode!,
                    error: httpStatusCodes[error.statusCode!],
                    code: error.code,
                    message: error.message,
                    data: null,
                })
            );
        }
        return res.send(error);
    }
};
