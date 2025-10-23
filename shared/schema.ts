import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const countries = pgTable("countries", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  capital: text("capital").notNull(),
  population: integer("population").notNull(),
  area: integer("area").notNull(),
  region: text("region").notNull(),
  gdp: integer("gdp"),
  languages: text("languages").array(),
});

export const insertCountrySchema = createInsertSchema(countries);
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

export const regionColorsSchema = z.object({
  North: z.string(),
  West: z.string(),
  East: z.string(),
  Central: z.string(),
  South: z.string(),
});

export type RegionColors = z.infer<typeof regionColorsSchema>;
