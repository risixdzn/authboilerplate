import { FastifySchema } from "fastify";
import { changePasswordAuthenticatedSchema as changePasswordAuthenticatedBody } from "../interfaces/credentials";
import { zodResponseSchema } from "./types";

const changePasswordAuthenticatedSchema: FastifySchema = {
    tags: ["Credentials"],
    description: `User needs to provide the current password for the account and the new one to be set.`,
    body: changePasswordAuthenticatedBody,
    summary: "Change password authenticated",
    response: {
        404: zodResponseSchema({
            status: 404,
            error: "Not Found",
            code: "user_not_found",
            message: "User not found",
            data: null,
        }).describe("User not found."),
        401: zodResponseSchema({
            status: 401,
            error: "Unauthorized",
            code: "invalid_password",
            message: "Invalid password",
            data: null,
        }).describe("Invalid old password."),
        400: zodResponseSchema({
            status: 400,
            error: "Bad Request",
            code: "equal_passwords",
            message: "Old password and new password are the same",
            data: null,
        }).describe("Old and new password are the same."),
        200: zodResponseSchema({
            status: 200,
            error: null,
            code: "password_update_success",
            message: "Password updated successfully!",
            data: null,
        }).describe("Account password successfully updated."),
    },
    security: [{ JWT: [] }],
};

export const credentialDocs = { changePasswordAuthenticatedSchema };
