import fs from "fs";
import path from "path";
import { sequelize } from "./config/database.js";

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "migrations");
  const migrationFiles = fs.readdirSync(migrationsDir);

  for (const file of migrationFiles) {
    if (file.endsWith(".js")) {
      const migration = await import(path.join(migrationsDir, file));
      await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
      console.log(`Migration ${file} has been executed.`);
    }
  }
}

runMigrations()
  .then(() => {
    console.log("All migrations have been executed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running migrations:", error);
    process.exit(1);
  });
