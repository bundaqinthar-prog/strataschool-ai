import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PendingApproval from "@/pages/PendingApproval";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile && profile.status !== "approved") {
    return <PendingApproval />;
  }

  return <>{children}</>;
}
