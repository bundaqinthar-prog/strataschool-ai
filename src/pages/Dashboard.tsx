import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  Search,
  Target,
  Users,
  TrendingUp,
  Calendar,
  UserCircle,
  Shield,
} from "lucide-react";

const tools = [
  { title: "Audit Marketing", description: "Evaluasi strategi marketing sekolah Anda dengan 60 pertanyaan", icon: ClipboardCheck, url: "/audit", color: "bg-primary/10 text-primary" },
  { title: "Riset Pasar", description: "Analisis peluang pasar lokal dan permintaan orang tua", icon: Search, url: "/research", color: "bg-secondary/10 text-secondary" },
  { title: "Positioning Sekolah", description: "Temukan proposisi nilai unik dan positioning brand sekolah", icon: Target, url: "/positioning", color: "bg-accent text-accent-foreground" },
  { title: "Analisis Kompetitor", description: "Analisis lanskap persaingan dan temukan peluang", icon: Users, url: "/competitors", color: "bg-primary/10 text-primary" },
  { title: "Strategi Pertumbuhan", description: "Buat strategi untuk meningkatkan pendaftaran siswa", icon: TrendingUp, url: "/growth", color: "bg-secondary/10 text-secondary" },
  { title: "Perencana Konten", description: "Dapatkan rencana konten media sosial 30 hari", icon: Calendar, url: "/content", color: "bg-accent text-accent-foreground" },
  { title: "Persona Orang Tua", description: "Buat profil detail target orang tua siswa", icon: UserCircle, url: "/persona", color: "bg-primary/10 text-primary" },
  { title: "Analisis SWOT", description: "Buat analisis SWOT komprehensif untuk sekolah", icon: Shield, url: "/swot", color: "bg-secondary/10 text-secondary" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Dasbor</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang di SchoolGrowth AI — konsultan marketing sekolah berbasis AI
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Skor Marketing</CardDescription>
            <CardTitle className="text-4xl font-bold text-primary">—</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={0} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Selesaikan Audit Marketing untuk melihat skor Anda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Level Performa</CardDescription>
            <CardTitle className="text-2xl">Belum dinilai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Jalankan audit untuk mendapatkan level performa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Laporan Dihasilkan</CardDescription>
            <CardTitle className="text-4xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mulai gunakan alat di bawah untuk menghasilkan laporan</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Alat AI</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(tool.url)}
            >
              <CardHeader className="pb-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}