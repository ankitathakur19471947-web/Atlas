import { 
  type User, type InsertUser, 
  type FraClaim, type InsertFraClaim,
  type Asset, type InsertAsset,
  type Recommendation, type InsertRecommendation,
  type Village, type InsertVillage,
  users, fraClaims, assets, recommendations, villages
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { AuthUtils } from "./auth";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // FRA Claims
  getFraClaims(): Promise<FraClaim[]>;
  getFraClaimById(id: string): Promise<FraClaim | undefined>;
  createFraClaim(claim: InsertFraClaim): Promise<FraClaim>;
  updateFraClaimStatus(id: string, status: string): Promise<FraClaim | undefined>;
  getFraClaimsByVillage(village: string): Promise<FraClaim[]>;
  getFraClaimsByStatus(status: string): Promise<FraClaim[]>;
  
  // Assets
  getAssets(): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  getAssetsByVillage(village: string): Promise<Asset[]>;
  getAssetsByType(type: string): Promise<Asset[]>;
  
  // Recommendations
  getRecommendations(): Promise<Recommendation[]>;
  getRecommendationById(id: string): Promise<Recommendation | undefined>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  getRecommendationsByVillage(village: string): Promise<Recommendation[]>;
  getRecommendationsByPriority(priority: string): Promise<Recommendation[]>;
  
  // Villages
  getVillages(): Promise<Village[]>;
  getVillageById(id: string): Promise<Village | undefined>;
  createVillage(village: InsertVillage): Promise<Village>;
  getVillagesByDistrict(district: string): Promise<Village[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with mock data on first startup
    this.initializeMockDataIfEmpty();
  }

  private async initializeMockDataIfEmpty() {
    try {
      // Check if data already exists
      const existingVillages = await db.select().from(villages).limit(1);
      if (existingVillages.length > 0) {
        return; // Data already exists, skip initialization
      }

      // Insert mock villages
      await db.insert(villages).values([
        {
          name: "Gondia",
          district: "Gondia",
          tehsil: "Arjuni",
          population: 15420,
          tribalPopulation: 12000,
          waterIndex: "6.5",
          developmentIndex: "7.2",
          latitude: "21.1558",
          longitude: "79.0882",
          boundaries: '{"type":"Polygon","coordinates":[[[79.0782,21.1558],[79.0982,21.1558],[79.0982,21.1358],[79.0782,21.1358],[79.0782,21.1558]]]}',
        },
        {
          name: "Arjuni",
          district: "Gondia", 
          tehsil: "Arjuni",
          population: 12340,
          tribalPopulation: 9800,
          waterIndex: "5.8",
          developmentIndex: "6.8",
          latitude: "21.1458",
          longitude: "79.1082",
          boundaries: '{"type":"Polygon","coordinates":[[[79.1082,21.1458],[79.1282,21.1458],[79.1282,21.1258],[79.1082,21.1258],[79.1082,21.1458]]]}',
        }
      ]);

      // Insert mock FRA claims
      await db.insert(fraClaims).values([
        {
          pattalHolderName: "Ramesh Kumar Bhuriya",
          fatherName: "Govind Bhuriya",
          village: "Gondia",
          district: "Gondia",
          tehsil: "Arjuni", 
          tribe: "Gond",
          totalArea: "2.50",
          surveyNumber: "124/3A",
          landType: "Agricultural + Forest",
          status: "granted",
          issueDate: new Date("2023-08-15"),
          documentType: "Forest Rights Patta",
          latitude: "21.1508",
          longitude: "79.0882",
        },
        {
          pattalHolderName: "Priya Tekam",
          fatherName: "Suresh Tekam",
          village: "Arjuni",
          district: "Gondia",
          tehsil: "Arjuni",
          tribe: "Gond",
          totalArea: "1.80",
          surveyNumber: "87/2B", 
          landType: "Agricultural",
          status: "pending",
          issueDate: null,
          documentType: "Forest Rights Patta",
          latitude: "21.1408",
          longitude: "79.0982",
        }
      ]);

      // Insert mock assets
      await db.insert(assets).values([
        {
          name: "Village Pond 1",
          type: "pond",
          village: "Gondia",
          district: "Gondia",
          latitude: "21.1458",
          longitude: "79.0832",
          description: "Primary water source for irrigation",
        },
        {
          name: "Cooperative Farm",
          type: "farm",
          village: "Arjuni",
          district: "Gondia",
          latitude: "21.1358",
          longitude: "79.0932",
          description: "Community agricultural land",
        }
      ]);

      // Insert mock recommendations
      await db.insert(recommendations).values([
        {
          schemeName: "Jal Jeevan Mission",
          schemeType: "jal_jeevan",
          priority: "high",
          village: "Gondia",
          district: "Gondia",
          description: "Low water index detected. Immediate water infrastructure development recommended.",
          eligibleBeneficiaries: 856,
          estimatedBudget: "125000.00",
          isActive: true,
        },
        {
          schemeName: "PM-Kisan Scheme",
          schemeType: "pm_kisan",
          priority: "medium",
          village: "Arjuni", 
          district: "Gondia",
          description: "Agricultural land identified without active scheme enrollment.",
          eligibleBeneficiaries: 234,
          estimatedBudget: "468000.00",
          isActive: true,
        }
      ]);

    } catch (error) {
      console.error("Error initializing mock data:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Validate password strength
    if (!AuthUtils.validatePasswordStrength(insertUser.password)) {
      throw new Error("Password must be at least 8 characters long and contain uppercase, lowercase, and number");
    }
    
    // Hash password before storing
    const hashedPassword = await AuthUtils.hashPassword(insertUser.password);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword
      })
      .returning();
    return user;
  }

  // FRA Claims methods
  async getFraClaims(): Promise<FraClaim[]> {
    return await db.select().from(fraClaims);
  }

  async getFraClaimById(id: string): Promise<FraClaim | undefined> {
    const [claim] = await db.select().from(fraClaims).where(eq(fraClaims.id, id));
    return claim || undefined;
  }

  async createFraClaim(claim: InsertFraClaim): Promise<FraClaim> {
    const [newClaim] = await db
      .insert(fraClaims)
      .values(claim)
      .returning();
    return newClaim;
  }

  async updateFraClaimStatus(id: string, status: string): Promise<FraClaim | undefined> {
    // Validate status is a valid enum value
    const validStatuses = ["pending", "granted", "rejected", "under_review"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`);
    }
    
    const [updatedClaim] = await db
      .update(fraClaims)
      .set({ status: status as "pending" | "granted" | "rejected" | "under_review" })
      .where(eq(fraClaims.id, id))
      .returning();
    return updatedClaim || undefined;
  }

  async getFraClaimsByVillage(village: string): Promise<FraClaim[]> {
    return await db.select().from(fraClaims).where(eq(fraClaims.village, village));
  }

  async getFraClaimsByStatus(status: string): Promise<FraClaim[]> {
    return await db.select().from(fraClaims).where(eq(fraClaims.status, status as "pending" | "granted" | "rejected" | "under_review"));
  }

  // Assets methods
  async getAssets(): Promise<Asset[]> {
    return await db.select().from(assets);
  }

  async getAssetById(id: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset || undefined;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db
      .insert(assets)
      .values(asset)
      .returning();
    return newAsset;
  }

  async getAssetsByVillage(village: string): Promise<Asset[]> {
    return await db.select().from(assets).where(eq(assets.village, village));
  }

  async getAssetsByType(type: string): Promise<Asset[]> {
    return await db.select().from(assets).where(eq(assets.type, type as "pond" | "farm" | "forest" | "settlement"));
  }

  // Recommendations methods
  async getRecommendations(): Promise<Recommendation[]> {
    return await db.select().from(recommendations);
  }

  async getRecommendationById(id: string): Promise<Recommendation | undefined> {
    const [recommendation] = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return recommendation || undefined;
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const [newRec] = await db
      .insert(recommendations)
      .values(recommendation)
      .returning();
    return newRec;
  }

  async getRecommendationsByVillage(village: string): Promise<Recommendation[]> {
    return await db.select().from(recommendations).where(eq(recommendations.village, village));
  }

  async getRecommendationsByPriority(priority: string): Promise<Recommendation[]> {
    return await db.select().from(recommendations).where(eq(recommendations.priority, priority as "high" | "medium" | "low"));
  }

  // Villages methods
  async getVillages(): Promise<Village[]> {
    return await db.select().from(villages);
  }

  async getVillageById(id: string): Promise<Village | undefined> {
    const [village] = await db.select().from(villages).where(eq(villages.id, id));
    return village || undefined;
  }

  async createVillage(village: InsertVillage): Promise<Village> {
    const [newVillage] = await db
      .insert(villages)
      .values(village)
      .returning();
    return newVillage;
  }

  async getVillagesByDistrict(district: string): Promise<Village[]> {
    return await db.select().from(villages).where(eq(villages.district, district));
  }
}

export const storage = new DatabaseStorage();