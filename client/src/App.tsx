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
import FAQ from "@/pages/FAQ";
import CommunityOfPractice from "@/pages/CommunityOfPractice";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, isAdmin, isFocalPerson, isApprover, user } = useAuth();

  // Public routes accessible to everyone
  return (
    <Switch>
      <Route path="/faq" component={FAQ} />
      <Route path="/community" component={CommunityOfPractice} />
      
      {/* Conditional routing based on authentication */}
      <Route path="/">
        {isLoading || !isAuthenticated ? <Landing /> : <MapPage />}
      </Route>
      <Route path="/submit-project">
        {isAuthenticated ? <SubmitProjectPage /> : <Landing />}
      </Route>
      <Route path="/admin">
        {isAdmin ? <AdminPage /> : <Landing />}
      </Route>
      <Route path="/focal-person">
        {isFocalPerson || isAdmin ? <FocalPersonPage /> : <Landing />}
      </Route>
      <Route path="/approver">
        {isApprover || isAdmin ? <ApproverPage /> : <Landing />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
