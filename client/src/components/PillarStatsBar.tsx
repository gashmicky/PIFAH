import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { PILLAR_COLORS, PILLAR_LIST } from "@/data/pillarColors";
import { CheckCircle, XCircle, FolderOpen } from "lucide-react";

interface RECStats {
  totalProjects: number;
  approvedProjects: number;
  pendingProjects: number;
  underReviewProjects: number;
  rejectedProjects: number;
  pillarBreakdown: Record<string, { approved: number; notApproved: number }>;
}

export function PillarStatsBar() {
  const { data: stats } = useQuery<RECStats>({
    queryKey: ['/api/statistics/overview'],
  });

  if (!stats) return null;

  return (
    <div className="space-y-4">
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-primary/60" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approvedProjects}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600/60 dark:text-green-400/60" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingProjects}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-600/20 dark:bg-amber-400/20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.underReviewProjects}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600/20 dark:bg-blue-400/20" />
          </div>
        </Card>
      </div>

      {/* Pillar Breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Projects by PIFAH Pillar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {PILLAR_LIST.map((pillar) => {
            const pillarData = stats.pillarBreakdown[pillar] || { approved: 0, notApproved: 0 };
            const colors = PILLAR_COLORS[pillar];
            const total = pillarData.approved + pillarData.notApproved;

            return (
              <Card 
                key={pillar} 
                className="p-4 hover-elevate transition-all"
                style={{ borderTop: `4px solid ${colors.primary}` }}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm leading-tight" style={{ color: colors.text }}>
                    {pillar}
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-bold">{total}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Approved:
                      </span>
                      <span className="font-semibold">{pillarData.approved}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <XCircle className="h-3 w-3" />
                        Pending:
                      </span>
                      <span className="font-semibold">{pillarData.notApproved}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {total > 0 && (
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full transition-all"
                        style={{ 
                          width: `${(pillarData.approved / total) * 100}%`,
                          backgroundColor: colors.primary
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
