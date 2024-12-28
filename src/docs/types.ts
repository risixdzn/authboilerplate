import { FastifySchema } from 'fastify';
import { z } from 'zod';

import type { ApiResponse } from "../helpers/response";
export type RouteDoc = FastifySchema;

export const zodResponseSchema = ({ status, error, message, code, data }: ApiResponse) => {
    return z.object({
        status: z.literal(status),
        error: z.literal(error),
        message: z.literal(message),
        code: z.literal(code),
        data: z.literal(data),
    });
};
