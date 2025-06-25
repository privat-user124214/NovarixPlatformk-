import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("customer"), // customer, dev, admin, owner
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  notes: text("notes"), // For team member notes
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  discordName: varchar("discord_name", { length: 100 }).notNull(),
  botName: varchar("bot_name", { length: 100 }).notNull(),
  botLogoUrl: text("bot_logo_url"),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, in_progress, completed, cancelled
  notes: text("notes"), // Team notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  notes: true,
}).extend({
  description: z.string().min(50, "Description must be at least 50 characters"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export const addTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["dev", "admin"]),
  notes: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type OrderWithUser = Order & { user: User };
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
export type AddTeamMember = z.infer<typeof addTeamMemberSchema>;
