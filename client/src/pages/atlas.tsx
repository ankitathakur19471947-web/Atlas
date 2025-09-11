import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import LeafletMap from "@/components/maps/leaflet-map";
import { useQuery } from "@tanstack/react-query";
import { Expand, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Village {
  id: string;
  name: string;
  district: string;
  boundaries?: string;
}

interface FraClaim {
  id: string;
  pattalHolderName: string;
  village: string;
  status: string;
  totalArea: string;
  latitude?: string;
  longitude?: string;
}

interface Asset {
  id: string;
  name: string;
  type: string;
  village: string;
  latitude: string;
  longitude: string;
}

// State-District mapping for Indian states (focusing on FRA relevant states)
const stateDistrictMapping = {
  "maharashtra": {
    name: "Maharashtra",
    districts: ["gondia", "gadchiroli", "chandrapur", "wardha", "yavatmal", "amravati", "nanded"]
  },
  "madhya-pradesh": {
    name: "Madhya Pradesh", 
    districts: ["betul", "chhindwara", "seoni", "mandla", "dindori", "balaghat", "shahdol"]
  },
  "chhattisgarh": {
    name: "Chhattisgarh",
    districts: ["bastar", "dantewada", "sukma", "bijapur", "narayanpur", "kondagaon", "kanker"]
  },
  "odisha": {
    name: "Odisha",
    districts: ["mayurbhanj", "keonjhar", "sundargarh", "sambalpur", "koraput", "malkangiri", "rayagada"]
  },
  "jharkhand": {
    name: "Jharkhand",
    districts: ["ranchi", "gumla", "simdega", "lohardaga", "latehar", "palamau", "garhwa"]
  },
  "gujarat": {
    name: "Gujarat",
    districts: ["bharuch", "narmada", "tapi", "dang", "valsad", "navsari", "surat"]
  },
  "rajasthan": {
    name: "Rajasthan",
    districts: ["udaipur", "dungarpur", "banswara", "pratapgarh", "rajsamand", "sirohi", "pali"]
  },
  "andhra-pradesh": {
    name: "Andhra Pradesh",
    districts: ["visakhapatnam", "vizianagaram", "srikakulam", "east-godavari", "west-godavari", "krishna", "guntur"]
  },
  "telangana": {
    name: "Telangana",
    districts: ["adilabad", "komaram-bheem", "mancherial", "nirmal", "nizamabad", "jagtial", "rajanna-sircilla"]
  },
  "kerala": {
    name: "Kerala",
    districts: ["wayanad", "idukki", "palakkad", "malappuram", "kozhikode", "kannur", "kasaragod"]
  }
};

// District-Village mapping (sample villages for each district)
const districtVillageMapping: Record<string, string[]> = {
  // Maharashtra
  "gondia": ["Arjuni", "Morgaon", "Salekasa", "Sadak-Arjuni", "Goregaon", "Tirora", "Amgaon"],
  "gadchiroli": ["Aheri", "Armori", "Bhamragad", "Chamorshi", "Desaiganj", "Dhanora", "Etapalli"],
  "chandrapur": ["Ballarpur", "Bramhapuri", "Chimur", "Corbett", "Gondpipri", "Jivati", "Mul"],
  "wardha": ["Arvi", "Ashti", "Deoli", "Hinganghat", "Karanja", "Samudrapur", "Seloo"],
  "yavatmal": ["Arni", "Babhulgaon", "Darwha", "Digras", "Ghatanji", "Kalamb", "Kelapur"],
  "amravati": ["Achalpur", "Anjangaon", "Bhatkuli", "Chandur", "Dharni", "Dhamangaon", "Morshi"],
  "nanded": ["Ardhapur", "Bhokar", "Degloor", "Dharmabad", "Hadgaon", "Himayatnagar", "Kandhar"],
  
  // Madhya Pradesh
  "betul": ["Amla", "Bhainsdehi", "Chicholi", "Ghoradongri", "Multai", "Prabhat-Pattan", "Shahpur"],
  "chhindwara": ["Amarwara", "Bichhiya", "Chourai", "Harrai", "Junnardeo", "Mohkhed", "Pandhurna"],
  "seoni": ["Barghat", "Dhobani", "Ghansour", "Kurai", "Lakhnadon", "Mandla", "Ukwa"],
  "mandla": ["Bijadandi", "Ghughari", "Mohgaon", "Narayanganj", "Nainpur", "Narayanpur", "Niwas"],
  "dindori": ["Amarpur", "Bajag", "Karanjia", "Mehandwani", "Samnapur", "Shahpura", "Bajag"],
  "balaghat": ["Baihar", "Birsa", "Katangi", "Khairlanji", "Lalbarra", "Paraswada", "Waraseoni"],
  "shahdol": ["Beohari", "Budhar", "Jaisinghnagar", "Jaitpur", "Sohagpur", "Burhar", "Gohparu"],
  
  // Chhattisgarh
  "bastar": ["Bakawand", "Bastanar", "Darbha", "Jagdalpur", "Kondagaon", "Lohandiguda", "Tokapal"],
  "dantewada": ["Barsoor", "Dantewada", "Geedam", "Katekalyan", "Kuakonda", "Sukma", "Bhansi"],
  "sukma": ["Chintagufa", "Dornapal", "Errabore", "Jagargunda", "Kistaram", "Konta", "Sukma"],
  "bijapur": ["Awapalli", "Basaguda", "Bhairamgarh", "Bijapur", "Gangaloor", "Mirtur", "Usoor"],
  "narayanpur": ["Abujhmad", "Chhote-Bethiya", "Kohkameta", "Narayanpur", "Orchha", "Pharasgaon", "Sonpur"],
  "kondagaon": ["Baderajpur", "Farasgaon", "Kondagaon", "Makdi", "Pharasgaon", "Bakulwara", "Keskal"],
  "kanker": ["Antagarh", "Bhanupratappur", "Charama", "Kanker", "Koyalibeda", "Narharpur", "Pakhanjur"],
  
  // Add other states as needed...
  "mayurbhanj": ["Badasahi", "Baripada", "Bijatala", "Gopabandhu", "Jashipur", "Karanjia", "Kuliana"],
  "keonjhar": ["Anandapur", "Banspal", "Barbil", "Champua", "Ghatgaon", "Harichandanpur", "Jhumpura"],
  "sundargarh": ["Balisankara", "Bargaon", "Bisra", "Bonai", "Gurundia", "Hemgir", "Kutra"],
  
  // Default for any missing districts
  "default": ["Village A", "Village B", "Village C", "Village D", "Village E"]
};

export default function Atlas() {
  const [selectedState, setSelectedState] = useState<string>("maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("gondia");
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [visibleLayers, setVisibleLayers] = useState({
    villageBoundaries: true,
    fraGranted: true,
    fraPending: true,
    waterBodies: true,
    forestAreas: true,
  });

  const { toast } = useToast();

  const { data: villages } = useQuery<Village[]>({
    queryKey: ["/api/villages"],
  });

  const { data: fraClaims } = useQuery<FraClaim[]>({
    queryKey: ["/api/fra-claims"],
  });

  const { data: assets } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  interface DashboardStats {
    totalClaims: number;
    totalAssets: number;
    totalVillages: number;
  }

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const handleLayerToggle = (layerName: string) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName as keyof typeof prev]
    }));
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    // Reset district and village when state changes
    const firstDistrict = stateDistrictMapping[state as keyof typeof stateDistrictMapping]?.districts[0] || "gondia";
    setSelectedDistrict(firstDistrict);
    setSelectedVillage("all");
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    // Reset village when district changes
    setSelectedVillage("all");
  };

  // Get available districts for selected state
  const availableDistricts = stateDistrictMapping[selectedState as keyof typeof stateDistrictMapping]?.districts || [];
  
  // Get available villages for selected district
  const availableVillages = districtVillageMapping[selectedDistrict] || districtVillageMapping["default"];

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Map data export functionality would be implemented here.",
    });
  };

  const handleFullscreen = () => {
    toast({
      title: "Fullscreen",
      description: "Fullscreen map functionality would be implemented here.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-4">FRA Atlas - Interactive WebGIS Portal</h1>
        <p className="text-muted-foreground text-lg">Explore village boundaries, FRA claims, and community assets through our interactive mapping platform</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Controls Panel */}
        <Card data-testid="map-controls-panel">
          <CardHeader>
            <CardTitle>Map Layers</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Layer Controls */}
            <div className="space-y-4">
              <div className="space-y-3">
                {Object.entries(visibleLayers).map(([key, checked]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="flex items-center space-x-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleLayerToggle(key)}
                        data-testid={`layer-${key}`}
                      />
                      <span className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </Label>
                    <div className={`w-4 h-4 rounded ${
                      key === 'villageBoundaries' ? 'border-2 border-primary' :
                      key === 'fraGranted' ? 'bg-primary rounded-full' :
                      key === 'fraPending' ? 'bg-accent rounded-full' :
                      key === 'waterBodies' ? 'bg-blue-500' :
                      'bg-green-600'
                    }`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Geographic Filters</h3>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">State</Label>
                <Select value={selectedState} onValueChange={handleStateChange} data-testid="select-state">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stateDistrictMapping).map(([key, state]) => (
                      <SelectItem key={key} value={key}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">District</Label>
                <Select value={selectedDistrict} onValueChange={handleDistrictChange} data-testid="select-district">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map(district => (
                      <SelectItem key={district} value={district}>
                        {district.charAt(0).toUpperCase() + district.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">Village</Label>
                <Select value={selectedVillage} onValueChange={setSelectedVillage} data-testid="select-village">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Villages</SelectItem>
                    {availableVillages.map(village => (
                      <SelectItem key={village} value={village.toLowerCase()}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">Claim Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus} data-testid="select-status">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="granted">Granted</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Asset Legend</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">💧</span>
                  <span>Ponds/Water Bodies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🌾</span>
                  <span>Farms/Agricultural Land</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-800">🌳</span>
                  <span>Forest Patches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">🏠</span>
                  <span>Settlements</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interactive Map View</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleFullscreen} data-testid="button-fullscreen">
                    <Expand className="mr-1 h-4 w-4" />
                    Fullscreen
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-lg overflow-hidden border">
                <LeafletMap
                  villages={villages || []}
                  fraClaims={fraClaims || []}
                  assets={assets || []}
                  visibleLayers={visibleLayers}
                  data-testid="leaflet-map"
                />
              </div>
            </CardContent>
          </Card>

          {/* Map Statistics */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="text-center" data-testid="stat-total-claims">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {stats?.totalClaims || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total FRA Claims</p>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="stat-mapped-assets">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent mb-1">
                  {stats?.totalAssets || 0}
                </div>
                <p className="text-sm text-muted-foreground">Mapped Assets</p>
              </CardContent>
            </Card>
            
            <Card className="text-center" data-testid="stat-villages-covered">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {stats?.totalVillages || 0}
                </div>
                <p className="text-sm text-muted-foreground">Villages Covered</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
