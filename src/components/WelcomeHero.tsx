import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Instagram,
  MessageCircle,
  Sparkles,
  GraduationCap,
  Megaphone,
  HandHeart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const WA_NUMBER = "6285789102020";
const WA_MESSAGE = encodeURIComponent(
  "Halo Pak Wahid, saya tertarik konsultasi/training AI & Digital Marketing untuk sekolah saya."
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
const IG_LINK = "https://instagram.com/wahidhasymr";

interface WelcomeHeroProps {
  /** Compact varian untuk ditampilkan di empty state / sub-halaman */
  variant?: "full" | "compact";
  schoolName?: string | null;
}

export function WelcomeHero({ variant = "full", schoolName }: WelcomeHeroProps) {
  if (variant === "compact") {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0 border-2 border-primary/30">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              WH
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base">Wahid Hasyim</h3>
              <Badge variant="outline" className="border-secondary/40 text-secondary text-xs">
                <Sparkles className="h-3 w-3 mr-1" /> Mentor Anda
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Konsultan & Trainer <strong>AI + Digital Marketing</strong> untuk sekolah.
              Butuh pendampingan langsung? Hubungi saya.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <Instagram className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 print:hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 p-6 md:p-8 items-center">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Avatar className="h-24 w-24 border-4 border-primary/30 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-extrabold text-3xl">
                WH
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Konten utama */}
          <div className="text-center md:text-left">
            <Badge className="mb-2 bg-secondary/15 text-secondary hover:bg-secondary/20 border-0">
              <Sparkles className="h-3 w-3 mr-1" /> Selamat Datang di SchoolGrowth AI
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Halo{schoolName ? `, Tim ${schoolName}` : ""}! Saya{" "}
              <span className="text-primary">Wahid Hasyim</span> 👋
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2 leading-relaxed max-w-2xl">
              Konsultan, trainer, dan pendamping <strong className="text-foreground">AI & Digital Marketing</strong> untuk sekolah-sekolah di Indonesia.
              Saya bantu sekolah Anda tumbuh, dikenal, dan dipilih orang tua — dengan strategi yang
              terukur dan kekuatan AI.
            </p>

            {/* Layanan */}
            <div className="grid sm:grid-cols-3 gap-2 mt-4">
              {[
                { icon: GraduationCap, label: "Training AI & Digital Marketing" },
                { icon: Megaphone, label: "Konsultasi Branding & PPDB" },
                { icon: HandHeart, label: "Pendampingan Sekolah" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-xs bg-background/60 backdrop-blur rounded-lg border px-3 py-2"
                >
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA stack */}
          <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md">
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp
              </Button>
            </a>
            <a href={IG_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                <Instagram className="h-4 w-4" />
                @wahidhasymr
              </Button>
            </a>
            <Link to="/konsultasi">
              <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                <Sparkles className="h-4 w-4" />
                Tanya AI Gratis
                <ArrowRight className="h-3 w-3 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t bg-background/40 backdrop-blur px-6 py-3 flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            <span>Berpengalaman mendampingi sekolah di seluruh Indonesia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            <span>Materi disesuaikan konteks pendidikan Indonesia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            <span>Dukungan langsung via WhatsApp</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
