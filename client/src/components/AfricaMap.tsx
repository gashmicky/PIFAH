import { useState, useEffect, useRef } from "react";
import { Country, africaCountries, regionColors } from "@shared/africaData";
import { CountryTooltip } from "./CountryTooltip";

interface AfricaMapProps {
  onCountryClick: (country: Country) => void;
  searchQuery: string;
  viewMode: 'default' | 'region';
}

// Map SVG IDs to our country data (based on actual SVG IDs)
const svgIdToCountryId: Record<string, string> = {
  'Egypt': 'eg', 'Libya': 'ly', 'Tunisia': 'tn', 'Algeria': 'dz', 'Morocco': 'ma',
  'Sudan': 'sd', 'Eritrea': 'er', 'Somalia': 'so',
  'Ethiopia': 'et', 'Kenya': 'ke', 'Uganda': 'ug', 'Rwanda': 'rw', 'Burundi': 'bi',
  'Tanzania': 'tz', 'Mozambique': 'mz', 'Malawi': 'mw', 'Zambia': 'zm', 'Zimbabwe': 'zw',
  'Botswana': 'bw', 'Namibia': 'na', 'South-Africa': 'za', 'Lesotho': 'ls', 'Swaziland': 'sz',
  'Madagascar': 'mg', 'Democratic-Republic-of-Congo': 'cd', 'Congo': 'cg', 'Angola': 'ao', 'Gabon': 'ga',
  'Equitorial_Ginnea': 'gq', 'Cameroon': 'cm', 'Central-African-Republic': 'cf', 'Chad': 'td',
  'Niger': 'ne', 'Nigeria': 'ng', 'Benin': 'bj', 'Togo': 'tg', 'Ghana': 'gh',
  'Ivory_Coast': 'ci', 'Burkina_Faso': 'bf', 'Mali': 'ml', 'Mauritania': 'mr',
  'Senegal': 'sn', 'Gambia-Bissau': 'gw', 'Guinea': 'gn', 'Guinea_1_': 'gn',
  'Sierra-Leone': 'sl', 'Liberia': 'lr', 'Western-Sahara': 'eh',
  'Cabinda': 'ao', 'Zanzibar': 'tz'
};

export function AfricaMap({ onCountryClick, searchQuery, viewMode }: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState<string>("");
  const svgRef = useRef<HTMLDivElement>(null);

  const filteredCountries = africaCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetch('/africa-map.svg')
      .then(response => response.text())
      .then(data => setSvgContent(data))
      .catch(err => console.error('Error loading map:', err));
  }, []);

  useEffect(() => {
    if (!svgRef.current || !svgContent) return;

    const svgElement = svgRef.current.querySelector('svg');
    if (!svgElement) return;

    const paths = svgElement.querySelectorAll('path[id]');
    
    const cleanupFunctions: (() => void)[] = [];

    paths.forEach((pathElement) => {
      const path = pathElement as SVGPathElement;
      const svgId = path.id;
      const countryId = svgIdToCountryId[svgId];
      const country = africaCountries.find(c => c.id === countryId);
      
      if (!country) return;

      const isHighlighted = !searchQuery || 
        filteredCountries.some(c => c.id === country.id);

      // Set colors
      const fillColor = viewMode === 'region' 
        ? regionColors[country.region]
        : 'hsl(var(--muted))';
      
      path.setAttribute('fill', fillColor);
      path.setAttribute('stroke', 'hsl(var(--border))');
      path.setAttribute('stroke-width', '0.5');
      path.style.opacity = isHighlighted ? '1' : '0.3';
      path.style.cursor = isHighlighted ? 'pointer' : 'default';
      path.style.transition = 'all 0.3s ease';

      // Event listeners
      const handleMouseEnter = () => {
        if (isHighlighted) {
          setHoveredCountry(country);
          path.style.filter = 'brightness(1.3)';
        }
      };

      const handleMouseLeave = () => {
        setHoveredCountry(null);
        path.style.filter = 'none';
      };

      const handleClick = () => {
        if (isHighlighted) {
          onCountryClick(country);
        }
      };

      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('click', handleClick);

      cleanupFunctions.push(() => {
        path.removeEventListener('mouseenter', handleMouseEnter);
        path.removeEventListener('mouseleave', handleMouseLeave);
        path.removeEventListener('click', handleClick);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [svgContent, searchQuery, viewMode, filteredCountries, onCountryClick]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-background flex items-center justify-center"
      onMouseMove={handleMouseMove}
      data-testid="map-container"
    >
      <div
        ref={svgRef}
        className="w-full h-full flex items-center justify-center p-8"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

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
