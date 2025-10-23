import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PILLAR_COLORS } from "@/data/pillarColors";

interface CountryStats {
  countryName: string;
  totalProjects: number;
  pillarCounts: Record<string, number>;
  projects: Array<{ id: string; title: string; pillar: string }>;
}

interface CountryTooltipProps {
  countryName: string;
  stats: CountryStats | null;
  x: number;
  y: number;
}

export function CountryTooltip({ countryName, stats, x, y }: CountryTooltipProps) {
  if (!stats || stats.totalProjects === 0) {
    return (
      <Card
        className="fixed pointer-events-none z-40 p-3 backdrop-blur-md bg-card/95 shadow-lg"
        style={{
          left: `${x + 15}px`,
          top: `${y + 15}px`,
        }}
        data-testid="tooltip-country"
      >
        <h4 className="font-semibold text-sm mb-1">{countryName}</h4>
        <p className="text-xs text-muted-foreground">No approved projects</p>
      </Card>
    );
  }

  return (
    <Card
      className="fixed pointer-events-none z-40 p-3 backdrop-blur-md bg-card/95 shadow-lg max-w-xs"
      style={{
        left: `${x + 15}px`,
        top: `${y + 15}px`,
      }}
      data-testid="tooltip-country"
    >
      <h4 className="font-semibold text-sm mb-2">{countryName}</h4>
      <div className="mb-2">
        <Badge variant="default" className="text-xs" data-testid="badge-totalProjects">
          {stats.totalProjects} {stats.totalProjects === 1 ? 'Project' : 'Projects'}
        </Badge>
      </div>
      
      {stats.totalProjects > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">By Pillar:</p>
          {Object.entries(stats.pillarCounts).map(([pillar, count]) => {
            const pillarColor = PILLAR_COLORS[pillar]?.primary || 'hsl(200, 70%, 60%)';
            return (
              <div key={pillar} className="flex justify-between items-center text-xs" data-testid={`pillar-${pillar}`}>
                <span style={{ color: pillarColor }} className="font-medium">{pillar}</span>
                <Badge variant="secondary" className="text-xs ml-2">
                  {count}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
