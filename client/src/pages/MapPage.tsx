import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { MapLegend } from "@/components/MapLegend";
import { MapControls } from "@/components/MapControls";
import { AfricaMap } from "@/components/AfricaMap";
import { CountryDetailsPanel } from "@/components/CountryDetailsPanel";
import { Country } from "@shared/africaData";

type ViewMode = 'default' | 'region';

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('region');
  const [zoom, setZoom] = useState(1);

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
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Interactive Africa Map</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search countries..."
          />
        </div>

        <div className="flex items-center gap-2">
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
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 relative">
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
      </main>

      {selectedCountry && (
        <CountryDetailsPanel
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
