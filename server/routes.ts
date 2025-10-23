import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCountrySchema, regionColorsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/countries", async (_req, res) => {
    const countries = await storage.getCountries();
    res.json(countries);
  });

  app.get("/api/countries/:id", async (req, res) => {
    const country = await storage.getCountry(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.json(country);
  });

  app.post("/api/countries", async (req, res) => {
    try {
      const data = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(data);
      res.status(201).json(country);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/countries/:id", async (req, res) => {
    try {
      const updates = insertCountrySchema.partial().parse(req.body);
      const country = await storage.updateCountry(req.params.id, updates);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.json(country);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/countries/:id", async (req, res) => {
    const deleted = await storage.deleteCountry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.status(204).send();
  });

  app.get("/api/region-colors", async (_req, res) => {
    const colors = await storage.getRegionColors();
    res.json(colors);
  });

  app.put("/api/region-colors", async (req, res) => {
    try {
      const colors = regionColorsSchema.parse(req.body);
      const updated = await storage.updateRegionColors(colors);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
