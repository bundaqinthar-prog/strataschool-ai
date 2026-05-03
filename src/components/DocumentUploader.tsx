import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Upload, X, FileCheck2 } from "lucide-react";
import { parseDocument, type ParsedDocument } from "@/lib/document-parser";

interface Props {
  documents: ParsedDocument[];
  onChange: (docs: ParsedDocument[]) => void;
  maxFiles?: number;
  label?: string;
  description?: string;
}

const ACCEPT = ".pdf,.docx,.txt,.md,.csv";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function DocumentUploader({
  documents,
  onChange,
  maxFiles = 5,
  label = "Unggah Dokumen Pendukung",
  description = "AI akan menarik poin kunci dari dokumen ini untuk memperkaya analisis.",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxFiles - documents.length;
    if (remaining <= 0) {
      toast({ title: "Batas tercapai", description: `Maksimal ${maxFiles} dokumen.`, variant: "destructive" });
      return;
    }
    const toProcess = Array.from(files).slice(0, remaining);
    setParsing(true);
    const parsed: ParsedDocument[] = [];
    for (const f of toProcess) {
      try {
        const doc = await parseDocument(f);
        parsed.push(doc);
      } catch (e: any) {
        toast({ title: "Gagal membaca dokumen", description: e.message, variant: "destructive" });
      }
    }
    setParsing(false);
    if (parsed.length > 0) {
      onChange([...documents, ...parsed]);
      toast({ title: "Dokumen siap dianalisis", description: `${parsed.length} dokumen berhasil diproses.` });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (idx: number) => onChange(documents.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" /> {label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          <p className="text-xs text-muted-foreground">
            Format: PDF, DOCX, TXT, MD, CSV • Maks {maxFiles} file • 15MB/file
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={parsing || documents.length >= maxFiles}
        >
          {parsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="ml-2">Pilih File</span>
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((d, i) => (
            <Card key={i} className="border-primary/20 bg-primary/5">
              <CardContent className="py-3 px-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FileCheck2 className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{d.fileName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatBytes(d.size)}</span>
                      {d.pageCount && <span>• {d.pageCount} hlm</span>}
                      <span>• {d.text.length.toLocaleString("id-ID")} karakter</span>
                      {d.truncated && (
                        <Badge variant="outline" className="text-[10px] py-0 h-4">
                          terpotong
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {documents.length === 0 && !parsing && (
        <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          <FileText className="h-5 w-5 mx-auto mb-1 opacity-50" />
          Belum ada dokumen. Unggah Rapor Pendidikan, RKAS, laporan akreditasi, atau dokumen lain yang relevan.
        </div>
      )}
    </div>
  );
}
