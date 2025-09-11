import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const fraClaims = pgTable("fra_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pattalHolderName: text("patta_holder_name").notNull(),
  fatherName: text("father_name"),
  village: text("village").notNull(),
  district: text("district").notNull(),
  tehsil: text("tehsil"),
  tribe: text("tribe"),
  totalArea: decimal("total_area", { precision: 10, scale: 2 }).notNull(),
  surveyNumber: text("survey_number"),
  landType: text("land_type"),
  status: text("status").notNull().default("pending"), // granted, pending, rejected, under_review
  issueDate: timestamp("issue_date"),
  documentType: text("document_type"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // pond, farm, forest, settlement
  village: text("village").notNull(),
  district: text("district").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeName: text("scheme_name").notNull(),
  schemeType: text("scheme_type").notNull(), // jal_jeevan, pm_kisan, mgnrega
  priority: text("priority").notNull(), // high, medium, low
  village: text("village").notNull(),
  district: text("district").notNull(),
  description: text("description").notNull(),
  eligibleBeneficiaries: integer("eligible_beneficiaries"),
  estimatedBudget: decimal("estimated_budget", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const villages = pgTable("villages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  district: text("district").notNull(),
  tehsil: text("tehsil"),
  population: integer("population"),
  tribalPopulation: integer("tribal_population"),
  waterIndex: decimal("water_index", { precision: 3, scale: 2 }),
  developmentIndex: decimal("development_index", { precision: 3, scale: 2 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  boundaries: text("boundaries"), // GeoJSON polygon
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFraClaimSchema = createInsertSchema(fraClaims).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export const insertVillageSchema = createInsertSchema(villages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FraClaim = typeof fraClaims.$inferSelect;
export type InsertFraClaim = z.infer<typeof insertFraClaimSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Village = typeof villages.$inferSelect;
export type InsertVillage = z.infer<typeof insertVillageSchema>;
