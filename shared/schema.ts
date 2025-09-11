import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define enums for better data validation
export const claimStatusEnum = pgEnum("claim_status", ["pending", "granted", "rejected", "under_review"]);
export const assetTypeEnum = pgEnum("asset_type", ["pond", "farm", "forest", "settlement"]);
export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);
export const schemeTypeEnum = pgEnum("scheme_type", ["jal_jeevan", "pm_kisan", "mgnrega"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "field_officer", "data_analyst"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // Will store bcrypt hashed passwords
  role: userRoleEnum("role").notNull().default("field_officer"),
  createdAt: timestamp("created_at").defaultNow(),
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
  status: claimStatusEnum("status").notNull().default("pending"),
  issueDate: timestamp("issue_date"),
  documentType: text("document_type"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  statusIdx: index("fra_claims_status_idx").on(table.status),
  villageIdx: index("fra_claims_village_idx").on(table.village),
  districtIdx: index("fra_claims_district_idx").on(table.district),
}));

export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: assetTypeEnum("type").notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  typeIdx: index("assets_type_idx").on(table.type),
  villageIdx: index("assets_village_idx").on(table.village),
  districtIdx: index("assets_district_idx").on(table.district),
}));

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schemeName: text("scheme_name").notNull(),
  schemeType: schemeTypeEnum("scheme_type").notNull(),
  priority: priorityEnum("priority").notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  description: text("description").notNull(),
  eligibleBeneficiaries: integer("eligible_beneficiaries"),
  estimatedBudget: decimal("estimated_budget", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  priorityIdx: index("recommendations_priority_idx").on(table.priority),
  villageIdx: index("recommendations_village_idx").on(table.village),
  schemeTypeIdx: index("recommendations_scheme_type_idx").on(table.schemeType),
}));

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
}, (table) => ({
  districtIdx: index("villages_district_idx").on(table.district),
  nameIdx: index("villages_name_idx").on(table.name),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
}).refine(
  (data) => {
    // Password strength validation
    const password = data.password;
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasUpper && hasLower && hasNumber;
  },
  {
    message: "Password must be at least 8 characters long and contain uppercase, lowercase, and number",
    path: ["password"],
  }
);

// Add validation schemas for route parameters
export const claimStatusSchema = z.enum(["pending", "granted", "rejected", "under_review"]);
export const assetTypeSchema = z.enum(["pond", "farm", "forest", "settlement"]);
export const prioritySchema = z.enum(["high", "medium", "low"]);
export const schemeTypeSchema = z.enum(["jal_jeevan", "pm_kisan", "mgnrega"]);
export const userRoleSchema = z.enum(["admin", "field_officer", "data_analyst"]);

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
