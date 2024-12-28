import bcrypt from 'bcryptjs';
import { FastifyReply } from 'fastify';
import { z } from 'zod';

import { UserJWT } from '../../../fastify';
import { hashPassword } from '../../helpers/hash-password';
import { changePasswordAuthenticatedSchema } from '../../interfaces/credentials';
import { queryUserById } from '../../services/account.services';
import { updateUserPassword } from '../../services/credentials.services';

export async function changePasswordAuthenticatedHandler({
    user,
    body,
    response,
}: {
    user: UserJWT;
    body: z.infer<typeof changePasswordAuthenticatedSchema>;
    response: FastifyReply;
}) {
    const userData = await queryUserById(user.id);

    if (!userData) {
        return response.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "User not found",
        });
    }

    const validPassword = bcrypt.compare(body.old, userData.passwordHash);

    if (!validPassword) {
        return response.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Invalid password",
        });
    }

    if (body.old === body.new) {
        return response.status(400).send({
            statusCode: 400,
            error: "Bad Request",
            message: "Old password and new password are the same",
        });
    }

    const hashedPassword = await hashPassword(body.new);

    await updateUserPassword(user.id, hashedPassword);

    return response.status(200).send({
        statusCode: 200,
        error: null,
        data: null,
    });
}
