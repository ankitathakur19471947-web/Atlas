import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFraClaimSchema, 
  insertAssetSchema, 
  insertRecommendationSchema,
  claimStatusSchema 
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { createWorker } from "tesseract.js";

// Define the extended Request interface for multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed'));
    }
  },
});

// OCR text processing utility
function extractFRADataFromText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Initialize default data
  const extractedData = {
    documentType: "Forest Rights Patta",
    issueDate: "",
    district: "",
    tehsil: "",
    pattalHolderName: "",
    fatherName: "",
    village: "",
    tribe: "",
    totalArea: "",
    surveyNumber: "",
    landType: "",
    status: "pending"
  };

  // Extract data using patterns and keywords
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
    
    // Look for key patterns in FRA documents
    if (line.includes('patta holder') || line.includes('name')) {
      if (nextLine && !nextLine.toLowerCase().includes('father')) {
        extractedData.pattalHolderName = nextLine;
      }
    }
    
    if (line.includes('father') || line.includes('s/o')) {
      if (nextLine) {
        extractedData.fatherName = nextLine;
      }
    }
    
    if (line.includes('village')) {
      if (nextLine) {
        extractedData.village = nextLine;
      }
    }
    
    if (line.includes('district')) {
      if (nextLine) {
        extractedData.district = nextLine;
      }
    }
    
    if (line.includes('tehsil') || line.includes('taluka')) {
      if (nextLine) {
        extractedData.tehsil = nextLine;
      }
    }
    
    if (line.includes('tribe') || line.includes('community')) {
      if (nextLine) {
        extractedData.tribe = nextLine;
      }
    }
    
    if (line.includes('area') || line.includes('hectare') || line.includes('acre')) {
      // Look for area values
      const areaMatch = line.match(/(\d+\.?\d*)\s*(hectare|acre|ha)/i);
      if (areaMatch) {
        extractedData.totalArea = areaMatch[1];
      } else if (nextLine) {
        const nextAreaMatch = nextLine.match(/(\d+\.?\d*)/);
        if (nextAreaMatch) {
          extractedData.totalArea = nextAreaMatch[1];
        }
      }
    }
    
    if (line.includes('survey') || line.includes('khasra')) {
      const surveyMatch = line.match(/(\d+\/?\d*[a-z]*)/i);
      if (surveyMatch) {
        extractedData.surveyNumber = surveyMatch[1];
      }
    }
    
    // Date patterns
    const dateMatch = line.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (dateMatch) {
      extractedData.issueDate = dateMatch[1];
    }
    
    // Land type detection
    if (line.includes('agricultural') || line.includes('forest') || line.includes('cultivable')) {
      if (line.includes('agricultural') && line.includes('forest')) {
        extractedData.landType = "Agricultural + Forest";
      } else if (line.includes('agricultural')) {
        extractedData.landType = "Agricultural";
      } else if (line.includes('forest')) {
        extractedData.landType = "Forest";
      }
    }
  }
  
  return extractedData;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // FRA Claims routes
  app.get("/api/fra-claims", async (req, res) => {
    try {
      const claims = await storage.getFraClaims();
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FRA claims" });
    }
  });

  app.get("/api/fra-claims/village/:village", async (req, res) => {
    try {
      const { village } = req.params;
      const claims = await storage.getFraClaimsByVillage(village);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FRA claims by village" });
    }
  });

  app.get("/api/fra-claims/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const claims = await storage.getFraClaimsByStatus(status);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FRA claims by status" });
    }
  });

  app.post("/api/fra-claims", async (req, res) => {
    try {
      const validatedData = insertFraClaimSchema.parse(req.body);
      const newClaim = await storage.createFraClaim(validatedData);
      res.status(201).json(newClaim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create FRA claim" });
      }
    }
  });

  app.patch("/api/fra-claims/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate status with zod enum
      const statusValidation = claimStatusSchema.safeParse(req.body.status);
      if (!statusValidation.success) {
        return res.status(400).json({ 
          message: "Invalid status", 
          errors: statusValidation.error.errors 
        });
      }

      const updatedClaim = await storage.updateFraClaimStatus(id, statusValidation.data);
      if (!updatedClaim) {
        return res.status(404).json({ message: "FRA claim not found" });
      }

      res.json(updatedClaim);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid status")) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update FRA claim status" });
      }
    }
  });

  // Assets routes
  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/village/:village", async (req, res) => {
    try {
      const { village } = req.params;
      const assets = await storage.getAssetsByVillage(village);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets by village" });
    }
  });

  app.get("/api/assets/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const assets = await storage.getAssetsByType(type);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets by type" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      const newAsset = await storage.createAsset(validatedData);
      res.status(201).json(newAsset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create asset" });
      }
    }
  });

  // Recommendations routes
  app.get("/api/recommendations", async (req, res) => {
    try {
      const recommendations = await storage.getRecommendations();
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.get("/api/recommendations/village/:village", async (req, res) => {
    try {
      const { village } = req.params;
      const recommendations = await storage.getRecommendationsByVillage(village);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations by village" });
    }
  });

  app.get("/api/recommendations/priority/:priority", async (req, res) => {
    try {
      const { priority } = req.params;
      const recommendations = await storage.getRecommendationsByPriority(priority);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations by priority" });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const validatedData = insertRecommendationSchema.parse(req.body);
      const newRecommendation = await storage.createRecommendation(validatedData);
      res.status(201).json(newRecommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create recommendation" });
      }
    }
  });

  // Villages routes
  app.get("/api/villages", async (req, res) => {
    try {
      const villages = await storage.getVillages();
      res.json(villages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch villages" });
    }
  });

  app.get("/api/villages/district/:district", async (req, res) => {
    try {
      const { district } = req.params;
      const villages = await storage.getVillagesByDistrict(district);
      res.json(villages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch villages by district" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const fraClaims = await storage.getFraClaims();
      const assets = await storage.getAssets();
      const recommendations = await storage.getRecommendations();
      const villages = await storage.getVillages();

      const stats = {
        totalClaims: fraClaims.length,
        grantedClaims: fraClaims.filter(c => c.status === 'granted').length,
        pendingClaims: fraClaims.filter(c => c.status === 'pending').length,
        rejectedClaims: fraClaims.filter(c => c.status === 'rejected').length,
        underReviewClaims: fraClaims.filter(c => c.status === 'under_review').length,
        totalAssets: assets.length,
        assetsByType: {
          pond: assets.filter(a => a.type === 'pond').length,
          farm: assets.filter(a => a.type === 'farm').length,
          forest: assets.filter(a => a.type === 'forest').length,
          settlement: assets.filter(a => a.type === 'settlement').length,
        },
        totalRecommendations: recommendations.length,
        activeRecommendations: recommendations.filter(r => r.isActive).length,
        recommendationsByPriority: {
          high: recommendations.filter(r => r.priority === 'high').length,
          medium: recommendations.filter(r => r.priority === 'medium').length,
          low: recommendations.filter(r => r.priority === 'low').length,
        },
        totalVillages: villages.length,
        villagesByDistrict: villages.reduce((acc: Record<string, number>, village) => {
          acc[village.district] = (acc[village.district] || 0) + 1;
          return acc;
        }, {}),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Real OCR endpoint for document digitization using Tesseract.js
  app.post("/api/digitize-document", upload.single('document'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded" 
        });
      }

      console.log(`Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes`);

      // Create a Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: m => console.log(m) // Enable logging for debugging
      });

      try {
        // Perform OCR on the uploaded file
        const { data: { text } } = await worker.recognize(req.file.buffer);
        
        console.log("Extracted text:", text);

        // Extract structured data from the OCR text
        const extractedData = extractFRADataFromText(text);
        
        // If no meaningful data was extracted, provide helpful feedback
        if (!extractedData.pattalHolderName && !extractedData.village && !extractedData.district) {
          return res.json({
            success: false,
            message: "Could not extract FRA document data. Please ensure the image is clear and contains FRA document text.",
            rawText: text.substring(0, 500) // First 500 chars for debugging
          });
        }

        await worker.terminate();

        res.json({ 
          success: true, 
          extractedData,
          message: "Document processed successfully using OCR",
          confidence: "Real OCR extraction completed"
        });

      } catch (ocrError) {
        await worker.terminate();
        console.error("OCR processing error:", ocrError);
        res.status(500).json({ 
          success: false, 
          message: "OCR processing failed. Please try with a clearer image."
        });
      }

    } catch (error) {
      console.error("Document processing error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process document"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
