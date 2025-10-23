import { X, MapPin, Users, Maximize, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Country } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface CountryDetailsPanelProps {
  country: Country;
  onClose: () => void;
  isStatic?: boolean;
}

export function CountryDetailsPanel({ country, onClose, isStatic = false }: CountryDetailsPanelProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const content = (
    <div className={isStatic ? "p-6 space-y-6" : ""}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold" data-testid={`text-country-${country.id}`}>
            {country.name}
          </h2>
          <Badge variant="secondary" className="mt-2">
            {country.region} Africa
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-details"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Capital</p>
            <p className="font-medium" data-testid="text-capital">{country.capital}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Population</p>
            <p className="font-mono font-semibold" data-testid="text-population">
              {formatNumber(country.population)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Maximize className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-mono font-semibold" data-testid="text-area">
              {formatNumber(country.area)} km²
            </p>
          </div>
        </div>

        {country.gdp && (
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">GDP</p>
              <p className="font-mono font-semibold" data-testid="text-gdp">
                ${formatNumber(country.gdp)}B USD
              </p>
            </div>
          </div>
        )}

        {country.languages && country.languages.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {country.languages.map((lang, idx) => (
                <Badge key={idx} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isStatic) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 space-y-4">
        {content}
      </Card>
    </div>
  );
}
