import { 
  users, 
  orders,
  partners,
  type User, 
  type InsertUser, 
  type Order,
  type InsertOrder,
  type OrderWithUser,
  type UpdateOrderStatus,
  type AddTeamMember,
  type Partner,
  type InsertPartner,
  type UpdatePartner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lt, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserNotes(id: number, notes: string): Promise<void>;
  getTeamMembers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder & { userId: number }): Promise<Order>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<OrderWithUser[]>;
  getOrder(id: number): Promise<OrderWithUser | undefined>;
  updateOrderStatus(id: number, update: UpdateOrderStatus): Promise<void>;
  getUserOrdersThisMonth(userId: number): Promise<number>;
  
  // Statistics
  getUserOrderStats(userId: number): Promise<{
    thisMonth: number;
    active: number;
    completed: number;
  }>;

  // Partner operations
  createPartner(partner: InsertPartner): Promise<Partner>;
  getAllPartners(): Promise<Partner[]>;
  getActivePartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  updatePartner(id: number, update: UpdatePartner): Promise<void>;
  deletePartner(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserNotes(id: number, notes: string): Promise<void> {
    await db
      .update(users)
      .set({ notes, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async getTeamMembers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "dev"))
      .or(eq(users.role, "admin"))
      .or(eq(users.role, "owner"))
      .orderBy(desc(users.createdAt));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async createOrder(orderData: InsertOrder & { userId: number }): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<OrderWithUser[]> {
    return await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .then(results => 
        results.map(result => ({
          ...result.orders,
          user: result.users!
        }))
      );
  }

  async getOrder(id: number): Promise<OrderWithUser | undefined> {
    const [result] = await db
      .select()
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.orders,
      user: result.users!
    };
  }

  async updateOrderStatus(id: number, update: UpdateOrderStatus): Promise<void> {
    await db
      .update(orders)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(orders.id, id));
  }

  async getUserOrdersThisMonth(userId: number): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const result = await db
      .select({ count: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          gte(orders.createdAt, startOfMonth),
          lt(orders.createdAt, startOfNextMonth)
        )
      );
    
    return result.length;
  }

  async getUserOrderStats(userId: number): Promise<{
    thisMonth: number;
    active: number;
    completed: number;
  }> {
    const thisMonth = await this.getUserOrdersThisMonth(userId);
    
    const activeOrders = await db
      .select({ count: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.status, "in_progress")
        )
      );
    
    const completedOrders = await db
      .select({ count: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.status, "completed")
        )
      );
    
    return {
      thisMonth,
      active: activeOrders.length,
      completed: completedOrders.length,
    };
  }

  // Partner operations
  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values({
      ...insertPartner,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return partner;
  }

  async getAllPartners(): Promise<Partner[]> {
    return await db.select().from(partners).orderBy(desc(partners.createdAt));
  }

  async getActivePartners(): Promise<Partner[]> {
    return await db.select().from(partners).where(eq(partners.isActive, true)).orderBy(desc(partners.createdAt));
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner || undefined;
  }

  async updatePartner(id: number, update: UpdatePartner): Promise<void> {
    await db
      .update(partners)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(partners.id, id));
  }

  async deletePartner(id: number): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }
}

export const storage = new DatabaseStorage();
