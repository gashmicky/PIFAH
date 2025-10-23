import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";
import { CountryTooltip } from "./CountryTooltip";
import africaMapSvg from "@/assets/africa-map.svg?raw";

interface AfricaMapProps {
  onCountryClick: (country: Country) => void;
  searchQuery: string;
  viewMode: 'default' | 'region';
  zoom?: number;
}

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

export function AfricaMap({ onCountryClick, searchQuery, viewMode, zoom = 1 }: AfricaMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: regionColors = {} } = useQuery<Record<string, string>>({
    queryKey: ['/api/region-colors'],
  });

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!svgContainerRef.current || countries.length === 0) return;

    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) {
      console.error('SVG element not found');
      return;
    }

    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    // Apply zoom
    const viewBox = svgElement.viewBox.baseVal;
    const scaledWidth = viewBox.width / zoom;
    const scaledHeight = viewBox.height / zoom;
    const offsetX = (viewBox.width - scaledWidth) / 2;
    const offsetY = (viewBox.height - scaledHeight) / 2;
    
    svgElement.setAttribute('viewBox', `${offsetX} ${offsetY} ${scaledWidth} ${scaledHeight}`);

    const paths = svgElement.querySelectorAll('path[id]');
    console.log(`Found ${paths.length} country paths`);

    const cleanupFunctions: (() => void)[] = [];

    paths.forEach((pathElement) => {
      const path = pathElement as SVGPathElement;
      const svgId = path.id;
      const countryId = svgIdToCountryId[svgId];
      const country = countries.find(c => c.id === countryId);

      if (!country) {
        path.setAttribute('fill', '#CBD5E1');
        path.setAttribute('stroke', '#94A3B8');
        path.setAttribute('stroke-width', '0.5');
        return;
      }

      const isHighlighted = !searchQuery ||
        filteredCountries.some(c => c.id === country.id);

      const fillColor = viewMode === 'region'
        ? (regionColors[country.region] || '#CBD5E1')
        : '#CBD5E1';

      path.setAttribute('fill', fillColor);
      path.setAttribute('stroke', '#94A3B8');
      path.setAttribute('stroke-width', '0.5');
      path.style.opacity = isHighlighted ? '1' : '0.3';
      path.style.cursor = isHighlighted ? 'pointer' : 'default';
      path.style.transition = 'all 0.3s ease';

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
  }, [searchQuery, viewMode, filteredCountries, onCountryClick, countries, regionColors, zoom]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-background flex items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      data-testid="map-container"
    >
      <div
        ref={svgContainerRef}
        className="w-full h-full max-w-5xl max-h-full"
        dangerouslySetInnerHTML={{ __html: africaMapSvg }}
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
