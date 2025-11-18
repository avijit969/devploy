import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { user } from "../../auth-schema";

export const projects = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).unique().notNull(),
  description: varchar({ length: 255 }),
  repo_url: varchar({ length: 255 }).notNull(),
  live_url: varchar({ length: 255 }),
  deploy_status: varchar({ length: 50 }).notNull().default("pending"),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
