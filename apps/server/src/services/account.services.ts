import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../db/connection";
import { users } from "../db/schema";
import { editAccountSchema } from "@repo/schemas/account";

export async function queryUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
}

export async function updateUserById(data: z.infer<typeof editAccountSchema>, id: string) {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
        createdAt: users.createdAt,
    });

    return updated;
}
