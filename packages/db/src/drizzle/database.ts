import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as DB_RELATIONS from "./relations";
import * as DB_SCHEMA from "./schema";

export const schema = { ...DB_SCHEMA, ...DB_RELATIONS };

// Configure connection pooling to prevent "Max client connections reached" errors
// These settings balance performance and connection management:
// - max: Limits concurrent connections (adjust based on your DB server's max_connections)
// - idle_timeout: Closes idle connections to free resources (60s is less aggressive)
// - max_lifetime: Prevents stale connections (30min is standard)
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: Number.parseInt(process.env.DATABASE_MAX_CONNECTIONS || "30", 10), // Increased for better concurrency
  idle_timeout: Number.parseInt(process.env.DATABASE_IDLE_TIMEOUT || "60", 10), // Less aggressive: 60 seconds
  max_lifetime: Number.parseInt(
    process.env.DATABASE_MAX_LIFETIME || "1800",
    10
  ), // 30 minutes
  connection: {
    application_name: "zaher-app",
  },
});

// Instantiate Drizzle client with pg driver and schema.
export const db = drizzle(client, { schema });
