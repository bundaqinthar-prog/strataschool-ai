import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import MarketingAudit from "@/pages/MarketingAudit";
import MarketResearch from "@/pages/MarketResearch";
import SchoolPositioning from "@/pages/SchoolPositioning";
import CompetitorAnalysis from "@/pages/CompetitorAnalysis";
import GrowthStrategy from "@/pages/GrowthStrategy";
import ContentPlanner from "@/pages/ContentPlanner";
import ParentPersona from "@/pages/ParentPersona";
import SwotAnalysis from "@/pages/SwotAnalysis";
import ReportHistory from "@/pages/ReportHistory";
import SchoolProfile from "@/pages/SchoolProfile";
import ConceptBuilder from "@/pages/ConceptBuilder";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin */}
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            {/* Protected user routes */}
            <Route element={
              <ProtectedRoute><AppLayout /></ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/audit" element={<MarketingAudit />} />
              <Route path="/research" element={<MarketResearch />} />
              <Route path="/positioning" element={<SchoolPositioning />} />
              <Route path="/competitors" element={<CompetitorAnalysis />} />
              <Route path="/growth" element={<GrowthStrategy />} />
              <Route path="/content" element={<ContentPlanner />} />
              <Route path="/persona" element={<ParentPersona />} />
              <Route path="/swot" element={<SwotAnalysis />} />
              <Route path="/concept" element={<ConceptBuilder />} />
              <Route path="/history" element={<ReportHistory />} />
              <Route path="/profile" element={<SchoolProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
