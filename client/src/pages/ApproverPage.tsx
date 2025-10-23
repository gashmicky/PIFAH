import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTable } from "@/components/ProjectsTable";
import { AfricaMap } from "@/components/AfricaMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function ApproverPage() {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);

  // Fetch app settings for logo
  const { data: settings } = useQuery<{
    id: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
  }>({
    queryKey: ['/api/settings'],
  });

  // Fetch projects pending final approval
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const pendingApproval = projects.filter(p => p.status === "under_review" && !p.approvedBy).length;
  const approved = projects.filter(p => p.approvedBy).length;
  const total = projects.length;

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b px-4 flex items-center justify-between gap-4 bg-card">
        <div className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="PIFAH Logo" 
              className="h-12 w-auto max-w-[100px] md:h-14 md:max-w-[130px] object-contain"
              data-testid="img-logo-approver"
            />
          ) : (
            <CheckCircle className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-xl font-semibold">Approver Dashboard</h1>
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
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Final Approval</p>
                    <h3 className="text-3xl font-bold">{pendingApproval}</h3>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    Action Needed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <h3 className="text-3xl font-bold">{approved}</h3>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <h3 className="text-3xl font-bold">{total}</h3>
                  </div>
                  <Badge variant="outline">
                    All
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="table" data-testid="tab-table-view">
                <FileText className="w-4 h-4 mr-2" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="map" data-testid="tab-map-view">
                <MapPin className="w-4 h-4 mr-2" />
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">Projects Pending Final Approval</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review focal person recommendations and provide final approval
                </p>
              </div>

              <ProjectsTable roleFilter="pending_approval" showAllColumns={true} />
            </TabsContent>

            <TabsContent value="map" className="mt-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">Geographic Distribution</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View approved projects across Africa
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Projects Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-muted/10 rounded-lg overflow-hidden">
                    <AfricaMap
                      onCountryClick={setSelectedCountry}
                      searchQuery=""
                      viewMode="default"
                    />
                  </div>
                  {selectedCountry && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{selectedCountry.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Capital:</span>{" "}
                          {selectedCountry.capital}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Region:</span>{" "}
                          {selectedCountry.region}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
