import { FastifyReply } from 'fastify';

import { signJWT } from '../../helpers/jwt';
import { generateRefreshToken } from '../../helpers/tokens';
import { queryTokenData } from '../../services/auth.services';
import { setRefreshToken } from '../../services/tokens.services';

/*
This function is used to revalidate the JWT token

When the JWT expires, the front-end needs to reach this endpoint with the refresh token to get a new JWT
This process makes sure that the JWT was not stolen, as the refresh token is stored in a secure-only cookie,
that can only be obtained when logging in with email and password
*/
export async function revalidateHandler({
    refreshToken,
    response,
}: {
    refreshToken: string | undefined;
    response: FastifyReply;
}) {
    if (!refreshToken) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "No refresh token provided",
        });
    }

    const tokenData = await queryTokenData(refreshToken);

    if (!tokenData) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Invalid refresh token",
        });
    }

    if (tokenData.expiresAt < new Date()) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Refresh token expired",
        });
    }

    const user = tokenData.user;

    if (!user) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "User not found",
        });
    }

    const jwt = signJWT({
        payload: {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            createdAt: user.createdAt,
        },
    });

    const newRefreshToken = generateRefreshToken();
    await setRefreshToken(response, newRefreshToken, user.id);
    return response.status(200).send({ token: jwt });
}
