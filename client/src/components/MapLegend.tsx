import { Card } from "@/components/ui/card";
import { PILLAR_COLORS, PILLAR_LIST } from "@/data/pillarColors";
import { useAuth } from "@/hooks/useAuth";

export function MapLegend() {
  const { isAdmin, isFocalPerson, isApprover } = useAuth();
  const isPrivilegedUser = isAdmin || isFocalPerson || isApprover;

  return (
    <Card className="p-4 backdrop-blur-md bg-card/95">
      <h3 className="text-sm font-semibold mb-3">
        {isPrivilegedUser ? "Project Status Colors" : "PIFAH Pillars"}
      </h3>
      <div className="space-y-2">
        {isPrivilegedUser ? (
          // Show status-based legend for privileged users
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#FEE2E2' }} />
              <span className="text-xs text-muted-foreground leading-tight">Rejected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }} />
              <span className="text-xs text-muted-foreground leading-tight">Pending Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#DBEAFE' }} />
              <span className="text-xs text-muted-foreground leading-tight">Under Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#D1FAE5' }} />
              <span className="text-xs text-muted-foreground leading-tight">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#CBD5E1' }} />
              <span className="text-xs text-muted-foreground leading-tight">No Projects</span>
            </div>
            <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
              * Countries show highest priority status
            </div>
          </>
        ) : (
          // Show pillar legend for public users
          <>
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
                <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: '#D1FAE5' }} />
                <span className="text-xs text-muted-foreground">Countries with Projects</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
