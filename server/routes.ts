import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole } from "./replitAuth";
import { openai, SYSTEM_PROMPT } from "./openai";
import { 
  insertCountrySchema, 
  regionColorsSchema,
  insertProjectSchema,
  insertNotificationSchema,
  insertSettingsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/auth/user/role', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const { userId, role } = req.body;
      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Project routes
  
  // Public: Submit a new project (authenticated users only)
  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertProjectSchema.parse({
        ...req.body,
        submittedBy: userId,
        status: "pending"
      });
      const project = await storage.createProject(data);
      
      // TODO: Create notification for focal persons
      
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get public dashboard (approved projects only - country and pillar)
  app.get("/api/projects/public", async (_req, res) => {
    try {
      const projects = await storage.getApprovedProjects();
      // Return only country and pillar for public view
      const publicData = projects.map(p => ({
        id: p.id,
        country: p.country,
        pifahPillar: p.pifahPillar,
        projectTitle: p.projectTitle,
      }));
      res.json(publicData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get project statistics by country (for map visualization)
  app.get("/api/countries/statistics", async (_req, res) => {
    try {
      const projects = await storage.getApprovedProjects();
      const countries = await storage.getCountries();
      
      // Create a map of country statistics
      const statsMap = new Map<string, { 
        countryName: string;
        totalProjects: number; 
        pillarCounts: Record<string, number>;
        projects: Array<{ id: string; title: string; pillar: string }>;
      }>();
      
      // Initialize stats for all countries
      countries.forEach(country => {
        statsMap.set(country.name, {
          countryName: country.name,
          totalProjects: 0,
          pillarCounts: {},
          projects: []
        });
      });
      
      // Aggregate project data by country
      projects.forEach(project => {
        const stats = statsMap.get(project.country);
        if (stats) {
          stats.totalProjects++;
          stats.pillarCounts[project.pifahPillar] = (stats.pillarCounts[project.pifahPillar] || 0) + 1;
          stats.projects.push({
            id: project.id,
            title: project.projectTitle,
            pillar: project.pifahPillar
          });
        }
      });
      
      // Convert to array
      const statisticsArray = Array.from(statsMap.entries()).map(([country, stats]) => ({
        country,
        ...stats
      }));
      
      res.json(statisticsArray);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get overall project statistics (for pillar breakdown)
  app.get("/api/statistics/overview", async (_req, res) => {
    try {
      const allProjects = await storage.getAllProjectsForStats();
      
      const stats = {
        totalProjects: allProjects.length,
        approvedProjects: allProjects.filter(p => p.status === 'approved').length,
        pendingProjects: allProjects.filter(p => p.status === 'pending').length,
        underReviewProjects: allProjects.filter(p => p.status === 'under_review').length,
        rejectedProjects: allProjects.filter(p => p.status === 'rejected').length,
        pillarBreakdown: {} as Record<string, { approved: number; notApproved: number }>,
      };

      // Calculate pillar breakdown
      allProjects.forEach(project => {
        if (!stats.pillarBreakdown[project.pifahPillar]) {
          stats.pillarBreakdown[project.pifahPillar] = { approved: 0, notApproved: 0 };
        }
        if (project.status === 'approved') {
          stats.pillarBreakdown[project.pifahPillar].approved++;
        } else {
          stats.pillarBreakdown[project.pifahPillar].notApproved++;
        }
      });

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Backend: Get all projects with filters (admin, focal, approver only)
  app.get("/api/projects", isAuthenticated, requireRole(['admin', 'focal_person', 'approver']), async (req, res) => {
    try {
      const { status, country, pillar } = req.query;
      const projects = await storage.getProjects({
        status: status as string,
        country: country as string,
        pillar: pillar as string,
      });
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's own projects
  app.get("/api/projects/my-projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects({ submittedBy: userId });
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single project
  app.get("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Focal person: Review and forward project
  app.patch("/api/projects/:id/review", isAuthenticated, requireRole(['focal_person', 'admin']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.updateProject(req.params.id, {
        status: "under_review",
        reviewedBy: userId,
        reviewedAt: new Date(),
      });
      
      // Create notification for the submitter
      await storage.createNotification({
        userId: project.submittedBy,
        projectId: project.id,
        type: "review",
        message: "Your project is now under review by a focal person",
        read: false,
      });
      
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Approver: Approve or reject project
  app.patch("/api/projects/:id/approve", isAuthenticated, requireRole(['approver', 'admin']), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { approved } = req.body;
      
      const project = await storage.updateProject(req.params.id, {
        status: approved ? "approved" : "rejected",
        approvedBy: userId,
        approvedAt: new Date(),
      });
      
      // Create notification for the submitter
      await storage.createNotification({
        userId: project.submittedBy,
        projectId: project.id,
        type: approved ? "approval" : "rejection",
        message: approved 
          ? "Congratulations! Your project has been approved and is now visible on the public dashboard"
          : "Your project has been rejected. Please review and resubmit",
        read: false,
      });
      
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update project (admin only)
  app.patch("/api/projects/:id", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, updates);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete project (admin only)
  app.delete("/api/projects/:id", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Country routes (for map visualization)
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

  app.post("/api/countries", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const data = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(data);
      res.status(201).json(country);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/countries/:id", isAuthenticated, requireRole(['admin']), async (req, res) => {
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

  app.delete("/api/countries/:id", isAuthenticated, requireRole(['admin']), async (req, res) => {
    await storage.deleteCountry(req.params.id);
    res.status(204).send();
  });

  // Settings routes (for admin customization)
  app.get("/api/settings", async (_req, res) => {
    try {
      const appSettings = await storage.getSettings();
      res.json(appSettings || { id: "app_settings", logoUrl: null, bannerImageUrl: null });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/settings", isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const updates = insertSettingsSchema.partial().parse(req.body);
      const appSettings = await storage.updateSettings(updates);
      res.json(appSettings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chatbot route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "not-configured") {
        return res.json({
          error: "The chatbot is not yet configured. Please add your OpenAI API key to the environment variables (OPENAI_API_KEY) to enable the AI assistant."
        });
      }

      // the newest OpenAI model is "gpt-4o" which is highly capable for chat applications
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      res.json({ message: assistantMessage });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({
        error: "I'm having trouble processing your request right now. This might be due to an invalid API key or service issue. Please check your OpenAI API key configuration."
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
