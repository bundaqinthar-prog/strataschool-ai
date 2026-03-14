import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle, Printer, ClipboardCheck, CheckCircle2,
  Clock, FileText, ArrowRight, BarChart3,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

interface AuditScore {
  totalPercentage: number;
  totalAverage: number;
  totalScore: number;
  maxScore: number;
  level: string;
  aspectScores: Array<{ id: string; title: string; percentage: number; average: number; score: number; maxScore: number }>;
}

interface AuditReport {
  score: AuditScore;
  ai_report_result: string;
  created_at: string;
  school_name: string;
}

function getStatusBadge(level: string) {
  if (level === "Kuat" || level === "Selaras")
    return { label: "🟢 Selaras", variant: "default" as const, className: "bg-secondary text-secondary-foreground" };
  if (level === "Cukup" || level === "Perbaikan")
    return { label: "🟠 Perlu Perbaikan", variant: "outline" as const, className: "border-chart-3 text-chart-3 bg-chart-3/10" };
  return { label: "🔴 Kritis", variant: "destructive" as const, className: "" };
}

function getWeakestArea(aspects: AuditScore["aspectScores"]) {
  if (!aspects || aspects.length === 0) return null;
  return aspects.reduce((min, a) => (a.percentage < min.percentage ? a : min), aspects[0]);
}

function parseTimeline(text: string) {
  const weeks: { title: string; items: string[] }[] = [];
  const weekRegex = /#+\s*(Minggu\s+\d+[^\n]*)/gi;
  const parts = text.split(weekRegex);
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim();
    const body = parts[i + 1] || "";
    const items = body.split("\n").map(l => l.replace(/^[-*•]\s*/, "").trim()).filter(l => l.length > 5 && !l.startsWith("#"));
    if (title && items.length > 0) weeks.push({ title, items: items.slice(0, 5) });
  }
  return weeks;
}

function extractExecSummary(text: string): string {
  const match = text.match(/(?:ringkasan|kesimpulan|executive|summary)[^\n]*\n([\s\S]{100,600}?)(?=\n#|\n\*\*Minggu|\n---)/i);
  if (match) return match[1].trim();
  const paragraphs = text.split("\n\n").filter(p => p.length > 80 && !p.startsWith("#") && !p.startsWith("-"));
  return paragraphs[0]?.substring(0, 500) || "";
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-52" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}><CardHeader><Skeleton className="h-6 w-32" /><Skeleton className="h-10 w-24 mt-2" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
    </div>
  );
}

// Empty state
function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileText className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Belum Ada Riwayat Laporan</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Anda belum memiliki riwayat laporan. Silakan mulai audit pertama Anda untuk mengetahui kesehatan marketing sekolah.
      </p>
      <Button size="lg" onClick={() => navigate("/audit")} className="gap-2 text-base px-8">
        <ClipboardCheck className="h-5 w-5" /> Mulai Audit Sekarang <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [audit, setAudit] = useState<AuditReport | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchLatest = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("ai_reports")
        .select("score, ai_report_result, created_at, school_name")
        .eq("user_id", user.id)
        .eq("feature_used", "Marketing Audit")
        .not("score", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.score) {
        setAudit({
          score: data.score as unknown as AuditScore,
          ai_report_result: data.ai_report_result,
          created_at: data.created_at,
          school_name: data.school_name,
        });
      }
      setLoading(false);
    };
    fetchLatest();
  }, [user]);

  if (loading) return <DashboardSkeleton />;
  if (!audit) return <EmptyState />;

  const { score, ai_report_result, created_at, school_name } = audit;
  const status = getStatusBadge(score.level);
  const weakest = getWeakestArea(score.aspectScores);
  const timeline = parseTimeline(ai_report_result);
  const execSummary = extractExecSummary(ai_report_result);

  const radarData = score.aspectScores?.map(a => ({
    area: a.title.length > 16 ? a.title.substring(0, 14) + "…" : a.title,
    skor: a.percentage,
    fullMark: 100,
  })) || [];

  const barData = score.aspectScores?.map(a => ({
    name: a.title.length > 12 ? a.title.substring(0, 10) + "…" : a.title,
    skor: a.percentage,
  })) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto dashboard-print">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Hasil audit terakhir — {school_name} · {new Date(created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Button onClick={() => window.print()} className="gap-2 print:hidden" size="lg">
          <Printer className="h-4 w-4" /> Cetak Laporan Hasil (PDF)
        </Button>
      </div>

      {/* Top 3 Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" /> Skor Audit Terakhir
            </CardDescription>
            <CardTitle className="text-4xl font-extrabold text-primary">
              {score.totalScore ?? Math.round((score.totalPercentage / 100) * 3000)}
              <span className="text-lg font-normal text-muted-foreground"> / 3000</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={score.totalPercentage} className="h-2.5 mb-2" />
            <Badge className={status.className}>{status.label}</Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Area Terlemah
            </CardDescription>
            <CardTitle className="text-xl font-bold text-destructive">
              {weakest?.title ?? "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Skor: {weakest?.percentage ?? 0}% — area ini memerlukan perhatian segera.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Status Action Plan
            </CardDescription>
            <CardTitle className="text-xl font-bold">
              {timeline.length > 0 ? "Menunggu Eksekusi" : "Belum Tersedia"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {timeline.length > 0
                ? `Rencana aksi 30 hari siap (${timeline.length} minggu).`
                : "Jalankan audit untuk generate action plan."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Radar Perbandingan 6 Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Skor" dataKey="skor" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Skor per Area (Bar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="skor" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      {execSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💡 Saran Perbaikan & Rekomendasi AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{execSummary}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline Action Plan */}
      {timeline.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">📋 Rencana Aksi 30 Hari</CardTitle>
            <CardDescription>Timeline eksekusi perbaikan marketing sekolah Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-primary/30 ml-4 space-y-6">
              {timeline.map((week, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{week.title}</h4>
                  <ul className="space-y-1.5">
                    {week.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Print-only signature block */}
      <div className="hidden print:block mt-16 pt-8 border-t border-border">
        <div className="flex justify-between px-8">
          <div className="text-center">
            <p className="text-sm font-semibold mb-16">Mengetahui,</p>
            <div className="border-b border-foreground w-48 mb-1" />
            <p className="text-sm font-semibold">Kepala Sekolah</p>
            <p className="text-xs text-muted-foreground">{school_name}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold mb-16">Dibuat Oleh,</p>
            <div className="border-b border-foreground w-48 mb-1" />
            <p className="text-sm font-semibold">Ketua Tim Marketing</p>
            <p className="text-xs text-muted-foreground">{profile?.full_name || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
