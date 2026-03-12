import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Copy, FileText, History, Printer, Download, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { generateReportPdf } from "@/lib/pdf-export";
import { calculateScores } from "@/lib/audit-questions";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

interface AuditReportViewProps {
  scores: ReturnType<typeof calculateScores>;
  report: string;
  isLoading: boolean;
  academicYear: string;
  schoolName: string;
  evaluatorName: string;
  onReset: () => void;
}

export function AuditReportView({
  scores, report, isLoading, academicYear, schoolName, evaluatorName, onReset,
}: AuditReportViewProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const weakest = [...scores.aspectScores].sort((a, b) => a.percentage - b.percentage)[0];

  const statusColor = scores.totalPercentage < 40
    ? "bg-destructive text-destructive-foreground"
    : scores.totalPercentage < 70
    ? "bg-yellow-500 text-foreground"
    : "bg-secondary text-secondary-foreground";

  const statusLabel = scores.totalPercentage < 40
    ? "Kritis — Perlu Intervensi Segera"
    : scores.totalPercentage < 70
    ? "Perlu Perbaikan Signifikan"
    : "Siap & Selaras";

  const StatusIcon = scores.totalPercentage < 40 ? AlertTriangle : scores.totalPercentage < 70 ? AlertCircle : CheckCircle2;

  const radarData = scores.aspectScores.map((a) => ({
    area: a.title.length > 16 ? a.title.slice(0, 14) + "…" : a.title,
    skor: a.percentage,
    fullMark: 100,
  }));

  const barData = scores.aspectScores.map((a) => ({
    name: a.title.split(" ").slice(0, 2).join(" "),
    Skor: a.percentage,
  }));

  const handlePrint = () => window.print();

  const handlePdf = () => {
    generateReportPdf({
      schoolName,
      featureName: "Audit Marketing",
      academicYear,
      date: today,
      reportContent: report,
      scores: scores as unknown as Record<string, unknown>,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast({ title: "Berhasil disalin!" });
  };

  // Parse AI report into sections for timeline
  const parseTimeline = (text: string) => {
    const weeks: { title: string; items: string[] }[] = [];
    const lines = text.split("\n");
    let current: { title: string; items: string[] } | null = null;
    for (const line of lines) {
      const weekMatch = line.match(/(?:minggu|week)\s*(\d)/i);
      if (weekMatch) {
        current = { title: `Minggu ${weekMatch[1]}`, items: [] };
        weeks.push(current);
      } else if (current && line.trim().startsWith("-")) {
        current.items.push(line.trim().replace(/^-\s*/, "").replace(/\*\*/g, ""));
      }
    }
    return weeks;
  };

  const timeline = parseTimeline(report);

  return (
    <div className="audit-report max-w-5xl mx-auto space-y-8">
      {/* Action Bar - hidden in print */}
      <div className="flex flex-wrap gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="h-4 w-4 mr-1" /> Salin</Button>
        <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="h-4 w-4 mr-1" /> Cetak</Button>
        <Button variant="outline" size="sm" onClick={handlePdf}><FileText className="h-4 w-4 mr-1" /> Unduh PDF</Button>
        <Button variant="outline" size="sm" onClick={() => navigate("/history")}><History className="h-4 w-4 mr-1" /> Riwayat</Button>
      </div>

      {/* Report Header */}
      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:p-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Laporan Eksekutif</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">Audit Marketing Sekolah</h1>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div><span className="text-muted-foreground">Sekolah:</span> <span className="font-semibold">{schoolName}</span></div>
          <div><span className="text-muted-foreground">Tanggal Audit:</span> <span className="font-semibold">{today}</span></div>
          <div><span className="text-muted-foreground">Evaluator:</span> <span className="font-semibold">{evaluatorName}</span></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Tahun Ajaran {academicYear}</p>
      </div>

      {/* Hero Score + Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-2">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-extrabold text-primary">{scores.totalPercentage}%</span>
              <span className="text-xs text-muted-foreground mt-1">Marketing Health</span>
            </div>
            <div className="flex-1 space-y-2">
              <Progress value={scores.totalPercentage} className="h-3" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Skor:</span> <strong>{scores.totalScore}/{scores.totalMax}</strong></div>
                <div><span className="text-muted-foreground">Rata-rata:</span> <strong>{scores.totalAverage}/5</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-full p-3 ${statusColor}`}>
              <StatusIcon className="h-8 w-8" />
            </div>
            <div>
              <Badge className={`text-sm px-3 py-1 ${statusColor}`}>{scores.level}</Badge>
              <p className="text-sm text-muted-foreground mt-2">{statusLabel}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Breakdown Grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">Skor per Area</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scores.aspectScores.map((a) => {
            const isWeakest = a.id === weakest.id;
            return (
              <Card key={a.id} className={`transition-shadow ${isWeakest ? "border-destructive/50 bg-destructive/5 shadow-md" : ""}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{a.title}</span>
                    {isWeakest && <Badge variant="destructive" className="text-[10px]">Area Terlemah</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-primary">{a.percentage}%</div>
                  <Progress value={a.percentage} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Rata-rata: {a.average}/5</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts + Executive Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Radar Performa</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Skor" dataKey="skor" stroke="hsl(220,70%,45%)" fill="hsl(220,70%,45%)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Perbandingan Area</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Skor" fill="hsl(220,70%,45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Report Content */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan & Analisis AI</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !report && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Sedang membuat laporan...
            </div>
          )}
          {isLoading && report && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Masih menghasilkan...
            </div>
          )}
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {report}
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Action Plan Timeline */}
      {timeline.length > 0 && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 md:p-8 print:bg-transparent">
          <h2 className="text-lg font-bold mb-6 text-primary">📋 Rencana Aksi 30 Hari</h2>
          <div className="space-y-6">
            {timeline.map((week, wi) => (
              <div key={wi} className="relative pl-8 border-l-2 border-primary/30">
                <div className="absolute -left-2.5 top-0 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {wi + 1}
                </div>
                <h3 className="font-semibold text-sm mb-2">{week.title}</h3>
                <ul className="space-y-1">
                  {week.items.map((item, ii) => (
                    <li key={ii} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-secondary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature block — print only */}
      <div className="hidden print:block mt-16 pt-8 border-t">
        <div className="grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Mengetahui,</p>
            <p className="font-semibold mt-16">Kepala Sekolah</p>
            <div className="border-b border-foreground/30 w-48 mx-auto mt-1" />
          </div>
          <div>
            <p className="text-muted-foreground">Dibuat Oleh,</p>
            <p className="font-semibold mt-16">Ketua Tim Marketing</p>
            <div className="border-b border-foreground/30 w-48 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="print:hidden">
        <Button variant="outline" onClick={onReset}>Mulai Audit Baru</Button>
      </div>
    </div>
  );
}
