import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import db from "./config/database.js";

// Mendapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    // Menggunakan __dirname untuk mendapatkan jalur yang benar
    const migrationFiles = fs.readdirSync(path.join(__dirname, "migrations"));

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, "migrations", file);
      const migration = await import(pathToFileURL(filePath).href);
      await migration.default.up(db.getQueryInterface(), db.Sequelize);
      console.log(`Migration ${file} has been applied successfully.`);
    }
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    await db.close();
  }
};

runMigrations();
