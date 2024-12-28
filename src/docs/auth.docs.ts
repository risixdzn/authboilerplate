import { FastifySchema } from 'fastify';
import { z } from 'zod';

import { createUserSchema, loginUserSchema } from '../interfaces/auth';
import { zodResponseSchema } from './types';

const registerSchema: FastifySchema = {
    tags: ["Auth"],
    description: `
**Register a user onto the system and sends a confirmation email.**
    
When registered, the user is still **not** verified. 
For this, we generate a \`oneTimeToken\`, save it on the database, and send it to the user email as a confirmation link, that will further hit the \`/auth/verify\` endpoint.`,
    summary: "Create account",
    body: createUserSchema,
    response: {
        409: zodResponseSchema({
            status: 409,
            error: "Bad Request",
            code: "email_already_used",
            message: "Email is already registered.",
            data: null,
        }).describe("Account with this email is already registered."),
        500: zodResponseSchema({
            status: 500,
            error: "Internal Server Error",
            code: "verification_email_failed",
            message: "Failed to send verification email",
            data: null,
        }).describe("Verification email couldn't be delivered"),
        201: zodResponseSchema({
            status: 201,
            error: null,
            code: "user_registered_success",
            message: "User registered successfully",
            data: null,
        }).describe("Account created successfully."),
    },
};

const loginSchema: FastifySchema = {
    tags: ["Auth"],
    description:
        "Login into the system. Returns a `JWT` and sets a `refreshToken` cookie on the client.",
    summary: "Login",
    body: loginUserSchema,
    response: {
        404: zodResponseSchema({
            status: 400,
            error: "Bad Request",
            code: "user_not_found",
            message: "User not found",
            data: null,
        }).describe("User with provided email was not found."),
        403: zodResponseSchema({
            status: 403,
            error: "Forbidden",
            code: "email_not_verified",
            message: "Email not verified",
            data: null,
        }).describe("User hasn't verified the email."),
        401: zodResponseSchema({
            status: 401,
            error: "Unauthorized",
            code: "invalid_password",
            message: "Invalid password",
            data: null,
        }).describe("Wrong password."),
        200: zodResponseSchema({
            status: 200,
            error: null,
            code: "login_success",
            message: "Logged in successfully",
            data: z.object({
                token: z.string(),
            }),
        }).describe("Logged in successfully"),
    },
};

const revalidateSchema: FastifySchema = {
    tags: ["Auth"],
    description: `**Sends a new \`JWT\` for the provided user.**
        
Needs a \`refreshToken\` cookie, received from \`/auth/login\`, to succeed.

This should be used when the short lived \`JWT\` expires.        
        `,
    summary: "Revalidate JWT",
    response: {
        400: zodResponseSchema({
            status: 400,
            error: "Bad Request",
            code: "no_refresh_provided",
            message: "No refresh token provided",
            data: null,
        }).describe("No refreshToken provided on the cookies."),
        401: zodResponseSchema({
            status: 401,
            error: "Unauthorized",
            code: "invalid_refresh",
            message: "Invalid refresh token",
            data: null,
        }).describe("The provided refreshToken is invalid."),
        410: zodResponseSchema({
            status: 410,
            error: "Gone",
            code: "refresh_expired",
            message: "Refresh token expired",
            data: null,
        }).describe("Invalid refreshToken."),
        404: zodResponseSchema({
            status: 404,
            error: "Not found",
            code: "user_not_found",
            message: "User not found",
            data: null,
        }).describe("The user related to the refreshtoken was not found."),
        200: zodResponseSchema({
            status: 200,
            error: null,
            code: "revalidate_success",
            message: "JWT revalidated successfully",
            data: z.object({
                token: z.string(),
            }),
        }).describe("The JWT was successfully revalidated."),
    },
};

const verifySchema: FastifySchema = {
    tags: ["Auth"],
    description: `**Verifies the user corresponding to the token.**
        
When the confirmation email is sent, a link to this API route is sent together with the confirmation token.
        `,
    summary: "Verify email",
    querystring: z.object({
        token: z.string(),
    }),
    response: {
        404: zodResponseSchema({
            status: 404,
            error: "Not Found",
            code: "token_not_found",
            message: "Token not found",
            data: null,
        }).describe("Provided token was not found."),
        401: zodResponseSchema({
            status: 410,
            error: "Gone",
            code: "token_expired",
            message: "Token expired",
            data: null,
        }).describe("The token is expired."),
        400: zodResponseSchema({
            status: 400,
            error: "Bad Request",
            code: "invalid_token",
            message: "Invalid token",
            data: null,
        }).describe("The token is invalid (mismatching type, for example)."),
        200: zodResponseSchema({
            status: 200,
            error: null,
            code: "email_verify_success",
            message: "Email verified successfully",
            data: null,
        }).describe("The email was verified successfully."),
    },
};

export const authDocs = { registerSchema, loginSchema, revalidateSchema, verifySchema };
