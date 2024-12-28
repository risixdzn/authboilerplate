import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { createId } from '@paralleldrive/cuid2';

export const orgRoleEnum = pgEnum("org_role", ["member", "admin"]);

export const users = pgTable("users", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name"),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    verified: boolean("verified").default(false).notNull(),
});
