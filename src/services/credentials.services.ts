import { eq } from "drizzle-orm";

import { db } from "../db/connection";
import { users } from "../db/schema";

export async function updateUserPassword(userId: string, passwordHash: string) {
    return await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
