import bcrypt from 'bcryptjs';
import { FastifyReply } from 'fastify';
import { z } from 'zod';

import { signJWT } from '../../helpers/jwt';
import { generateRefreshToken } from '../../helpers/tokens';
import { loginUserSchema } from '../../interfaces/auth';
import { queryUserByEmail } from '../../services/auth.services';
import { setRefreshToken } from '../../services/tokens.services';

export async function loginHandler({
    body,
    response,
}: {
    body: z.infer<typeof loginUserSchema>;
    response: FastifyReply;
}) {
    //First check if the user exists
    const user = await queryUserByEmail(body.email);

    if (!user) {
        return response.status(404).send({
            statusCode: 404,
            error: "Bad Request",
            message: "User not found",
        });
    }

    if (user.verified === false) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Email not verified",
        });
    }

    //Then compares the sent password with the hashed password on the database
    const validPassword = await bcrypt.compare(body.password, user.passwordHash);

    if (!validPassword) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Invalid password",
        });
    }

    //If the password is valid, sign the JWT and set the nw refresh token
    const token = signJWT({
        payload: {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            createdAt: user.createdAt,
        },
    });

    const refreshToken = generateRefreshToken();
    await setRefreshToken(response, refreshToken, user.id);

    return response.status(200).send({
        statusCode: 200,
        message: "Logged in successfully",
        token: token,
    });
}
