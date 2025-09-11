import { 
  type User, type InsertUser, 
  type FraClaim, type InsertFraClaim,
  type Asset, type InsertAsset,
  type Recommendation, type InsertRecommendation,
  type Village, type InsertVillage
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fraClaims: Map<string, FraClaim>;
  private assets: Map<string, Asset>;
  private recommendations: Map<string, Recommendation>;
  private villages: Map<string, Village>;

  constructor() {
    this.users = new Map();
    this.fraClaims = new Map();
    this.assets = new Map();
    this.recommendations = new Map();
    this.villages = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock Villages
    const mockVillages: Village[] = [
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      }
    ];

    // Mock FRA Claims
    const mockClaims: FraClaim[] = [
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      }
    ];

    // Mock Assets
    const mockAssets: Asset[] = [
      {
        id: randomUUID(),
        name: "Village Pond 1",
        type: "pond",
        village: "Gondia",
        district: "Gondia",
        latitude: "21.1458",
        longitude: "79.0832",
        description: "Primary water source for irrigation",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Cooperative Farm",
        type: "farm",
        village: "Arjuni",
        district: "Gondia",
        latitude: "21.1358",
        longitude: "79.0932",
        description: "Community agricultural land",
        createdAt: new Date(),
      }
    ];

    // Mock Recommendations
    const mockRecommendations: Recommendation[] = [
      {
        id: randomUUID(),
        schemeName: "Jal Jeevan Mission",
        schemeType: "jal_jeevan",
        priority: "high",
        village: "Gondia",
        district: "Gondia",
        description: "Low water index detected. Immediate water infrastructure development recommended.",
        eligibleBeneficiaries: 856,
        estimatedBudget: "125000.00",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        schemeName: "PM-Kisan Scheme",
        schemeType: "pm_kisan",
        priority: "medium",
        village: "Arjuni", 
        district: "Gondia",
        description: "Agricultural land identified without active scheme enrollment.",
        eligibleBeneficiaries: 234,
        estimatedBudget: "468000.00",
        isActive: true,
        createdAt: new Date(),
      }
    ];

    // Populate storage
    mockVillages.forEach(village => this.villages.set(village.id, village));
    mockClaims.forEach(claim => this.fraClaims.set(claim.id, claim));
    mockAssets.forEach(asset => this.assets.set(asset.id, asset));
    mockRecommendations.forEach(rec => this.recommendations.set(rec.id, rec));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // FRA Claims methods
  async getFraClaims(): Promise<FraClaim[]> {
    return Array.from(this.fraClaims.values());
  }

  async getFraClaimById(id: string): Promise<FraClaim | undefined> {
    return this.fraClaims.get(id);
  }

  async createFraClaim(claim: InsertFraClaim): Promise<FraClaim> {
    const id = randomUUID();
    const newClaim: FraClaim = { 
      ...claim, 
      id, 
      createdAt: new Date()
    };
    this.fraClaims.set(id, newClaim);
    return newClaim;
  }

  async updateFraClaimStatus(id: string, status: string): Promise<FraClaim | undefined> {
    const claim = this.fraClaims.get(id);
    if (claim) {
      claim.status = status;
      this.fraClaims.set(id, claim);
      return claim;
    }
    return undefined;
  }

  async getFraClaimsByVillage(village: string): Promise<FraClaim[]> {
    return Array.from(this.fraClaims.values()).filter(claim => claim.village === village);
  }

  async getFraClaimsByStatus(status: string): Promise<FraClaim[]> {
    return Array.from(this.fraClaims.values()).filter(claim => claim.status === status);
  }

  // Assets methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetById(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const newAsset: Asset = { 
      ...asset, 
      id, 
      createdAt: new Date()
    };
    this.assets.set(id, newAsset);
    return newAsset;
  }

  async getAssetsByVillage(village: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.village === village);
  }

  async getAssetsByType(type: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => asset.type === type);
  }

  // Recommendations methods
  async getRecommendations(): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values());
  }

  async getRecommendationById(id: string): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const newRec: Recommendation = { 
      ...recommendation, 
      id, 
      createdAt: new Date()
    };
    this.recommendations.set(id, newRec);
    return newRec;
  }

  async getRecommendationsByVillage(village: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(rec => rec.village === village);
  }

  async getRecommendationsByPriority(priority: string): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(rec => rec.priority === priority);
  }

  // Villages methods
  async getVillages(): Promise<Village[]> {
    return Array.from(this.villages.values());
  }

  async getVillageById(id: string): Promise<Village | undefined> {
    return this.villages.get(id);
  }

  async createVillage(village: InsertVillage): Promise<Village> {
    const id = randomUUID();
    const newVillage: Village = { 
      ...village, 
      id, 
      createdAt: new Date()
    };
    this.villages.set(id, newVillage);
    return newVillage;
  }

  async getVillagesByDistrict(district: string): Promise<Village[]> {
    return Array.from(this.villages.values()).filter(village => village.district === district);
  }
}

export const storage = new MemStorage();
