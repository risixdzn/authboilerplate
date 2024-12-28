import { FastifyReply } from 'fastify';

import { setUserVerified } from '../../services/auth.services';
import { deleteOneTimeToken, queryOneTimeToken } from '../../services/tokens.services';

export async function verifyHandler({
    token,
    response,
}: {
    token: string;
    response: FastifyReply;
}) {
    const oneTimeToken = await queryOneTimeToken(token);

    //Checks if the token exists, if it's not expired and if it's a confirmation token
    if (!oneTimeToken) {
        return response.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Token not found",
        });
    }
    if (oneTimeToken.expiresAt < new Date()) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Token expired",
        });
    }
    if (oneTimeToken.tokenType !== "confirmation") {
        return response.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Invalid token",
        });
    }

    //If all checks succeed, update the user to be verified and delete the token
    await setUserVerified(oneTimeToken.user.id);
    await deleteOneTimeToken(oneTimeToken.token);

    return response.status(200).send({
        statusCode: 200,
        message: "Email verified successfully",
    });
}
