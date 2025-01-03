import { config } from "dotenv";
import { z } from "zod";

config();
const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    COOKIE_ENCRYPTION_SECRET: z.string(),
    RESEND_KEY: z.string(),
    EMAIL_DOMAIN: z.string(),
    APP_NAME: z.string(),

    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DATABASE: z.string(),
    POSTGRES_PORT: z.string(),
    NODE_PORT: z.string(),
});

export const env = envSchema.parse(process.env);
