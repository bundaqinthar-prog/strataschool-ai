import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { generateReportPdf } from "@/lib/pdf-export";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2 print:hidden">
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
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3 print:hidden">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Masih menghasilkan...
          </div>
        )}
        <div className="report-markdown text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-primary mt-6 mb-3 pb-2 border-b-2 border-primary/30">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-bold text-primary mt-5 mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-base font-semibold text-foreground mt-3 mb-1">{children}</h4>
              ),
              p: ({ children }) => <p className="text-sm leading-relaxed mb-3">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1 text-sm">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1 text-sm">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              hr: () => <hr className="my-6 border-border" />,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground my-3">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-primary/10">{children}</thead>,
              tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
              tr: ({ children }) => <tr className="hover:bg-muted/30">{children}</tr>,
              th: ({ children }) => (
                <th className="px-3 py-2 text-left font-semibold text-primary border border-border align-top">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 border border-border align-top text-foreground">{children}</td>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
