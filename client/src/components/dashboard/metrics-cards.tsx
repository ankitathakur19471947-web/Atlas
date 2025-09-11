import { Card, CardContent } from '@/components/ui/card';
import { FileText, MapPin, Lightbulb, Home } from 'lucide-react';

interface DashboardStats {
  totalClaims: number;
  totalAssets: number;
  totalRecommendations: number;
  totalVillages: number;
}

interface MetricsCardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

export default function MetricsCards({ stats, isLoading }: MetricsCardsProps) {
  const metrics = [
    {
      title: 'FRA Claims',
      value: stats?.totalClaims || 0,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      growth: '+12%',
      testId: 'metric-fra-claims'
    },
    {
      title: 'Assets Mapped',
      value: stats?.totalAssets || 0,
      icon: MapPin,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      growth: '+8%',
      testId: 'metric-assets-mapped'
    },
    {
      title: 'Recommendations',
      value: stats?.totalRecommendations || 0,
      icon: Lightbulb,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      growth: '+24%',
      testId: 'metric-recommendations'
    },
    {
      title: 'Villages Active',
      value: stats?.totalVillages || 0,
      icon: Home,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      growth: '+5%',
      testId: 'metric-villages-active'
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.title} data-testid={metric.testId}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{metric.title}</p>
                  <p className="text-2xl font-bold">
                    {isLoading ? '...' : metric.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-green-600">{metric.growth}</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
