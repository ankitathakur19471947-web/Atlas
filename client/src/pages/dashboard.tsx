import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/dashboard/metrics-cards";
import SchemeRecommendations from "@/components/dashboard/scheme-recommendations";
import FraClaimsChart from "@/components/charts/fra-claims-chart";
import DevelopmentChart from "@/components/charts/development-chart";
import { FileText, MapPin, Lightbulb, Clock } from "lucide-react";

interface DashboardStats {
  totalClaims: number;
  grantedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
  underReviewClaims: number;
  totalAssets: number;
  totalRecommendations: number;
  activeRecommendations: number;
  totalVillages: number;
}

interface Recommendation {
  id: string;
  schemeName: string;
  schemeType: string;
  priority: string;
  village: string;
  description: string;
  eligibleBeneficiaries?: number;
  createdAt: string;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recommendations } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  // Mock recent activity for demonstration
  const recentActivity = [
    {
      id: "1",
      type: "document",
      title: "New FRA document digitized",
      description: "Village Gondia - Ramesh Kumar Bhuriya - 2.5 hectares",
      time: "2 hours ago",
      icon: FileText,
    },
    {
      id: "2",
      type: "mapping",
      title: "Asset mapping completed",
      description: "Village Arjuni - 5 new water bodies identified",
      time: "4 hours ago",
      icon: MapPin,
    },
    {
      id: "3",
      type: "recommendation",
      title: "New scheme recommendation generated",
      description: "Jal Jeevan Mission recommended for 3 villages",
      time: "6 hours ago",
      icon: Lightbulb,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-4">Decision Support System Dashboard</h1>
        <p className="text-muted-foreground text-lg">AI-powered analytics and scheme recommendations for optimal tribal development</p>
      </div>

      {/* Key Metrics */}
      <MetricsCards stats={stats} isLoading={statsLoading} />

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {/* Scheme Recommendations */}
        <SchemeRecommendations recommendations={recommendations || []} />

        {/* Analytics Charts */}
        <div className="space-y-6">
          {/* FRA Claims Chart */}
          <Card data-testid="card-fra-claims-chart">
            <CardHeader>
              <CardTitle>FRA Claims Status</CardTitle>
            </CardHeader>
            <CardContent>
              <FraClaimsChart stats={stats} />
            </CardContent>
          </Card>

          {/* Village Development Index */}
          <Card data-testid="card-development-chart">
            <CardHeader>
              <CardTitle>Village Development Index</CardTitle>
            </CardHeader>
            <CardContent>
              <DevelopmentChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8" data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center p-3 bg-muted/20 rounded-md"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.type === 'document' ? 'bg-primary/10' :
                    activity.type === 'mapping' ? 'bg-secondary/10' :
                    'bg-accent/10'
                  }`}>
                    <IconComponent className={`text-sm ${
                      activity.type === 'document' ? 'text-primary' :
                      activity.type === 'mapping' ? 'text-secondary' :
                      'text-accent'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
