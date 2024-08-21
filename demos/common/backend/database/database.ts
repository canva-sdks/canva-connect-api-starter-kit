import * as fs from "fs/promises";
import * as path from "path";
import type { BaseDatabaseSchema } from "./schema";

/**
 * This file creates a "database" out of a JSON file. It's only for
 * demonstration purposes. A real app should use a real database.
 */
const JSON_DATABASE_FILENAME = "db.json";

interface Database<T> {
  read(): Promise<T>;
  write(data: T): Promise<void>;
}

export class JSONFileDatabase<T extends BaseDatabaseSchema = BaseDatabaseSchema>
  implements Database<T>
{
  constructor(
    private readonly seedData: T,
    private readonly rootDir: string,
  ) {}

  private get databaseFilePath(): string {
    return path.join(this.rootDir, JSON_DATABASE_FILENAME);
  }

  // Creates a database file if one doesn't already exist
  private async init(): Promise<void> {
    try {
      // Do nothing, since the database is initialized
      await fs.stat(this.databaseFilePath);
    } catch {
      const file = JSON.stringify(this.seedData);
      await fs.writeFile(this.databaseFilePath, file);
    }
  }

  // Loads and parses the database file
  async read(): Promise<T> {
    await this.init();
    const file = await fs.readFile(this.databaseFilePath, "utf8");
    return JSON.parse(file);
  }

  // Overwrites the database file with provided data
  async write(data: T): Promise<void> {
    await this.init();
    const file = JSON.stringify(data);
    await fs.writeFile(this.databaseFilePath, file);
  }
}
