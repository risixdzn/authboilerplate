import postgres from "postgres";
import chalk from "chalk";
import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { env } from "../env";

const dbUrl = env.DB_URL.replace("postgres:5432", "localhost:5432");

(async () => {
    console.log("Connecting to database:", dbUrl);
    const connection = postgres(dbUrl, { max: 1 });
    const db = drizzle(connection, { logger: true });

    console.log("Migrations folder:", path.resolve("drizzle"));

    try {
        await migrate(db, { migrationsFolder: "drizzle" });
        console.log(chalk.greenBright("Migrations applied successfully!"));
    } catch (error) {
        console.error(chalk.redBright("Migration failed:"), error);
        throw new Error(`Migration process failed. ${error}`); // Throw an error to stop CI
    } finally {
        await connection.end();
    }

    process.exit();
})();
