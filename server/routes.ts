import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./jsonStorage";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";
import {
  insertUserSchema,
  loginSchema,
  insertOrderSchema,
  updateOrderStatusSchema,
  addTeamMemberSchema,
  insertPartnerSchema,
  updatePartnerSchema,
} from "@shared/schema";

// Extend session data type
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Session configuration
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemoryStoreSession = MemoryStore(session);

  return session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: sessionTtl, // prune expired entries every 24h
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }

  req.session.userId = user.id;
  req.session.save(() => {
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  });
});

app.get("/api/auth/user", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });

  res.json(user);
});


// Auth middleware
const requireAuth = async (req: any, res: any, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.blacklisted) {
    req.session.destroy(() => {});
    return res.status(403).json({ message: "Account suspended" });
  }

  req.user = user;
  next();
};

const requireRole = (roles: string[]) => {
  return async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.use(getSession());

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "novarix-studio",
      version: "1.0.0",
    });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) return res.status(409).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({ ...userData, password: hashedPassword });
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.session.userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Could not log out" });
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", requireAuth, async (req: any, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });

  // Orders
  app.post("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      if (user.role === "customer") {
        const count = await storage.getUserOrdersThisMonth(user.id);
        if (count >= 3) {
          return res.status(429).json({ message: "Monthly order limit reached (3 orders per month)" });
        }
      }

      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder({ ...orderData, userId: user.id });
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/orders", requireAuth, async (req: any, res) => {
    const user = req.user;
    const orders =
      user.role === "customer"
        ? await storage.getOrdersByUser(user.id)
        : await storage.getAllOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAuth, async (req: any, res) => {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const user = req.user;
    if (user.role === "customer" && order.userId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  });

  app.patch("/api/orders/:id/status", requireRole(["dev", "admin", "owner"]), async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = updateOrderStatusSchema.parse(req.body);
      await storage.updateOrderStatus(orderId, updateData);
      res.json({ message: "Order updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stats
  app.get("/api/user/stats", requireAuth, async (req: any, res) => {
    const stats = await storage.getUserOrderStats(req.session.userId);
    res.json(stats);
  });

  // User management
  app.get("/api/users", requireRole(["dev", "admin", "owner"]), async (_, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.post("/api/users", requireRole(["admin", "owner"]), async (req: any, res) => {
    const currentUser = req.user;
    const memberData = addTeamMemberSchema.parse(req.body);

    if (currentUser.role === "admin" && memberData.role === "admin") {
      return res.status(403).json({ message: "Admins can only add developers" });
    }

    const existingUser = await storage.getUserByEmail(memberData.email);
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await storage.createUser({
      email: memberData.email,
      password: hashedPassword,
      role: memberData.role,
      notes: memberData.notes,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        notes: user.notes,
        createdAt: user.createdAt,
      },
      tempPassword,
    });
  });

  app.patch("/api/users/:id/notes", requireRole(["admin", "owner"]), async (req: any, res) => {
    const userId = parseInt(req.params.id);
    const { notes } = req.body;
    await storage.updateUserNotes(userId, notes);
    res.json({ message: "Notes updated successfully" });
  });

  app.delete("/api/users/:id", requireRole(["owner"]), async (req: any, res) => {
    const userId = parseInt(req.params.id);
    if (userId === req.session.userId) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await storage.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  });

  app.patch("/api/users/:id/blacklist", requireRole(["admin", "owner"]), async (req: any, res) => {
    const userId = parseInt(req.params.id);
    if (userId === req.session.userId) {
      return res.status(400).json({ message: "Cannot blacklist yourself" });
    }

    await storage.updateUserBlacklist(userId, req.body.blacklisted);
    res.json({ message: "User blacklist status updated" });
  });

  app.patch("/api/users/:id/role", requireRole(["owner"]), async (req: any, res) => {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (userId === req.session.userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    if (!["customer", "dev", "admin", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await storage.updateUserRole(userId, role);
    res.json({ message: "User role updated successfully" });
  });

  // Partner routes
  app.get("/api/partners", async (_, res) => {
    const partners = await storage.getActivePartners();
    res.json(partners);
  });

  app.get("/api/admin/partners", requireRole(["owner"]), async (_, res) => {
    const partners = await storage.getAllPartners();
    res.json(partners);
  });

  app.post("/api/admin/partners", requireRole(["owner"]), async (req: any, res) => {
    const validation = insertPartnerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Validation error", errors: validation.error.errors });
    }

    const partner = await storage.createPartner(validation.data);
    res.status(201).json(partner);
  });

  app.patch("/api/admin/partners/:id", requireRole(["owner"]), async (req: any, res) => {
    const partnerId = parseInt(req.params.id);
    if (isNaN(partnerId)) return res.status(400).json({ message: "Invalid partner ID" });

    const validation = updatePartnerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Validation error", errors: validation.error.errors });
    }

    const existingPartner = await storage.getPartner(partnerId);
    if (!existingPartner) return res.status(404).json({ message: "Partner not found" });

    await storage.updatePartner(partnerId, validation.data);
    res.json({ message: "Partner updated successfully" });
  });

  app.delete("/api/admin/partners/:id", requireRole(["owner"]), async (req: any, res) => {
    const partnerId = parseInt(req.params.id);
    if (isNaN(partnerId)) return res.status(400).json({ message: "Invalid partner ID" });

    const existingPartner = await storage.getPartner(partnerId);
    if (!existingPartner) return res.status(404).json({ message: "Partner not found" });

    await storage.deletePartner(partnerId);
    res.json({ message: "Partner deleted successfully" });
  });

  return createServer(app);
}
