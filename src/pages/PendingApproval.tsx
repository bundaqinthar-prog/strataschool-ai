import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingApproval() {
  const { signOut, refreshProfile, profile } = useAuth();

  const isRejected = profile?.status === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center ${
            isRejected ? "bg-destructive/10" : "bg-chart-3/10"
          }`}>
            <Clock className={`h-6 w-6 ${isRejected ? "text-destructive" : "text-chart-3"}`} />
          </div>
          <CardTitle className="text-2xl">
            {isRejected ? "Akun Ditolak" : "Menunggu Persetujuan"}
          </CardTitle>
          <CardDescription className="text-base">
            {isRejected
              ? "Maaf, akun Anda telah ditolak oleh admin. Silakan hubungi administrator untuk informasi lebih lanjut."
              : "Akun Anda sedang menunggu persetujuan dari admin. Anda akan dapat mengakses aplikasi setelah akun Anda disetujui."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Email: <span className="font-medium text-foreground">{profile?.email}</span>
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" onClick={refreshProfile}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Cek Status
          </Button>
          <Button variant="ghost" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
