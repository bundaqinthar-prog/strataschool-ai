import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { generateReportPdf } from "@/lib/pdf-export";

interface ReportDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
  pdfMeta?: {
    schoolName: string;
    featureName: string;
    academicYear: string;
    inputSummary?: string;
    scores?: Record<string, unknown> | null;
  };
}

export function ReportDisplay({ title, content, isLoading, pdfMeta }: ReportDisplayProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Berhasil disalin!", description: "Laporan telah disalin ke clipboard." });
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-laporan.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!pdfMeta) return;
    generateReportPdf({
      schoolName: pdfMeta.schoolName,
      featureName: pdfMeta.featureName,
      academicYear: pdfMeta.academicYear,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      inputSummary: pdfMeta.inputSummary,
      reportContent: content,
      scores: pdfMeta.scores,
    });
  };

  if (!content && !isLoading) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {content && !isLoading && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" /> Salin
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadMd}>
              <Download className="h-4 w-4 mr-1" /> Unduh MD
            </Button>
            {pdfMeta && (
              <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <FileText className="h-4 w-4 mr-1" /> Unduh PDF
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/history")}>
              <History className="h-4 w-4 mr-1" /> Riwayat
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && !content && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Sedang membuat laporan...
          </div>
        )}
        {isLoading && content && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Masih menghasilkan...
          </div>
        )}
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
