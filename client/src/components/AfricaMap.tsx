import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Country, africaCountries, regionColors } from "@shared/africaData";
import { CountryTooltip } from "./CountryTooltip";

interface AfricaMapProps {
  onCountryClick: (country: Country) => void;
  searchQuery: string;
  viewMode: 'default' | 'region';
}

// Using unpkg CDN for world atlas data (will filter to show only Africa)
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-50m.json";

export function AfricaMap({ onCountryClick, searchQuery, viewMode }: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [20, 0], zoom: 1 });

  const filteredCountries = africaCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getCountryData = (geoId: string): Country | undefined => {
    // Map ISO2 codes to our country IDs
    const isoMap: Record<string, string> = {
      'DZ': 'dz', 'AO': 'ao', 'BJ': 'bj', 'BW': 'bw', 'BF': 'bf',
      'BI': 'bi', 'CM': 'cm', 'CV': 'cv', 'CF': 'cf', 'TD': 'td',
      'KM': 'km', 'CG': 'cg', 'CD': 'cd', 'CI': 'ci', 'DJ': 'dj',
      'EG': 'eg', 'GQ': 'gq', 'ER': 'er', 'SZ': 'sz', 'ET': 'et',
      'GA': 'ga', 'GM': 'gm', 'GH': 'gh', 'GN': 'gn', 'GW': 'gw',
      'KE': 'ke', 'LS': 'ls', 'LR': 'lr', 'LY': 'ly', 'MG': 'mg',
      'MW': 'mw', 'ML': 'ml', 'MR': 'mr', 'MU': 'mu', 'MA': 'ma',
      'MZ': 'mz', 'NA': 'na', 'NE': 'ne', 'NG': 'ng', 'RW': 'rw',
      'ST': 'st', 'SN': 'sn', 'SC': 'sc', 'SL': 'sl', 'SO': 'so',
      'ZA': 'za', 'SS': 'ss', 'SD': 'sd', 'TZ': 'tz', 'TG': 'tg',
      'TN': 'tn', 'UG': 'ug', 'ZM': 'zm', 'ZW': 'zw', 'EH': 'eh'
    };
    
    const countryId = isoMap[geoId];
    return africaCountries.find((c) => c.id === countryId);
  };

  const getCountryColor = (country: Country | undefined) => {
    if (!country) return 'hsl(var(--muted))';
    if (viewMode === 'region') {
      return regionColors[country.region];
    }
    return 'hsl(var(--muted))';
  };

  const isHighlighted = (country: Country | undefined) => {
    if (!country) return false;
    if (!searchQuery) return true;
    return filteredCountries.some((c) => c.id === country.id);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      data-testid="map-container"
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 400,
          center: [20, 5]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={(position) => setPosition(position)}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryData = getCountryData(geo.properties.ISO_A2);
                const highlighted = isHighlighted(countryData);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(countryData)}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                        opacity: highlighted ? 1 : 0.3,
                      },
                      hover: {
                        outline: 'none',
                        opacity: highlighted ? 1 : 0.3,
                        filter: highlighted ? 'brightness(1.2)' : 'none',
                        cursor: highlighted ? 'pointer' : 'default',
                      },
                      pressed: {
                        outline: 'none',
                        opacity: highlighted ? 1 : 0.3,
                      },
                    }}
                    onMouseEnter={() => {
                      if (highlighted && countryData) {
                        setHoveredCountry(countryData);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
                    onClick={() => {
                      if (highlighted && countryData) {
                        onCountryClick(countryData);
                      }
                    }}
                    data-testid={countryData ? `country-${countryData.id}` : undefined}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hoveredCountry && (
        <CountryTooltip
          country={hoveredCountry}
          x={mousePosition.x}
          y={mousePosition.y}
        />
      )}
    </div>
  );
}
