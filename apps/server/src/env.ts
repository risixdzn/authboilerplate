import { config } from "dotenv";
import { z } from "zod";

config();
const envSchema = z.object({
    DB_URL: z.string().url(),
    JWT_SECRET: z.string(),
    COOKIE_ENCRYPTION_SECRET: z.string(),
    RESEND_KEY: z.string(),
    EMAIL_DOMAIN: z.string(),
    APP_NAME: z.string(),
    NODE_PORT: z.string(),
});

export const env = envSchema.parse(process.env);
