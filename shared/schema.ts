import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("public"), // public, focal_person, approver, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// PIFAH Projects table - Based on the template document
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // General Information
  projectTitle: text("project_title").notNull(),
  projectSummary: text("project_summary").notNull(),
  country: text("country").notNull(),
  region: text("region").notNull(),
  implementingEntity: text("implementing_entity").notNull(),
  pppModel: text("ppp_model"),
  projectType: text("project_type").notNull(),
  projectWebsite: text("project_website"),
  contactPerson: text("contact_person").notNull(),
  contactDetails: text("contact_details").notNull(),
  
  // Strategic Rationale
  projectDescription: text("project_description").notNull(),
  pifahPillar: text("pifah_pillar").notNull(), // Health Infrastructure, Local Manufacturing, etc.
  alignmentToNationalPriorities: text("alignment_to_national_priorities"),
  regionalIntegrationPotential: boolean("regional_integration_potential").default(false),
  regionalIntegrationDetails: text("regional_integration_details"),
  
  // Market Opportunity
  marketSize: text("market_size"),
  targetPopulation: text("target_population"),
  existingSolutions: text("existing_solutions"),
  uniqueSellingProposition: text("unique_selling_proposition"),
  
  // Economic & Health Impact
  expectedHealthOutcomes: text("expected_health_outcomes"),
  economicBenefits: text("economic_benefits"),
  socialImpact: text("social_impact"),
  contributionAreas: text("contribution_areas").array(), // Youth Development, Gender Inclusion, etc.
  contributionDescription: text("contribution_description"),
  environmentalConsiderations: text("environmental_considerations"),
  
  // Financial Information
  estimatedInvestment: text("estimated_investment"),
  costBreakdown: text("cost_breakdown"),
  currentFundingModel: text("current_funding_model"),
  proposedFinancingStructure: text("proposed_financing_structure"),
  expectedReturn: text("expected_return"),
  
  // Implementation Readiness
  currentStage: text("current_stage").notNull(),
  keyMilestones: text("key_milestones"),
  governmentApprovals: boolean("government_approvals").default(false),
  partnerships: text("partnerships"),
  regulatoryAlignment: text("regulatory_alignment"),
  
  // Risk & Mitigation
  majorRisks: text("major_risks"),
  mitigationMeasures: text("mitigation_measures"),
  
  // Timeline
  plannedStartDate: text("planned_start_date"),
  implementationHorizon: text("implementation_horizon"),
  
  // Support Required
  supportRequired: text("support_required").array(),
  
  // Additional Information
  otherNotes: text("other_notes"),
  
  // Workflow fields
  status: text("status").notNull().default("pending"), // pending, under_review, approved, rejected
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  submitter: one(users, {
    fields: [projects.submittedBy],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [projects.reviewedBy],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [projects.approvedBy],
    references: [users.id],
  }),
}));

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  type: text("type").notNull(), // submission, review, approval, rejection
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [notifications.projectId],
    references: [projects.id],
  }),
}));

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Countries table (for the map visualization)
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

// Region colors schema (for map customization)
export const regionColorsSchema = z.object({
  North: z.string(),
  West: z.string(),
  East: z.string(),
  Central: z.string(),
  South: z.string(),
});

export type RegionColors = z.infer<typeof regionColorsSchema>;
