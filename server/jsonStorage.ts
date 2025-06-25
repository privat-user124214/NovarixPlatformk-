import fs from "fs/promises";
import path from "path";
import { 
  type User, 
  type InsertUser, 
  type Order,
  type InsertOrder,
  type OrderWithUser,
  type UpdateOrderStatus,
  type Partner,
  type InsertPartner,
  type UpdatePartner
} from "@shared/schema";

interface JsonData {
  users: User[];
  orders: Order[];
  partners: Partner[];
  nextUserId: number;
  nextOrderId: number;
  nextPartnerId: number;
  blacklistedIPs: string[];
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserNotes(id: number, notes: string): Promise<void>;
  updateUserBlacklist(id: number, blacklisted: boolean): Promise<void>;
  updateUserRole(id: number, role: string): Promise<void>;
  getTeamMembers(): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
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

  // IP Blacklist methods
  isIPBlacklisted(ip: string): Promise<boolean>;
  addIPToBlacklist(ip: string): Promise<void>;
  removeIPFromBlacklist(ip: string): Promise<void>;
  getBlacklistedIPs(): Promise<string[]>;

  // Partner operations
  createPartner(partner: InsertPartner): Promise<Partner>;
  getAllPartners(): Promise<Partner[]>;
  getActivePartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  updatePartner(id: number, update: UpdatePartner): Promise<void>;
  deletePartner(id: number): Promise<void>;
}

