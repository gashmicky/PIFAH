import { useState, useRef, useEffect } from "react";
import { Country, africaCountries, regionColors } from "@shared/africaData";
import { CountryTooltip } from "./CountryTooltip";
import { africaMapPaths } from "@shared/africaMapPaths";

interface AfricaMapProps {
  onCountryClick: (country: Country) => void;
  searchQuery: string;
  viewMode: 'default' | 'region';
}

export function AfricaMap({ onCountryClick, searchQuery, viewMode }: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const filteredCountries = africaCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(5, prev.scale * delta)),
    }));
  };

  const getCountryColor = (country: Country) => {
    if (viewMode === 'region') {
      return regionColors[country.region];
    }
    return 'hsl(var(--muted))';
  };

  const isHighlighted = (country: Country) => {
    if (!searchQuery) return true;
    return filteredCountries.some((c) => c.id === country.id);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-background cursor-move"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      data-testid="map-container"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        className="w-full h-full"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transition: isPanning ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {africaCountries.map((country) => {
          const path = africaMapPaths[country.id];
          if (!path) return null;

          const highlighted = isHighlighted(country);
          
          return (
            <path
              key={country.id}
              d={path}
              fill={getCountryColor(country)}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              className="transition-all duration-300 cursor-pointer hover-elevate"
              style={{
                opacity: highlighted ? 1 : 0.3,
                filter: hoveredCountry?.id === country.id
                  ? 'brightness(1.2) drop-shadow(0 0 8px rgba(100, 150, 255, 0.5))'
                  : 'none',
              }}
              onMouseEnter={() => highlighted && setHoveredCountry(country)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => highlighted && onCountryClick(country)}
              data-testid={`country-${country.id}`}
            />
          );
        })}
      </svg>

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

export { africaMapPaths };
