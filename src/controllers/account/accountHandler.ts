import { FastifyReply } from 'fastify';
import { z } from 'zod';

import { editAccountSchema } from '../../interfaces/account';
import { queryUserById, updateUserById } from '../../services/account.services';

import type { UserJWT } from "../../../fastify";
export async function getAccountHandler({
    userId,
    response,
}: {
    userId: string;
    response: FastifyReply;
}) {
    const user = await queryUserById(userId);

    if (!user) {
        return response.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "User not found",
        });
    }

    return response.status(200).send({
        statusCode: 200,
        error: null,
        data: {
            id: user.id,
            display_name: user.displayName,
            email: user.email,
            createdAt: user.createdAt,
        },
    });
}

export async function editAccountHandler({
    body,
    user,
    response,
}: {
    body: z.infer<typeof editAccountSchema>;
    user: UserJWT;
    response: FastifyReply;
}) {
    const updatedUser = await updateUserById(body, user.id);

    return response.status(200).send({
        statusCode: 200,
        error: null,
        data: updatedUser,
    });
}
