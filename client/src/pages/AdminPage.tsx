import { useState } from "react";
import { Link } from "wouter";
import { Settings, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountryForm } from "@/components/CountryForm";
import { ColorCustomizer } from "@/components/ColorCustomizer";
import { CountryList } from "@/components/CountryList";

export default function AdminPage() {
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);

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
          <Settings className="h-6 w-6 text-primary" />
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
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="countries" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="countries" data-testid="tab-countries">
                Country Management
              </TabsTrigger>
              <TabsTrigger value="colors" data-testid="tab-colors">
                Color Settings
              </TabsTrigger>
            </TabsList>

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
          </Tabs>
        </div>
      </main>
    </div>
  );
}
