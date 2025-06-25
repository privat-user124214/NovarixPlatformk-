import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import NewOrder from "@/pages/NewOrder";
import Team from "@/pages/Team";
import TeamDashboard from "@/pages/TeamDashboard";
import UserManagement from "./pages/UserManagement";
import Legal from "@/pages/Legal";
import Impressum from "@/pages/Impressum";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-novarix flex items-center justify-center">
        <div className="text-novarix-text">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/orders" component={Orders} />
        <Route path="/new-order" component={NewOrder} />
        <Route path="/team-dashboard" component={TeamDashboard} />
        <Route path="/team" component={Team} />
        <Route path="/users" component={UserManagement} />
        <Route path="/legal" component={Legal} />
        <Route path="/impressum" component={Impressum} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;