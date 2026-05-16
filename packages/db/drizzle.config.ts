import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// .env.local overrides .env (same precedence as Next.js)
dotenv.config({ path: "../../apps/web/.env" });
dotenv.config({ path: "../../apps/web/.env.local", override: true });

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
