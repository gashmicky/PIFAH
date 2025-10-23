import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { REC_LIST, REC_INFO, COUNTRY_REC_MAP } from "@/data/recData";
import { Globe2, Building2 } from "lucide-react";

interface ProjectData {
  id: string;
  country: string;
}

export function RECStatsBar() {
  const { data: publicProjects = [] } = useQuery<ProjectData[]>({
    queryKey: ['/api/projects/public'],
  });

  // Calculate statistics for each REC
  const recStats = REC_LIST.map(rec => {
    // Count countries in this REC
    const countries = Object.entries(COUNTRY_REC_MAP)
      .filter(([_, recs]) => recs.includes(rec))
      .map(([country, _]) => country);
    
    // Count projects in this REC
    const projectCount = publicProjects.filter(project => 
      countries.includes(project.country)
    ).length;

    return {
      rec,
      name: REC_INFO[rec]?.name || rec,
      memberCount: REC_INFO[rec]?.memberCount || countries.length,
      projectCount,
    };
  }).filter(stat => stat.projectCount > 0 || ['COMESA', 'EAC', 'ECCAS', 'ECOWAS', 'IGAD', 'SADC', 'UMA'].includes(stat.rec));

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-primary" />
          Regional Economic Communities (RECs) Overview
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Projects distribution across Africa's regional blocs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {recStats.map(stat => (
          <Card key={stat.rec} className="hover-elevate">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 font-bold">
                  {stat.rec}
                </Badge>
                <div className="flex items-center gap-1 text-primary">
                  <Building2 className="h-4 w-4" />
                  <span className="text-lg font-bold">{stat.projectCount}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {stat.name}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe2 className="h-3 w-3" />
                <span>{stat.memberCount} member {stat.memberCount === 1 ? 'state' : 'states'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recStats.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Globe2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No approved projects in RECs yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
