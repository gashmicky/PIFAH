import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, BookOpen, Lightbulb, ArrowLeft, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Chatbot } from "@/components/Chatbot";
import { useQuery } from "@tanstack/react-query";

export default function CommunityOfPractice() {
  // Fetch app settings for logo
  const { data: settings } = useQuery<{
    id: string;
    logoUrl: string | null;
    bannerImageUrl: string | null;
  }>({
    queryKey: ['/api/settings'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover-elevate">
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt="PIFAH Logo" 
                    className="h-12 w-auto max-w-[120px] object-contain"
                    data-testid="img-logo"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold">PIFAH</h1>
                  <p className="text-xs text-muted-foreground">Community of Practice</p>
                </div>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Clock className="h-3 w-3 mr-1" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Community of Practice
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collaborative platform for health sector professionals across Africa to share ideas, 
              best practices, and innovative solutions for advancing health investment.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Discussion Forums</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Engage in meaningful conversations with peers, share experiences, and discuss challenges 
                  in health sector financing and investment across the continent.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Resource Library</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access a comprehensive collection of research papers, case studies, policy briefs, 
                  and implementation guides on health sector investment and financing.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Expert Network</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with health sector experts, investors, policymakers, and practitioners 
                  working to strengthen health systems across Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Innovation Hub</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Showcase innovative health financing models, successful project implementations, 
                  and emerging opportunities for sustainable health sector investment.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-semibold mb-3">Portal Launching Soon</h3>
              <p className="text-muted-foreground mb-6">
                We're building a world-class platform to facilitate collaboration and knowledge sharing 
                among health sector stakeholders across Africa. Stay tuned for updates!
              </p>
              <Link href="/">
                <Button size="lg" data-testid="button-explore">
                  Explore PIFAH Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {settings?.logoUrl && (
                <img 
                  src={settings.logoUrl} 
                  alt="PIFAH Logo" 
                  className="h-12 w-auto max-w-[100px] object-contain"
                />
              )}
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold">PIFAH</p>
                <p>Programme for Investment and Financing in Africa's Health Sector</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PIFAH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
