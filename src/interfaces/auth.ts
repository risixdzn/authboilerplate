import { z } from "zod";

export interface createUser {
    displayName?: string | null;
    email: string;
    password: string;
}

export const createUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8)
        .max(128)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
            message:
                "Password needs to contain one uppercase character, one lowercase character, one number, one special character and be at least 8 length.",
        }),
    displayName: z.string().min(3).max(100).optional(),
});

export interface loginUser {
    email: string;
    password: string;
}

export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export interface nonSensitiveUser {
    id: string;
    displayName: string | null;
    email: string;
    createdAt: Date;
}

export const verifyEmailSchema = z.object({
    token: z.string(),
});
