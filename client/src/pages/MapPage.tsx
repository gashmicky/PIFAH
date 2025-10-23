import { useState } from "react";
import { Link } from "wouter";
import { Globe, Settings, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Chatbot } from "@/components/Chatbot";
import { SearchBar } from "@/components/SearchBar";
import { MapLegend } from "@/components/MapLegend";
import { MapControls } from "@/components/MapControls";
import { AfricaMap } from "@/components/AfricaMap";
import { CountryDetailsPanel } from "@/components/CountryDetailsPanel";
import { Country } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

type ViewMode = 'default' | 'region';

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('region');
  const [zoom, setZoom] = useState(1);

  // Fetch app settings for logo
  const { data: settings } = useQuery<{
    id: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
  }>({
    queryKey: ['/api/settings'],
  });

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setZoom(1);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b px-4 flex items-center justify-between gap-4 bg-card flex-wrap">
        <div className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="PIFAH Logo" 
              className="h-12 w-auto max-w-[100px] md:h-14 md:max-w-[130px] object-contain"
              data-testid="img-logo-map"
            />
          ) : (
            <Globe className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-xl font-semibold">PIFAH</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search countries..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/submit-project">
            <Button variant="default" size="sm" data-testid="button-submit-project">
              <PlusCircle className="h-4 w-4 mr-2" />
              Submit Project
            </Button>
          </Link>
          <Button
            variant={viewMode === 'default' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('default')}
            data-testid="button-view-default"
          >
            Default
          </Button>
          <Button
            variant={viewMode === 'region' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('region')}
            data-testid="button-view-region"
          >
            Regions
          </Button>
          <Link href="/admin">
            <Button variant="ghost" size="sm" data-testid="button-admin">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = "/api/logout"}
            data-testid="button-logout"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <AfricaMap
            onCountryClick={setSelectedCountry}
            searchQuery={searchQuery}
            viewMode={viewMode}
          />

          <div className="absolute bottom-6 left-6 z-30">
            <MapLegend />
          </div>

          <div className="absolute bottom-6 right-6 z-30">
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
              zoom={zoom}
            />
          </div>
        </div>

        <div className="w-2/5 border-l bg-card overflow-y-auto">
          {selectedCountry ? (
            <CountryDetailsPanel
              country={selectedCountry}
              onClose={() => setSelectedCountry(null)}
              isStatic
            />
          ) : (
            <div className="p-6 h-full flex flex-col items-center justify-center text-center">
              <Globe className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a Country</h3>
              <p className="text-sm text-muted-foreground">
                Click on any country on the map to view detailed information
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot position="left" />
    </div>
  );
}
