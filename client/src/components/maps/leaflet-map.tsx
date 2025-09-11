import { useEffect, useRef } from 'react';

// Define interfaces for props
interface Village {
  id: string;
  name: string;
  district: string;
  boundaries?: string;
  population?: number;
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

interface VisibleLayers {
  villageBoundaries: boolean;
  fraGranted: boolean;
  fraPending: boolean;
  waterBodies: boolean;
  forestAreas: boolean;
}

interface LeafletMapProps {
  villages: Village[];
  fraClaims: FraClaim[];
  assets: Asset[];
  visibleLayers: VisibleLayers;
  'data-testid'?: string;
}

// We'll use a CDN approach for Leaflet since we can't import it as a module
declare global {
  interface Window {
    L: any;
  }
}

export default function LeafletMap({ villages, fraClaims, assets, visibleLayers }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<any>({});

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet dynamically if not already loaded
    const loadLeaflet = async () => {
      if (!window.L) {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapInstanceRef.current) return;

      const L = window.L;
      
      // Initialize map centered on Maharashtra tribal region
      mapInstanceRef.current = L.map(mapRef.current).setView([21.1458, 79.0882], 10);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Initialize layer groups
      layersRef.current = {
        villageBoundaries: L.layerGroup(),
        fraGranted: L.layerGroup(),
        fraPending: L.layerGroup(),
        waterBodies: L.layerGroup(),
        forestAreas: L.layerGroup(),
      };

      updateMapLayers();
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when data or visibility changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapLayers();
    }
  }, [villages, fraClaims, assets, visibleLayers]);

  const updateMapLayers = () => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing layers
    Object.values(layersRef.current).forEach((layer: any) => {
      layer.clearLayers();
      map.removeLayer(layer);
    });

    // Add village boundaries
    if (visibleLayers.villageBoundaries && villages.length > 0) {
      villages.forEach(village => {
        // Mock village boundary since we don't have real GeoJSON
        const bounds = L.latLngBounds([
          [21.1358 + Math.random() * 0.02, 79.0782 + Math.random() * 0.02],
          [21.1558 + Math.random() * 0.02, 79.0982 + Math.random() * 0.02]
        ]);
        
        const rectangle = L.rectangle(bounds, {
          color: 'hsl(100, 45%, 25%)',
          weight: 2,
          fillOpacity: 0.1
        });
        
        rectangle.bindPopup(`<strong>${village.name}</strong><br>Population: ${village.population || 'N/A'}`);
        layersRef.current.villageBoundaries.addLayer(rectangle);
      });
      map.addLayer(layersRef.current.villageBoundaries);
    }

    // Add FRA claims
    fraClaims.forEach(claim => {
      if (!claim.latitude || !claim.longitude) return;

      const lat = parseFloat(claim.latitude);
      const lng = parseFloat(claim.longitude);
      
      if (claim.status === 'granted' && visibleLayers.fraGranted) {
        const marker = L.circleMarker([lat, lng], {
          color: 'hsl(100, 45%, 25%)',
          fillColor: 'hsl(100, 45%, 25%)',
          fillOpacity: 0.8,
          radius: 8
        });
        
        marker.bindPopup(`
          <strong>FRA Claim - Granted</strong><br>
          Holder: ${claim.pattalHolderName}<br>
          Area: ${claim.totalArea} hectares<br>
          Village: ${claim.village}
        `);
        
        layersRef.current.fraGranted.addLayer(marker);
      } else if (claim.status === 'pending' && visibleLayers.fraPending) {
        const marker = L.circleMarker([lat, lng], {
          color: 'hsl(45, 85%, 45%)',
          fillColor: 'hsl(45, 85%, 45%)',
          fillOpacity: 0.8,
          radius: 8
        });
        
        marker.bindPopup(`
          <strong>FRA Claim - Pending</strong><br>
          Holder: ${claim.pattalHolderName}<br>
          Area: ${claim.totalArea} hectares<br>
          Village: ${claim.village}
        `);
        
        layersRef.current.fraPending.addLayer(marker);
      }
    });

    if (visibleLayers.fraGranted) map.addLayer(layersRef.current.fraGranted);
    if (visibleLayers.fraPending) map.addLayer(layersRef.current.fraPending);

    // Add assets
    assets.forEach(asset => {
      const lat = parseFloat(asset.latitude);
      const lng = parseFloat(asset.longitude);
      
      const assetIcons = {
        'pond': '💧',
        'farm': '🌾',
        'forest': '🌳',
        'settlement': '🏠'
      };

      if ((asset.type === 'pond' && visibleLayers.waterBodies) ||
          (asset.type === 'forest' && visibleLayers.forestAreas)) {
        
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: assetIcons[asset.type as keyof typeof assetIcons] || '📍',
            className: 'asset-marker',
            iconSize: [20, 20]
          })
        });
        
        marker.bindPopup(`<strong>${asset.name}</strong><br>Type: ${asset.type}<br>Village: ${asset.village}`);
        
        if (asset.type === 'pond') {
          layersRef.current.waterBodies.addLayer(marker);
        } else if (asset.type === 'forest') {
          layersRef.current.forestAreas.addLayer(marker);
        }
      }
    });

    if (visibleLayers.waterBodies) map.addLayer(layersRef.current.waterBodies);
    if (visibleLayers.forestAreas) map.addLayer(layersRef.current.forestAreas);
  };

  return (
    <div 
      ref={mapRef} 
      className="leaflet-container"
      data-testid="leaflet-map"
      style={{ height: '500px', width: '100%' }}
    />
  );
}
