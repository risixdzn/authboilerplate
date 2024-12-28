import { eq } from 'drizzle-orm';
import { FastifyReply } from 'fastify';

import { db } from '../db/connection';
import { oneTimeTokens, refreshTokens, users } from '../db/schema';
import { generateOneTimeToken } from '../helpers/tokens';

export interface RefreshToken {
    token: string;
    expires: Date;
}

export async function setRefreshToken(response: FastifyReply, token: RefreshToken, userId: string) {
    const cookieOptions = {
        httpOnly: true,
        expires: token.expires, // Adds 7 days to the current date
    };

    const [existing] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.userId, userId));

    if (existing) {
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }

    await db.insert(refreshTokens).values({
        expiresAt: token.expires,
        token: token.token,
        userId: userId,
    });

    response.setCookie("refreshToken", token.token, cookieOptions);
}

export async function createOneTimeToken({
    userId,
    email,
    tokenType,
}: {
    userId: string;
    email: string;
    tokenType: "confirmation" | "password_reset" | "account_deletion";
}) {
    const token = generateOneTimeToken();

    const [tokenData] = await db
        .insert(oneTimeTokens)
        .values({
            token: token,
            userId: userId,
            tokenType: tokenType,
            relatesTo: email,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        })
        .returning({
            id: oneTimeTokens.id,
            token: oneTimeTokens.token,
            tokenType: oneTimeTokens.tokenType,
            relatesTo: oneTimeTokens.relatesTo,
            userId: oneTimeTokens.userId,
            createdAt: oneTimeTokens.createdAt,
            expiresAt: oneTimeTokens.expiresAt,
        });

    return tokenData;
}

export async function queryOneTimeToken(token: string) {
    const [oneTimeToken] = await db
        .select({
            id: oneTimeTokens.id,
            token: oneTimeTokens.token,
            tokenType: oneTimeTokens.tokenType,
            relatesTo: oneTimeTokens.relatesTo,
            userId: oneTimeTokens.userId,
            createdAt: oneTimeTokens.createdAt,
            expiresAt: oneTimeTokens.expiresAt,
            user: {
                id: users.id,
                email: users.email,
                createdAt: users.createdAt,
                displayName: users.displayName,
            },
        })
        .from(oneTimeTokens)
        .where(eq(oneTimeTokens.token, token))
        .innerJoin(users, eq(users.id, oneTimeTokens.userId))
        .limit(1);

    return oneTimeToken;
}

export async function deleteOneTimeToken(token: string) {
    return await db.delete(oneTimeTokens).where(eq(oneTimeTokens.token, token));
}

export async function getUserOneTimeTokens(userId: string) {
    return await db.select().from(oneTimeTokens).where(eq(oneTimeTokens.userId, userId));
}
