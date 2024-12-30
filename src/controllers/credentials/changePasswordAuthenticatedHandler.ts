import bcrypt from "bcryptjs";
import { FastifyReply } from "fastify";
import { z } from "zod";

import { UserJWT } from "../../../fastify";
import { hashPassword } from "../../helpers/hash-password";
import { changePasswordAuthenticatedSchema } from "../../interfaces/credentials";
import { queryUserById } from "../../services/account.services";
import { updateUserPassword } from "../../services/credentials.services";
import { apiResponse } from "@/src/helpers/response";

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

    const validPassword = await bcrypt.compare(body.old, userData.passwordHash);

    if (!validPassword) {
        return response.status(401).send(
            apiResponse({
                status: 401,
                error: "Unauthorized",
                code: "invalid_password",
                message: "Invalid password",
                data: null,
            })
        );
    }

    if (body.old === body.new) {
        return response.status(400).send(
            apiResponse({
                status: 400,
                error: "Bad Request",
                code: "equal_passwords",
                message: "Old password and new password are the same",
                data: null,
            })
        );
    }

    const hashedPassword = await hashPassword(body.new);

    await updateUserPassword(user.id, hashedPassword);

    return response.status(200).send(
        apiResponse({
            status: 200,
            error: null,
            code: "password_update_success",
            message: "Password updated successfully!",
            data: null,
        })
    );
}
