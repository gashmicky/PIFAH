import { useQuery } from "@tanstack/react-query";
import { Country } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Users } from "lucide-react";

interface CountryListProps {
  onEdit: (countryId: string) => void;
}

export function CountryList({ onEdit }: CountryListProps) {
  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading countries...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {countries.map((country) => (
        <Card key={country.id} className="hover-elevate">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
            <div className="flex-1">
              <CardTitle className="text-lg" data-testid={`text-country-${country.id}`}>
                {country.name}
              </CardTitle>
              <Badge variant="secondary" className="mt-1">
                {country.region}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(country.id)}
              data-testid={`button-edit-${country.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Capital:</span>
              <span className="font-medium">{country.capital}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Population:</span>
              <span className="font-mono font-medium">
                {formatNumber(country.population)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
