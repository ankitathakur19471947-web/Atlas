import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, FileText } from 'lucide-react';

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

interface SchemeRecommendationsProps {
  recommendations: Recommendation[];
}

export default function SchemeRecommendations({ recommendations }: SchemeRecommendationsProps) {
  const getSchemeColor = (schemeType: string) => {
    switch (schemeType) {
      case 'jal_jeevan':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'pm_kisan':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'mgnrega':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSchemeIcon = (schemeType: string) => {
    switch (schemeType) {
      case 'jal_jeevan':
        return '💧';
      case 'pm_kisan':
        return '🌾';
      case 'mgnrega':
        return '🌳';
      default:
        return '📋';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card data-testid="scheme-recommendations">
      <CardHeader>
        <CardTitle>AI-Powered Scheme Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recommendations available</p>
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className={`p-4 border rounded-lg ${getSchemeColor(recommendation.schemeType)}`}
                data-testid={`recommendation-${recommendation.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSchemeIcon(recommendation.schemeType)}</span>
                    <h3 className="font-semibold">{recommendation.schemeName}</h3>
                  </div>
                  <Badge variant={getPriorityVariant(recommendation.priority)} className="capitalize">
                    {recommendation.priority} Priority
                  </Badge>
                </div>
                
                <p className="text-sm mb-3 opacity-90">
                  {recommendation.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{recommendation.village}</span>
                    </div>
                    {recommendation.eligibleBeneficiaries && (
                      <span>{recommendation.eligibleBeneficiaries} eligible beneficiaries</span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="text-xs"
                    data-testid={`view-recommendation-${recommendation.id}`}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
