import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RegionColors = {
  North: string;
  West: string;
  East: string;
  Central: string;
  South: string;
};

type RegionKey = keyof RegionColors;

export function ColorCustomizer() {
  const { toast } = useToast();
  
  const { data: savedColors } = useQuery<RegionColors>({
    queryKey: ['/api/region-colors'],
  });

  const [colors, setColors] = useState<RegionColors>(
    savedColors || {
      North: 'hsl(200 70% 45%)',
      West: 'hsl(150 55% 45%)',
      East: 'hsl(280 60% 50%)',
      Central: 'hsl(30 65% 50%)',
      South: 'hsl(340 65% 50%)',
    }
  );

  useEffect(() => {
    if (savedColors) {
      setColors(savedColors);
    }
  }, [savedColors]);

  const saveMutation = useMutation({
    mutationFn: (data: RegionColors) => apiRequest('/api/region-colors', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/region-colors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries'] });
      toast({
        title: "Success",
        description: "Color settings saved successfully",
      });
    },
  });

  const handleColorChange = (region: RegionKey, color: string) => {
    setColors((prev) => ({
      ...prev,
      [region]: color,
    }));
  };

  const handleReset = () => {
    setColors({
      North: 'hsl(200 70% 45%)',
      West: 'hsl(150 55% 45%)',
      East: 'hsl(280 60% 50%)',
      Central: 'hsl(30 65% 50%)',
      South: 'hsl(340 65% 50%)',
    });
  };

  const handleSave = () => {
    saveMutation.mutate(colors);
  };

  const regions: { key: RegionKey; label: string }[] = [
    { key: "North", label: "North Africa" },
    { key: "West", label: "West Africa" },
    { key: "East", label: "East Africa" },
    { key: "Central", label: "Central Africa" },
    { key: "South", label: "Southern Africa" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>Region Color Scheme</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          data-testid="button-reset-colors"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regions.map(({ key, label }) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={`color-${key}`}>{label}</Label>
                <Badge variant="outline">{key}</Badge>
              </div>
              <div className="flex gap-3 items-center">
                <div
                  className="w-16 h-10 rounded border-2 border-border"
                  style={{ backgroundColor: colors[key] }}
                  data-testid={`preview-${key}`}
                />
                <Input
                  id={`color-${key}`}
                  type="color"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-20 h-10"
                  data-testid={`input-color-${key}`}
                />
                <Input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  placeholder="HSL or HEX"
                  className="flex-1"
                  data-testid={`input-color-text-${key}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            onClick={handleSave} 
            data-testid="button-save-colors"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Color Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
