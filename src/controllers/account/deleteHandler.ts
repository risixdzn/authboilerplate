import { FastifyReply, FastifyRequest } from 'fastify';

import { emailDisplayName, sendAccountDeletionEmail } from '../../helpers/mailing';
import { queryUserById } from '../../services/account.services';
import { deleteUser } from '../../services/auth.services';
import {
    createOneTimeToken, getUserOneTimeTokens, queryOneTimeToken
} from '../../services/tokens.services';

export async function requestAccountDeletionHandler({
    userId,
    request,
    response,
}: {
    userId: string;
    request: FastifyRequest;
    response: FastifyReply;
}) {
    const oneTimeTokens = await getUserOneTimeTokens(userId);

    for (const token of oneTimeTokens) {
        if (token.tokenType === "account_deletion") {
            return response.status(409).send({
                statusCode: 409,
                error: "Bad Request",
                message:
                    "Deletion request already exists. Finish it or wait until expiration to request a new one.",
            });
        }
    }

    const user = await queryUserById(userId);

    if (!user) {
        return response.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "User not found",
        });
    }

    const oneTimeToken = await createOneTimeToken({
        userId: userId,
        email: user.email,
        tokenType: "account_deletion",
    });

    const verificationUrl = `${request.protocol}://${request.hostname}/account/confirm-deletion?token=${oneTimeToken.token}`;

    await sendAccountDeletionEmail({
        to: user.email,
        verificationUrl: verificationUrl,
        displayName: user.displayName ?? emailDisplayName(user.email),
    });

    return response.status(201).send({
        statusCode: 201,
        error: null,
        message: "Deletion request accepted",
    });
}

export async function confirmAccountDeletionHandler({
    token,
    response,
}: {
    token: string;
    response: FastifyReply;
}) {
    const oneTimeToken = await queryOneTimeToken(token);

    //Checks if the token exists, if it's not expired and if it's a deletion token
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
    if (oneTimeToken.tokenType !== "account_deletion") {
        return response.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Invalid token",
        });
    }

    //If all checks succeed, delete the user and the token will be automatically cascade deleted
    await deleteUser(oneTimeToken.user.id);

    return response.status(200).send({
        statusCode: 200,
        message: "User deleted sucessfully",
    });
}
