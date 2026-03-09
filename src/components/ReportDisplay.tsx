import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportDisplayProps {
  title: string;
  content: string;
  isLoading?: boolean;
}

export function ReportDisplay({ title, content, isLoading }: ReportDisplayProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied!", description: "Report copied to clipboard." });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content && !isLoading) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {content && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && !content && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Generating report...
          </div>
        )}
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
          {content}
        </div>
      </CardContent>
    </Card>
  );
}
