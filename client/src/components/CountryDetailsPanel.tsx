import { X, FolderOpen, Target, Building2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Country } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getRECsForCountry, REC_INFO } from "@/data/recData";

interface CountryDetailsPanelProps {
  country: Country;
  onClose: () => void;
  isStatic?: boolean;
}

interface CountryStats {
  country: string;
  countryName: string;
  totalProjects: number;
  pillarCounts: Record<string, number>;
  projects: Array<{ id: string; title: string; pillar: string }>;
}

export function CountryDetailsPanel({ country, onClose, isStatic = false }: CountryDetailsPanelProps) {
  const { data: statistics = [] } = useQuery<CountryStats[]>({
    queryKey: ['/api/countries/statistics'],
  });

  const countryStats = statistics.find(s => s.country === country.name);
  const countryRECs = getRECsForCountry(country.name);

  const content = (
    <div className={isStatic ? "p-6 space-y-6" : ""}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold" data-testid={`text-country-${country.id}`}>
            {country.name}
          </h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">
              {country.region}
            </Badge>
          </div>
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

      {countryRECs.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            Regional Economic Communities (RECs)
          </p>
          <div className="flex flex-wrap gap-2">
            {countryRECs.map((rec) => (
              <Badge 
                key={rec} 
                variant="outline" 
                className="bg-primary/5 border-primary/20"
                data-testid={`badge-rec-${rec}`}
              >
                {rec}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {countryRECs.map((rec, index) => (
              <div key={rec} className="mt-1">
                <span className="font-medium">{rec}</span>: {REC_INFO[rec]?.name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {countryStats && countryStats.totalProjects > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="font-semibold text-lg" data-testid="text-total-projects">
                  {countryStats.totalProjects} {countryStats.totalProjects === 1 ? 'Project' : 'Projects'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Projects by PIFAH Pillar
              </p>
              <div className="space-y-2">
                {Object.entries(countryStats.pillarCounts).map(([pillar, count]) => (
                  <div key={pillar} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <span className="text-sm font-medium">{pillar}</span>
                    <Badge variant="secondary">
                      {count} {count === 1 ? 'project' : 'projects'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Project Titles
              </p>
              <div className="space-y-2">
                {countryStats.projects.map((project) => (
                  <div key={project.id} className="p-3 rounded-md bg-muted/30 border border-muted">
                    <p className="text-sm font-medium">{project.title}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {project.pillar}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No approved projects in {country.name} yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to submit a project!
            </p>
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
