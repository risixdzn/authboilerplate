import { z } from 'zod';

export const editAccountSchema = z
    .object({
        displayName: z.string().min(3).max(100).optional(),
    })
    .refine(
        (data: { [key: string]: string }) =>
            Object.keys(data).some((key) => data[key] !== undefined),
        {
            message: "At least one field must be provided",
        }
    );

export const confirmAccountDeletionSchema = z.object({
    token: z.string(),
});
