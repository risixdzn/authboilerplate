import { z } from "zod";
import { nonSensitiveUser } from "@repo/schemas/auth";
import server from "../server";

export function signJWT({
    payload,
    expiresIn,
}: {
    payload: z.infer<typeof nonSensitiveUser>;
    expiresIn?: string | number;
}): string {
    return server.jwt.sign(payload, { expiresIn: expiresIn ?? "10s" });
}

export function verifyJWT(token: string) {
    try {
        const decoded = server.jwt.verify(token);
        return { payload: decoded, expired: false };
    } catch (error) {
        return { payload: null, expired: true };
    }
}
