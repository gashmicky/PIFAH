import { ProjectSubmissionForm } from "@/components/ProjectSubmissionForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SubmitProjectPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Submit Project</h1>
              <p className="text-xs text-muted-foreground">PIFAH Project Submission Form</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <ProjectSubmissionForm />
        </div>
      </main>
    </div>
  );
}
