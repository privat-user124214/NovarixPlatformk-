import type { Config } from "drizzle-kit";

export default {
  schema: "./server/schema",      // Ordner mit deinen SQL Tabellen
  out: "./drizzle",               // Output-Verzeichnis für Queries
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