export class JsonStorage implements IStorage {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), "data.json");
  }

  private async loadData(): Promise<JsonData> {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      const jsonData = JSON.parse(data);
      if (!jsonData.blacklistedIPs) {
        jsonData.blacklistedIPs = [];
      }
      if (!jsonData.partners) {
        jsonData.partners = [];
      }
      if (!jsonData.nextPartnerId) {
        jsonData.nextPartnerId = 1;
      }
      return jsonData;
    } catch (error) {
      // If file doesn't exist, create initial data with owner user
      const initialData: JsonData = {
        users: [
          {
            id: 1,
            email: "lenny.winkler.de@gmail.com",
            password: "$2b$10$nSATq1FNJtibphtJSQh/K.nt5tKT244ZaCdw6OEGrVpWfduMbOII6",
            role: "owner",
            firstName: "Lenny",
            lastName: "Winkler",
            createdAt: new Date(),
            updatedAt: new Date(),
            notes: "System Owner"
          }
        ],
        orders: [],
        partners: [],
        nextUserId: 2,
        nextOrderId: 1,
        nextPartnerId: 1,
        blacklistedIPs: []
      };
      await this.saveData(initialData);
      return initialData;
    }
  }

  private async saveData(data: JsonData): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2), "utf-8");
  }

  async getUser(id: number): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const data = await this.loadData();
    const newUser: User = {
      ...insertUser,
      id: data.nextUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    data.users.push(newUser);
    data.nextUserId++;
    await this.saveData(data);

    return newUser;
  }

  async updateUserNotes(id: number, notes: string): Promise<void> {
    const data = await this.loadData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      user.notes = notes;
      user.updatedAt = new Date();
      await this.saveData(data);
    }
  }

  async updateUserBlacklist(id: number, blacklisted: boolean): Promise<void> {
    const data = await this.loadData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      user.blacklisted = blacklisted;
      user.updatedAt = new Date();
      await this.saveData(data);
    }
  }

  async updateUserRole(id: number, role: string): Promise<void> {
    const data = await this.loadData();
    const user = data.users.find(u => u.id === id);
    if (user) {
      user.role = role;
      user.updatedAt = new Date();
      await this.saveData(data);
    }
  }

  async getTeamMembers(): Promise<User[]> {
    const data = await this.loadData();
    return data.users
      .filter(user => ["dev", "admin", "owner"].includes(user.role))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllUsers(): Promise<User[]> {
    const data = await this.loadData();
    return data.users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteUser(id: number): Promise<void> {
    const data = await this.loadData();
    data.users = data.users.filter(user => user.id !== id);
    await this.saveData(data);
  }

  async createOrder(orderData: InsertOrder & { userId: number }): Promise<Order> {
    const data = await this.loadData();
    const newOrder: Order = {
      ...orderData,
      id: data.nextOrderId,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    data.orders.push(newOrder);
    data.nextOrderId++;
    await this.saveData(data);

    return newOrder;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const data = await this.loadData();
    return data.orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAllOrders(): Promise<OrderWithUser[]> {
    const data = await this.loadData();
    return data.orders
      .map(order => {
        const user = data.users.find(u => u.id === order.userId);
        return {
          ...order,
          user: user!
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrder(id: number): Promise<OrderWithUser | undefined> {
    const data = await this.loadData();
    const order = data.orders.find(o => o.id === id);
    if (!order) return undefined;

    const user = data.users.find(u => u.id === order.userId);
    return {
      ...order,
      user: user!
    };
  }

  async updateOrderStatus(id: number, update: UpdateOrderStatus): Promise<void> {
    const data = await this.loadData();
    const order = data.orders.find(o => o.id === id);
    if (order) {
      if (update.status) order.status = update.status;
      if (update.notes !== undefined) order.notes = update.notes;
      order.updatedAt = new Date();
      await this.saveData(data);
    }
  }

  async getUserOrdersThisMonth(userId: number): Promise<number> {
    const data = await this.loadData();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return data.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return order.userId === userId && 
             orderDate >= startOfMonth && 
             orderDate < startOfNextMonth;
    }).length;
  }

  async getUserOrderStats(userId: number): Promise<{
    thisMonth: number;
    active: number;
    completed: number;
  }> {
    const data = await this.loadData();
    const userOrders = data.orders.filter(order => order.userId === userId);

    const thisMonth = await this.getUserOrdersThisMonth(userId);
    const active = userOrders.filter(order => order.status === "in_progress").length;
    const completed = userOrders.filter(order => order.status === "completed").length;

    return {
      thisMonth,
      active,
      completed,
    };
  }

  async isIPBlacklisted(ip: string): Promise<boolean> {
    const data = await this.loadData();
    return data.blacklistedIPs?.includes(ip) || false;
  }

  async addIPToBlacklist(ip: string): Promise<void> {
    const data = await this.loadData();
    if (!data.blacklistedIPs) {
      data.blacklistedIPs = [];
    }
    if (!data.blacklistedIPs.includes(ip)) {
      data.blacklistedIPs.push(ip);
      await this.saveData(data);
    }
  }

  async removeIPFromBlacklist(ip: string): Promise<void> {
    const data = await this.loadData();
    if (data.blacklistedIPs) {
      data.blacklistedIPs = data.blacklistedIPs.filter(blockedIP => blockedIP !== ip);
      await this.saveData(data);
    }
  }

  async getBlacklistedIPs(): Promise<string[]> {
    const data = await this.loadData();
    return data.blacklistedIPs || [];
  }

  // Partner operations
  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const data = await this.loadData();
    const newPartner: Partner = {
      id: data.nextPartnerId,
      name: insertPartner.name,
      description: insertPartner.description || null,
      website: insertPartner.website || null,
      logo: insertPartner.logo || null,
      contactEmail: insertPartner.contactEmail || null,
      isActive: insertPartner.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    data.partners.push(newPartner);
    data.nextPartnerId++;
    await this.saveData(data);
    return newPartner;
  }

  async getAllPartners(): Promise<Partner[]> {
    const data = await this.loadData();
    return data.partners || [];
  }

  async getActivePartners(): Promise<Partner[]> {
    const data = await this.loadData();
    return (data.partners || []).filter(partner => partner.isActive);
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const data = await this.loadData();
    return data.partners.find(partner => partner.id === id);
  }

  async updatePartner(id: number, update: UpdatePartner): Promise<void> {
    const data = await this.loadData();
    const partnerIndex = data.partners.findIndex(partner => partner.id === id);
    if (partnerIndex === -1) return;

    const partner = data.partners[partnerIndex];
    data.partners[partnerIndex] = {
      ...partner,
      ...update,
      updatedAt: new Date(),
    };
    await this.saveData(data);
  }

  async deletePartner(id: number): Promise<void> {
    const data = await this.loadData();
    data.partners = data.partners.filter(partner => partner.id !== id);
    await this.saveData(data);
  }
}

export const storage = new JsonStorage();