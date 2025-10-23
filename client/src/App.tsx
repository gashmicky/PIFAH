import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import MapPage from "@/pages/MapPage";
import AdminPage from "@/pages/AdminPage";
import FocalPersonPage from "@/pages/FocalPersonPage";
import ApproverPage from "@/pages/ApproverPage";
import SubmitProjectPage from "@/pages/SubmitProjectPage";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, isAdmin, isFocalPerson, isApprover, user } = useAuth();

  // Show landing page while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return <Landing />;
  }

  // Redirect to appropriate dashboard based on role
  const getDefaultRoute = () => {
    if (isAdmin) return "/admin";
    if (isFocalPerson) return "/focal-person";
    if (isApprover) return "/approver";
    return "/";
  };

  // Show authenticated routes with role-based access
  return (
    <Switch>
      <Route path="/" component={MapPage} />
      <Route path="/submit-project" component={SubmitProjectPage} />
      <Route path="/admin">
        {isAdmin ? <AdminPage /> : <MapPage />}
      </Route>
      <Route path="/focal-person">
        {isFocalPerson || isAdmin ? <FocalPersonPage /> : <MapPage />}
      </Route>
      <Route path="/approver">
        {isApprover || isAdmin ? <ApproverPage /> : <MapPage />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
