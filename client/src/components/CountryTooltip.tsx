import { Card } from "@/components/ui/card";
import { Country } from "@shared/africaData";

interface CountryTooltipProps {
  country: Country;
  x: number;
  y: number;
}

export function CountryTooltip({ country, x, y }: CountryTooltipProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card
      className="fixed pointer-events-none z-40 p-3 backdrop-blur-md bg-card/95 shadow-lg"
      style={{
        left: `${x + 15}px`,
        top: `${y + 15}px`,
      }}
      data-testid="tooltip-country"
    >
      <h4 className="font-semibold text-sm mb-1">{country.name}</h4>
      <p className="text-xs text-muted-foreground">
        Pop: {formatNumber(country.population)}
      </p>
      <p className="text-xs text-muted-foreground">
        Capital: {country.capital}
      </p>
    </Card>
  );
}
