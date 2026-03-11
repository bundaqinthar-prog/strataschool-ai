import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateReportPdf } from "@/lib/pdf-export";
import { FileText, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  school_name: string;
  feature_used: string;
  academic_year: string;
  input_data: Record<string, unknown>;
  ai_report_result: string;
  score: Record<string, unknown> | null;
  created_at: string;
}

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("ai_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (yearFilter !== "all") query = query.eq("academic_year", yearFilter);
    if (featureFilter !== "all") query = query.eq("feature_used", featureFilter);

    const { data } = await query;
    setReports((data as Report[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, [user, yearFilter, featureFilter]);

  const years = [...new Set(reports.map((r) => r.academic_year))];
  const features = [...new Set(reports.map((r) => r.feature_used))];

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ai_reports").delete().eq("id", id);
    if (!error) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Dihapus", description: "Laporan berhasil dihapus." });
    }
  };

  const handlePdf = (r: Report) => {
    generateReportPdf({
      schoolName: r.school_name,
      featureName: r.feature_used,
      academicYear: r.academic_year,
      date: new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      reportContent: r.ai_report_result,
      scores: r.score,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Riwayat Laporan</h1>
        <p className="text-muted-foreground mt-1">Lihat semua laporan AI yang telah Anda buat</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tahun Ajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={featureFilter} onValueChange={setFeatureFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Fitur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Fitur</SelectItem>
            {features.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat laporan...</div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Belum ada laporan. Mulai gunakan fitur AI untuk membuat laporan pertama Anda.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base">{r.feature_used}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.school_name} • {r.academic_year} • {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                      {expandedId === r.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePdf(r)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === r.id && (
                <CardContent>
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground text-sm max-h-96 overflow-y-auto">
                    {r.ai_report_result}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
