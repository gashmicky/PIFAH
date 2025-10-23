import { Card } from "@/components/ui/card";
import { regionColors } from "@shared/africaData";

export function MapLegend() {
  return (
    <Card className="p-4 backdrop-blur-md bg-card/95">
      <h3 className="text-sm font-semibold mb-3">Regions</h3>
      <div className="space-y-2">
        {Object.entries(regionColors).map(([region, color]) => (
          <div key={region} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-muted-foreground">{region} Africa</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
