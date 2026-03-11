import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClipboardCheck, Search, Target, Users, TrendingUp,
  Calendar, UserCircle, Shield, BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

interface AuditScore {
  totalPercentage: number;
  totalAverage: number;
  level: string;
  aspectScores: Array<{ id: string; title: string; percentage: number; average: number }>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reportCount, setReportCount] = useState(0);
  const [latestAudit, setLatestAudit] = useState<AuditScore | null>(null);
  const [yearFilter, setYearFilter] = useState("all");
  const [years, setYears] = useState<string[]>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; score: number }>>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Get all reports for year list
      const { data: allReports } = await supabase
        .from("ai_reports")
        .select("academic_year, feature_used, score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (allReports) {
        const uniqueYears = [...new Set(allReports.map((r) => r.academic_year))];
        setYears(uniqueYears);

        const filtered = yearFilter === "all" ? allReports : allReports.filter((r) => r.academic_year === yearFilter);
        setReportCount(filtered.length);

        // Find latest audit
        const audits = filtered.filter((r) => r.feature_used === "Marketing Audit" && r.score);
        if (audits.length > 0) {
          setLatestAudit(audits[0].score as unknown as AuditScore);

          // Chart data from audit scores across years
          const auditsByYear = allReports
            .filter((r) => r.feature_used === "Marketing Audit" && r.score)
            .reduce((acc, r) => {
              if (!acc[r.academic_year]) {
                acc[r.academic_year] = (r.score as unknown as AuditScore).totalPercentage;
              }
              return acc;
            }, {} as Record<string, number>);

          setChartData(
            Object.entries(auditsByYear)
              .map(([name, score]) => ({ name, score }))
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        } else {
          setLatestAudit(null);
        }
      }
    };

    fetchData();
  }, [user, yearFilter]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dasbor</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang di SchoolGrowth AI — konsultan marketing sekolah berbasis AI
          </p>
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tahun Ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Skor Marketing</CardDescription>
            <CardTitle className="text-4xl font-bold text-primary">
              {latestAudit ? `${latestAudit.totalPercentage}%` : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={latestAudit?.totalPercentage ?? 0} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {latestAudit ? `Rata-rata: ${latestAudit.totalAverage}/5` : "Selesaikan Audit Marketing untuk melihat skor Anda"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Level Performa</CardDescription>
            <CardTitle className={`text-2xl ${
              latestAudit?.level === "Kuat" ? "text-secondary" : latestAudit?.level === "Cukup" ? "text-yellow-500" : latestAudit ? "text-destructive" : ""
            }`}>
              {latestAudit?.level ?? "Belum dinilai"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {latestAudit ? "Berdasarkan audit marketing terbaru" : "Jalankan audit untuk mendapatkan level performa"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Laporan Dihasilkan</CardDescription>
            <CardTitle className="text-4xl font-bold">{reportCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {reportCount > 0 ? "Total laporan yang telah dibuat" : "Mulai gunakan alat di bawah untuk menghasilkan laporan"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category scores */}
      {latestAudit?.aspectScores && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5" /> Skor per Kategori Marketing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestAudit.aspectScores.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{a.title}</span>
                  <span className="text-muted-foreground">{a.percentage}%</span>
                </div>
                <Progress value={a.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Skor Marketing per Tahun Ajaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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
