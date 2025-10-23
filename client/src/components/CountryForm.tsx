import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Country } from "@shared/schema";

interface CountryFormProps {
  countryId?: string | null;
  onClose: () => void;
}

interface CountryFormData {
  id: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  region: 'North' | 'West' | 'East' | 'Central' | 'South';
  gdp: number;
  languages: string;
}

export function CountryForm({ countryId, onClose }: CountryFormProps) {
  const { toast } = useToast();

  const { data: country } = useQuery<Country>({
    queryKey: ['/api/countries', countryId],
    enabled: !!countryId,
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<CountryFormData>({
    defaultValues: {
      id: "",
      name: "",
      capital: "",
      population: 0,
      area: 0,
      region: "North",
      gdp: 0,
      languages: "",
    },
  });

  useEffect(() => {
    if (country) {
      reset({
        id: country.id,
        name: country.name,
        capital: country.capital,
        population: country.population,
        area: country.area,
        region: country.region,
        gdp: country.gdp || 0,
        languages: country.languages?.join(", ") || "",
      });
    }
  }, [country, reset]);

  const selectedRegion = watch("region");

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/countries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/countries'] });
      toast({
        title: "Success",
        description: "Country created successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create country",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/countries/${countryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/countries'] });
      toast({
        title: "Success",
        description: "Country updated successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update country",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CountryFormData) => {
    const payload = {
      id: data.id,
      name: data.name,
      capital: data.capital,
      population: Number(data.population),
      area: Number(data.area),
      region: data.region,
      gdp: data.gdp ? Number(data.gdp) : undefined,
      languages: data.languages ? data.languages.split(',').map(l => l.trim()) : [],
    };

    if (countryId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>
          {countryId ? "Edit Country" : "Add New Country"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-form"
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!countryId && (
              <div className="space-y-2">
                <Label htmlFor="id">Country ID</Label>
                <Input
                  id="id"
                  {...register("id", { required: true })}
                  placeholder="e.g., ke"
                  data-testid="input-id"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Country Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="e.g., Kenya"
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capital">Capital City</Label>
              <Input
                id="capital"
                {...register("capital", { required: true })}
                placeholder="e.g., Nairobi"
                data-testid="input-capital"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="population">Population</Label>
              <Input
                id="population"
                type="number"
                {...register("population", { required: true, valueAsNumber: true })}
                placeholder="e.g., 55100000"
                data-testid="input-population"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (km²)</Label>
              <Input
                id="area"
                type="number"
                {...register("area", { required: true, valueAsNumber: true })}
                placeholder="e.g., 580367"
                data-testid="input-area"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={selectedRegion}
                onValueChange={(value) =>
                  setValue("region", value as any)
                }
              >
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North Africa</SelectItem>
                  <SelectItem value="West">West Africa</SelectItem>
                  <SelectItem value="East">East Africa</SelectItem>
                  <SelectItem value="Central">Central Africa</SelectItem>
                  <SelectItem value="South">Southern Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gdp">GDP (Billion USD)</Label>
              <Input
                id="gdp"
                type="number"
                {...register("gdp", { valueAsNumber: true })}
                placeholder="e.g., 115"
                data-testid="input-gdp"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="languages">Languages (comma-separated)</Label>
              <Input
                id="languages"
                {...register("languages")}
                placeholder="e.g., Swahili, English"
                data-testid="input-languages"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              data-testid="button-save"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? "Saving..." 
                : countryId ? "Update Country" : "Add Country"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
