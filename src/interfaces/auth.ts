import { z } from "zod";

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

export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const nonSensitiveUser = z
    .object({
        id: z.string().cuid2(),
        email: z.string().email({ message: "Invalid email address" }),
        displayName: z.string().min(3).max(100).optional(),
        createdAt: z.date(),
    })
    .describe(
        "Representing the user object, contains only non-sentitive data. User password will **NEVER** be returned in responses, not even in hashed format."
    );

export const verifyEmailSchema = z.object({
    token: z.string(),
});
