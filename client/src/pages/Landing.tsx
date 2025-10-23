import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Globe, Users, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import { AfricaMap } from "@/components/AfricaMap";
import { CountryDetailsPanel } from "@/components/CountryDetailsPanel";
import { SearchBar } from "@/components/SearchBar";
import { MapLegend } from "@/components/MapLegend";
import { Country } from "@shared/schema";

export default function Landing() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch public projects data
  const { data: publicProjects = [] } = useQuery<Array<{
    id: string;
    country: string;
    pifahPillar: string;
    projectTitle: string;
  }>>({
    queryKey: ['/api/projects/public'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PIFAH</h1>
              <p className="text-xs text-muted-foreground">Programme for Investment and Financing in Africa's Health Sector</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              Login
            </Button>
            <Button
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-register"
            >
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Transforming Africa's Health Sector
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Unlocking Africa's Health{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Investment Opportunity
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              PIFAH is Africa's catalytic platform for mobilizing domestic resources, unlocking blended capital, and transforming health systems across the continent.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => window.location.href = "/api/login"} data-testid="button-get-started">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}>
                View Map
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section id="map" className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Explore Africa's Health Projects</h3>
              <p className="text-muted-foreground">
                {publicProjects.length} Approved Projects | Click on any country to explore
              </p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row h-[600px]">
                  {/* Map */}
                  <div className="flex-1 relative bg-background">
                    <div className="p-4 border-b">
                      <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search countries..."
                      />
                    </div>
                    
                    <div className="h-[calc(100%-60px)] relative">
                      <AfricaMap
                        onCountryClick={setSelectedCountry}
                        searchQuery={searchQuery}
                        viewMode="region"
                      />
                      
                      <div className="absolute bottom-4 left-4 z-30">
                        <MapLegend />
                      </div>
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className="w-full lg:w-2/5 border-l bg-card overflow-y-auto">
                    {selectedCountry ? (
                      <CountryDetailsPanel
                        country={selectedCountry}
                        onClose={() => setSelectedCountry(null)}
                        isStatic
                      />
                    ) : (
                      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
                        <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Select a Country</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click on any country on the map to view health investment projects
                        </p>
                        {publicProjects.length > 0 && (
                          <div className="mt-4 w-full">
                            <h4 className="text-sm font-semibold mb-2">Recent Projects</h4>
                            <div className="space-y-2">
                              {publicProjects.slice(0, 3).map((project: any) => (
                                <div key={project.id} className="p-3 rounded-lg bg-muted/50 text-left">
                                  <p className="text-sm font-medium">{project.projectTitle}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">{project.country}</span>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs text-primary">{project.pifahPillar}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">55</h3>
                <p className="text-muted-foreground">African Countries</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">$259B</h3>
                <p className="text-muted-foreground">Projected Market by 2030</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold">16M</h3>
                <p className="text-muted-foreground">Potential New Jobs</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto px-4 py-16 bg-card/50 rounded-lg my-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-center">About PIFAH</h3>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground text-center mb-8">
                PIFAH reflects a paradigm shift: from viewing health as a cost to recognizing health as a cornerstone of national resilience, economic competitiveness, and regional integration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <h4 className="text-lg font-semibold mb-2">Our Mission</h4>
                  <p className="text-muted-foreground text-sm">
                    To mobilize new resources, build sustainable health systems, and unlock Africa's health dividend through strategic investments and partnerships.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h4 className="text-lg font-semibold mb-2">Our Vision</h4>
                  <p className="text-muted-foreground text-sm">
                    A thriving health economy that underpins inclusive growth, job creation, and sustainable development across Africa.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h4 className="text-2xl font-bold mb-4">Five Strategic Investment Pillars</h4>
            <div className="grid gap-3">
              {[
                "Local Production of Medical Products",
                "Digital Health and Artificial Intelligence",
                "Health Infrastructure and Diagnostics",
                "Research & Development",
                "Human Capital Development"
              ].map((pillar, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover-elevate">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Submit Your Project?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join us in transforming Africa's health sector. Register now to submit your health investment project and be part of this continental effort.
              </p>
              <Button size="lg" onClick={() => window.location.href = "/api/login"} data-testid="button-submit-project">
                Submit Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/95 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">PIFAH</h3>
                  <p className="text-xs text-muted-foreground">AUDA-NEPAD</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Programme for Investment and Financing in Africa's Health Sector
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-foreground">
                    About PIFAH
                  </a>
                </li>
                <li>
                  <a href="/api/login" className="text-muted-foreground hover:text-foreground">
                    Submit Project
                  </a>
                </li>
                <li>
                  <a href="/api/login" className="text-muted-foreground hover:text-foreground">
                    Login
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground mb-2">
                PIFAH Programme Coordinator
              </p>
              <p className="text-sm text-muted-foreground">
                AUDA-NEPAD
              </p>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AUDA-NEPAD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
