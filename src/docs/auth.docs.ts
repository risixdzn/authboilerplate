import { FastifySchema } from 'fastify';
import { z } from 'zod';

import { createUserSchema } from '../interfaces/auth';
import { zodResponseSchema } from './types';

const registerSchema: FastifySchema = {
    tags: ["Auth"],
    description: "Register a user onto the system. Sends email confirmation on success.",
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

export const authDocs = { registerSchema };
