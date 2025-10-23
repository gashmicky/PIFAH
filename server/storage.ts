import {
  users,
  projects,
  notifications,
  countries,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Notification,
  type InsertNotification,
  type Country,
  type InsertCountry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getProjects(filters?: {
    status?: string;
    country?: string;
    pillar?: string;
    submittedBy?: string;
  }): Promise<Project[]>;
  getApprovedProjects(): Promise<Project[]>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Country operations
  getCountry(id: string): Promise<Country | undefined>;
  getCountries(): Promise<Country[]>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: string, data: Partial<Country>): Promise<Country>;
  deleteCountry(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Project operations
  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project;
  }

  async getProjects(filters?: {
    status?: string;
    country?: string;
    pillar?: string;
    submittedBy?: string;
  }): Promise<Project[]> {
    if (filters) {
      const conditions = [];
      if (filters.status) conditions.push(eq(projects.status, filters.status));
      if (filters.country) conditions.push(eq(projects.country, filters.country));
      if (filters.pillar) conditions.push(eq(projects.pifahPillar, filters.pillar));
      if (filters.submittedBy) conditions.push(eq(projects.submittedBy, filters.submittedBy));
      
      if (conditions.length > 0) {
        return db
          .select()
          .from(projects)
          .where(and(...conditions))
          .orderBy(desc(projects.createdAt));
      }
    }
    
    return db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt));
  }

  async getApprovedProjects(): Promise<Project[]> {
    return db
      .select()
      .from(projects)
      .where(eq(projects.status, "approved"))
      .orderBy(desc(projects.approvedAt));
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Notification operations
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  // Country operations
  async getCountry(id: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }

  async getCountries(): Promise<Country[]> {
    return db.select().from(countries);
  }

  async createCountry(countryData: InsertCountry): Promise<Country> {
    const [country] = await db
      .insert(countries)
      .values(countryData)
      .returning();
    return country;
  }

  async updateCountry(id: string, data: Partial<Country>): Promise<Country> {
    const [country] = await db
      .update(countries)
      .set(data)
      .where(eq(countries.id, id))
      .returning();
    return country;
  }

  async deleteCountry(id: string): Promise<void> {
    await db.delete(countries).where(eq(countries.id, id));
  }
}

export const storage = new DatabaseStorage();
