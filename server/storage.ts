import { type User, type InsertUser, type Country, type InsertCountry, type RegionColors } from "@shared/schema";
import { africaCountries, regionColors } from "@shared/africaData";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCountries(): Promise<Country[]>;
  getCountry(id: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: string, country: Partial<InsertCountry>): Promise<Country | undefined>;
  deleteCountry(id: string): Promise<boolean>;
  
  getRegionColors(): Promise<RegionColors>;
  updateRegionColors(colors: RegionColors): Promise<RegionColors>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private countries: Map<string, Country>;
  private colors: RegionColors;

  constructor() {
    this.users = new Map();
    this.countries = new Map();
    this.colors = { ...regionColors };
    
    africaCountries.forEach(country => {
      this.countries.set(country.id, country as Country);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCountries(): Promise<Country[]> {
    return Array.from(this.countries.values());
  }

  async getCountry(id: string): Promise<Country | undefined> {
    return this.countries.get(id);
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = insertCountry.id || randomUUID();
    const country: Country = { ...insertCountry, id };
    this.countries.set(id, country);
    return country;
  }

  async updateCountry(id: string, updates: Partial<InsertCountry>): Promise<Country | undefined> {
    const country = this.countries.get(id);
    if (!country) return undefined;
    
    const updated = { ...country, ...updates };
    this.countries.set(id, updated);
    return updated;
  }

  async deleteCountry(id: string): Promise<boolean> {
    return this.countries.delete(id);
  }

  async getRegionColors(): Promise<RegionColors> {
    return { ...this.colors };
  }

  async updateRegionColors(colors: RegionColors): Promise<RegionColors> {
    this.colors = { ...colors };
    return this.colors;
  }
}

export const storage = new MemStorage();
