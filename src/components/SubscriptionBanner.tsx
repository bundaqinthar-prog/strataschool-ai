import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const RENEWAL_URL = "https://lifecoach.myscalev.com/co-robot-konsultan-marketing";

export function SubscriptionBanner() {
  const { profile, isSubscriptionExpired, daysUntilExpiry } = useAuth();

  if (!profile || profile.status !== "approved") return null;
  if (!profile.subscription_expires_at) return null;

  const expiryDate = new Date(profile.subscription_expires_at).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "long", year: "numeric" }
  );

  if (isSubscriptionExpired) {
    return (
      <Alert variant="destructive" className="print:hidden">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Langganan Anda telah berakhir</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            Paket langganan berakhir pada <strong>{expiryDate}</strong>. Akses ke
            fitur AI dibatasi sampai langganan diperpanjang.
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="bg-background text-destructive border-destructive hover:bg-destructive/10"
          >
            <a href={RENEWAL_URL} target="_blank" rel="noopener noreferrer">
              Perpanjang Sekarang
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Warning if expiring within 7 days
  if (daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
    return (
      <Alert className="border-chart-3 bg-chart-3/10 print:hidden">
        <Clock className="h-4 w-4 text-chart-3" />
        <AlertTitle className="text-chart-3">
          Langganan akan berakhir dalam {daysUntilExpiry} hari
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            Paket Anda berakhir pada <strong>{expiryDate}</strong>. Perpanjang
            sekarang agar akses fitur AI tidak terputus.
          </span>
          <Button asChild size="sm" variant="outline">
            <a href={RENEWAL_URL} target="_blank" rel="noopener noreferrer">
              Perpanjang
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
