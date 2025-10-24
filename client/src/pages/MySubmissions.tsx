import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Edit, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { Project } from "@shared/schema";
import { PILLAR_COLORS } from "@/data/pillarColors";

export default function MySubmissions() {
  const [, setLocation] = useLocation();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/my-projects"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1" data-testid={`badge-status-pending`}>
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "under_review":
        return (
          <Badge variant="default" className="gap-1" data-testid={`badge-status-under-review`}>
            <AlertCircle className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700" data-testid={`badge-status-approved`}>
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1" data-testid={`badge-status-rejected`}>
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canEdit = (project: Project) => {
    return project.status === "pending" || project.status === "under_review";
  };

  const getPillarColor = (pillar: string) => {
    const pillarKey = pillar.replace(/\s+/g, '').replace(/&/g, '');
    return PILLAR_COLORS[pillarKey as keyof typeof PILLAR_COLORS]?.primary || "hsl(var(--primary))";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">My Submissions</h1>
                  <p className="text-sm text-muted-foreground">
                    View and edit your project submissions
                  </p>
                </div>
              </div>
            </div>
            <Link href="/submit-project">
              <Button data-testid="button-submit-new">
                Submit New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">Loading your submissions...</p>
            </div>
          </div>
        ) : !projects || projects.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't submitted any projects yet. Start by submitting your first project proposal.
              </p>
              <Link href="/submit-project">
                <Button size="lg" data-testid="button-submit-first">
                  Submit Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Project Submissions ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>PIFAH Pillar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                        <TableCell className="font-medium">
                          {project.projectTitle}
                        </TableCell>
                        <TableCell>{project.country}</TableCell>
                        <TableCell>
                          <span 
                            className="font-medium"
                            style={{ color: getPillarColor(project.pifahPillar) }}
                          >
                            {project.pifahPillar}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(project.submittedAt!).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit(project) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLocation(`/edit-project/${project.id}`)}
                              data-testid={`button-edit-${project.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {project.status === "approved" ? "Approved ✓" : "Cannot edit"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Info Card */}
              <Card className="mt-6 bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Edit Permission</p>
                      <p>
                        You can edit your project submissions while they are <strong>Pending Review</strong> or{" "}
                        <strong>Under Review</strong>. Once a project is approved or rejected, you cannot edit it.
                        Please contact an administrator if you need to make changes to approved or rejected projects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
