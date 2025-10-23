import { useState } from "react";
import { Link } from "wouter";
import { Settings, ArrowLeft, Plus, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountryForm } from "@/components/CountryForm";
import { ColorCustomizer } from "@/components/ColorCustomizer";
import { CountryList } from "@/components/CountryList";
import { AppSettings } from "@/components/AppSettings";
import { ProjectsTable } from "@/components/ProjectsTable";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);

  // Fetch app settings for logo
  const { data: settings } = useQuery<{
    id: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
  }>({
    queryKey: ['/api/settings'],
  });

  const handleEditCountry = (countryId: string) => {
    setEditingCountryId(countryId);
    setShowCountryForm(true);
  };

  const handleFormClose = () => {
    setShowCountryForm(false);
    setEditingCountryId(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 border-b px-4 flex items-center justify-between gap-4 bg-card">
        <div className="flex items-center gap-3">
          {settings?.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt="PIFAH Logo" 
              className="h-12 w-auto max-w-[100px] md:h-14 md:max-w-[130px] object-contain"
              data-testid="img-logo-admin"
            />
          ) : (
            <Settings className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-to-map">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
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
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full max-w-3xl grid-cols-4">
              <TabsTrigger value="projects" data-testid="tab-projects">
                All Projects
              </TabsTrigger>
              <TabsTrigger value="countries" data-testid="tab-countries">
                Country Management
              </TabsTrigger>
              <TabsTrigger value="colors" data-testid="tab-colors">
                Color Settings
              </TabsTrigger>
              <TabsTrigger value="app-settings" data-testid="tab-app-settings">
                App Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">All Submitted Projects</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage all project submissions with comprehensive filtering and approval tracking
                </p>
              </div>

              <ProjectsTable showAllColumns={true} />
            </TabsContent>

            <TabsContent value="countries" className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Manage Countries</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add, edit, or remove country information
                  </p>
                </div>
                <Button
                  onClick={() => setShowCountryForm(true)}
                  data-testid="button-add-country"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Country
                </Button>
              </div>

              {showCountryForm ? (
                <CountryForm
                  countryId={editingCountryId}
                  onClose={handleFormClose}
                />
              ) : (
                <CountryList onEdit={handleEditCountry} />
              )}
            </TabsContent>

            <TabsContent value="colors" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">Regional Colors</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize the color scheme for each African region
                  </p>
                </div>

                <ColorCustomizer />
              </div>
            </TabsContent>

            <TabsContent value="app-settings" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold">App Settings</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload logo and banner images for your application
                  </p>
                </div>

                <AppSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
