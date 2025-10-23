import { Card } from "@/components/ui/card";
import { PILLAR_COLORS, PILLAR_LIST } from "@/data/pillarColors";

export function MapLegend() {
  return (
    <Card className="p-4 backdrop-blur-md bg-card/95">
      <h3 className="text-sm font-semibold mb-3">PIFAH Pillars</h3>
      <div className="space-y-2">
        {PILLAR_LIST.map((pillar) => {
          const colors = PILLAR_COLORS[pillar];
          return (
            <div key={pillar} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-xs text-muted-foreground leading-tight">{pillar}</span>
            </div>
          );
        })}
        <div className="pt-2 mt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Countries with Projects</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
