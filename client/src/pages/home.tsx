import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { FileText, Globe, Satellite, Brain } from "lucide-react";

interface DashboardStats {
  totalClaims: number;
  totalAssets: number;
  totalRecommendations: number;
  totalVillages: number;
}

export default function Home() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground tribal-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-lg">
              FRA Atlas & Decision Support System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 max-w-3xl mx-auto drop-shadow-md">
              Empowering tribal communities through digital documentation, intelligent mapping, and data-driven development strategies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/digitization">
                <Button className="bg-accent text-accent-foreground px-8 py-3 text-lg font-semibold hover:bg-accent/90 transition-colors" data-testid="button-start-digitization">
                  Start Digitization
                </Button>
              </Link>
              <Link href="/atlas">
                <Button variant="secondary" className="bg-primary-foreground text-primary px-8 py-3 text-lg font-semibold hover:bg-primary-foreground/90 transition-colors" data-testid="button-explore-atlas">
                  Explore Atlas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">Comprehensive Tribal Development Platform</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Integrating document digitization, GIS mapping, and AI-powered recommendations for sustainable tribal development
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link href="/digitization">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" data-testid="card-fra-digitization">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-primary text-xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">FRA Document Digitization</h3>
                <p className="text-muted-foreground">AI-powered OCR for converting physical FRA documents into digital records</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/atlas">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" data-testid="card-interactive-gis">
              <CardContent className="p-6">
                <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="text-secondary text-xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Interactive GIS Atlas</h3>
                <p className="text-muted-foreground">Comprehensive mapping of FRA claims, village boundaries, and tribal assets</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/atlas">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" data-testid="card-asset-mapping">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Satellite className="text-accent text-xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Asset Mapping</h3>
                <p className="text-muted-foreground">Satellite-based identification and mapping of natural and community assets</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer" data-testid="card-decision-support">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-primary text-xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Decision Support System</h3>
                <p className="text-muted-foreground">AI-driven recommendations for optimal development schemes and interventions</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div data-testid="stat-fra-claims">
              <div className="text-4xl font-bold text-primary mb-2">
                {isLoading ? "..." : stats?.totalClaims || 0}
              </div>
              <p className="text-muted-foreground">FRA Claims Processed</p>
            </div>
            <div data-testid="stat-villages-mapped">
              <div className="text-4xl font-bold text-secondary mb-2">
                {isLoading ? "..." : stats?.totalVillages || 0}
              </div>
              <p className="text-muted-foreground">Villages Mapped</p>
            </div>
            <div data-testid="stat-recommendations">
              <div className="text-4xl font-bold text-accent mb-2">
                {isLoading ? "..." : stats?.totalRecommendations || 0}
              </div>
              <p className="text-muted-foreground">Scheme Recommendations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">FRA Atlas & DSS</h3>
              <p className="text-primary-foreground/80 text-sm">
                Empowering tribal communities through technology-driven solutions for sustainable development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">API Reference</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Support</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-primary-foreground/80">
                <p>📧 support@fra-atlas.gov.in</p>
                <p>📞 +91 12345 67890</p>
                <p>📍 Ministry of Tribal Affairs, New Delhi</p>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2025 Government of India. SIH 2025 Prototype. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
