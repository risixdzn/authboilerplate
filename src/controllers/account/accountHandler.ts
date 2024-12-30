import { FastifyReply } from "fastify";
import { z } from "zod";

import { editAccountSchema } from "../../interfaces/account";
import { queryUserById, updateUserById } from "../../services/account.services";

import type { UserJWT } from "../../../fastify";
import { apiResponse } from "@/src/helpers/response";

export async function getAccountHandler({
    userId,
    response,
}: {
    userId: string;
    response: FastifyReply;
}) {
    const user = await queryUserById(userId);

    if (!user) {
        return response.status(404).send(
            apiResponse({
                status: 404,
                error: "Not Found",
                code: "user_not_found",
                message: "User not found",
                data: null,
            })
        );
    }

    return response.status(200).send(
        apiResponse({
            status: 200,
            error: null,
            code: "get_account_success",
            message: "Account retrieved successfully.",
            data: {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                createdAt: user.createdAt,
            },
        })
    );
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

    if (!updatedUser) {
        return response.status(404).send(
            apiResponse({
                status: 404,
                error: "Not Found",
                code: "user_not_found",
                message: "User not found",
                data: null,
            })
        );
    }

    return response.status(200).send(
        apiResponse({
            status: 200,
            error: null,
            code: "update_account_success",
            message: "Account data updated successfully",
            data: updatedUser,
        })
    );
}
