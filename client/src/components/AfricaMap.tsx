import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";
import { CountryTooltip } from "./CountryTooltip";
import { useAuth } from "@/hooks/useAuth";
import africaMapSvg from "@/assets/africa-map.svg?raw";

interface AfricaMapProps {
  onCountryClick: (country: Country) => void;
  searchQuery: string;
  viewMode: 'default' | 'region';
  zoom?: number;
}

interface CountryStats {
  country: string;
  countryName: string;
  totalProjects: number;
  pillarCounts: Record<string, number>;
  projects: Array<{ id: string; title: string; pillar: string }>;
}

interface PrivilegedCountryStats extends CountryStats {
  statusCounts: Record<string, number>;
  projects: Array<{ id: string; title: string; pillar: string; status: string }>;
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
  const { isAdmin, isFocalPerson, isApprover } = useAuth();
  const isPrivilegedUser = isAdmin || isFocalPerson || isApprover;
  
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const { data: countries = [] } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  // Fetch public statistics (approved only) for regular users
  const { data: publicStatistics = [] } = useQuery<CountryStats[]>({
    queryKey: ['/api/countries/statistics'],
    enabled: !isPrivilegedUser,
  });

  // Fetch all statistics (including all statuses) for privileged users
  const { data: privilegedStatistics = [] } = useQuery<PrivilegedCountryStats[]>({
    queryKey: ['/api/countries/statistics/all'],
    enabled: isPrivilegedUser,
  });

  const statistics = isPrivilegedUser ? privilegedStatistics : publicStatistics;

  const { data: regionColors = {} } = useQuery<Record<string, string>>({
    queryKey: ['/api/region-colors'],
  });

  const statsMap = new Map<string, CountryStats>();
  statistics.forEach(stat => {
    statsMap.set(stat.country, stat);
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

      const stats = statsMap.get(country.name);
      const hasProjects = stats && stats.totalProjects > 0;

      let fillColor = '#CBD5E1'; // Default gray for no projects
      
      // Privileged users always see status-based colors in default mode
      if (viewMode === 'default' && hasProjects && isPrivilegedUser) {
        // Status-based coloring for privileged users
        const privilegedStats = stats as PrivilegedCountryStats;
        const statusCounts = privilegedStats.statusCounts || {};
        
        // Priority: Show most critical status first (with safe access)
        if ((statusCounts.rejected || 0) > 0) {
          fillColor = '#FEE2E2'; // Light red for rejected
        } else if ((statusCounts.pending || 0) > 0) {
          fillColor = '#FEF3C7'; // Light yellow for pending
        } else if ((statusCounts.under_review || 0) > 0) {
          fillColor = '#DBEAFE'; // Light blue for under review
        } else if ((statusCounts.approved || 0) > 0) {
          fillColor = '#D1FAE5'; // Light green for approved
        }
      } else if (viewMode === 'region') {
        fillColor = regionColors[country.region] || '#CBD5E1';
      } else if (hasProjects) {
        // Public users only see approved projects in light green
        fillColor = '#D1FAE5'; // Very light green
      }

      path.setAttribute('fill', fillColor);
      path.setAttribute('stroke', '#94A3B8');
      path.setAttribute('stroke-width', '0.5');
      path.style.opacity = isHighlighted ? '1' : '0.3';
      path.style.cursor = isHighlighted ? 'pointer' : 'default';
      path.style.transition = 'all 0.3s ease';

      if (selectedCountry === country.name) {
        path.setAttribute('stroke', '#10B981'); // Bold green color
        path.setAttribute('stroke-width', '1'); // Very thin border
      }

      const handleMouseEnter = () => {
        if (isHighlighted) {
          setHoveredCountry(country.name);
          path.style.filter = 'brightness(1.3)';
        }
      };

      const handleMouseLeave = () => {
        setHoveredCountry(null);
        path.style.filter = 'none';
      };

      const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        if (isHighlighted) {
          console.log('Country clicked:', country.name);
          setSelectedCountry(country.name);
          onCountryClick(country);
        }
      };

      path.style.pointerEvents = 'auto';
      path.addEventListener('mouseenter', handleMouseEnter);
      path.addEventListener('mouseleave', handleMouseLeave);
      path.addEventListener('click', handleClick as EventListener);

      cleanupFunctions.push(() => {
        path.removeEventListener('mouseenter', handleMouseEnter);
        path.removeEventListener('mouseleave', handleMouseLeave);
        path.removeEventListener('click', handleClick as EventListener);
      });
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [searchQuery, viewMode, filteredCountries, onCountryClick, countries, regionColors, zoom, statsMap, selectedCountry, isPrivilegedUser]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const hoveredStats = hoveredCountry ? statsMap.get(hoveredCountry) || null : null;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseMove={handleMouseMove}
      data-testid="map-container"
      style={{ 
        background: 'transparent',
        pointerEvents: 'auto'
      }}
    >
      <div
        ref={svgContainerRef}
        className="w-full h-full"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%',
          pointerEvents: 'auto'
        }}
        dangerouslySetInnerHTML={{ __html: africaMapSvg }}
      />

      {hoveredCountry && (
        <CountryTooltip
          countryName={hoveredCountry}
          stats={hoveredStats}
          x={mousePosition.x}
          y={mousePosition.y}
        />
      )}
    </div>
  );
}
