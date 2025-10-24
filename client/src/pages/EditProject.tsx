import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Project } from "@shared/schema";
import { ProjectSubmissionForm } from "@/components/ProjectSubmissionForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function EditProject() {
  const [, params] = useRoute("/edit-project/:id");
  const [, setLocation] = useLocation();
  const projectId = params?.id;

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The project you're trying to edit could not be found or you don't have permission to access it.
              </p>
              <Link href="/my-submissions">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Submissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if project can be edited
  if (project.status === "approved" || project.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Cannot Edit Project</h2>
              <p className="text-muted-foreground mb-6">
                This project has been {project.status} and can no longer be edited. 
                Please contact an administrator if you need to make changes.
              </p>
              <Link href="/my-submissions">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Submissions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProjectSubmissionForm initialData={project} isEditMode={true} />;
}
