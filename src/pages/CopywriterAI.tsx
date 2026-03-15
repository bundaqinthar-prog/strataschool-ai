import { useState } from "react";
import { PenTool, CheckCircle, AlertTriangle, Copy, Save, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";

const principles = [
  { title: "Fokus pada Anak, Bukan Sekolah", desc: "Ubah kata \"Kami punya...\" menjadi \"Anak Anda akan...\". Orang tua tidak membeli sekolah, mereka berinvestasi pada masa depan anak." },
  { title: "Jawab Ketakutan Orang Tua", desc: "Atasi rasa cemas mereka (takut salah pilih, takut menyesal) sebelum mereka bertanya. Validasi kekhawatiran mereka." },
  { title: "Spesifik > Umum", desc: "\"Guru mengajar 8 tahun\" lebih dipercaya daripada \"Guru berdedikasi\". Angka dan detail membangun kredibilitas." },
  { title: "Tunjukkan Bukti, Bukan Klaim", desc: "\"94% orang tua merekomendasikan kami\" lebih kuat dari \"Kami yang terbaik\". Social proof mengalahkan self-praise." },
  { title: "Bahasa Tenang & Percaya Diri", desc: "Hindari terlalu banyak tanda seru (!!!) dan nada iklan murahan. Tampil percaya diri dan jujur seperti konsultan profesional." },
];

export default function CopywriterAI() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { report, isLoading, generate, setReport, savedId } = useAIReport();

  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [klaim, setKlaim] = useState("");
  const [ketakutan, setKetakutan] = useState("");
  const [fakta, setFakta] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!klaim.trim()) {
      toast({ title: "Peringatan", description: "Mohon isi klaim/fitur yang ingin ditransformasi.", variant: "destructive" });
      return;
    }

    setShowResult(true);

    const systemPrompt = `Kamu adalah pakar copywriting pendidikan Indonesia yang memahami psikologi orang tua.
Tugasmu: Mengubah kalimat promosi sekolah dari "bahasa katalog" (Lapisan 1) menjadi "bahasa kepercayaan" (Lapisan 3) yang menyentuh emosi dan membangun trust.

ATURAN:
- Fokus pada anak dan masa depannya, bukan fasilitas sekolah
- Jawab ketakutan tersembunyi orang tua
- Gunakan fakta spesifik yang diberikan, bukan klaim umum
- Nada tenang, percaya diri, jujur — bukan nada iklan murahan
- Tulis dalam Bahasa Indonesia yang elegan dan profesional

FORMAT OUTPUT (gunakan heading markdown):
## ❌ Kalimat Asli (Lapisan 1 - Bahasa Katalog)
[Tulis ulang/parafrasa klaim asli user dalam bentuk kalimat promosi tipikal yang berlebihan]

## ✅ Kalimat Baru (Lapisan 3 - Bahasa Kepercayaan)
[Tulis kalimat transformasi yang menyentuh emosi, spesifik, dan membangun trust. Minimal 3 paragraf.]

## 🎯 Analisis Transformasi
[Jelaskan mengapa kalimat baru lebih efektif. Sebutkan prinsip yang digunakan.]

## 📱 Variasi untuk Media Sosial
[Buat 3 variasi pendek untuk Instagram/WhatsApp caption, masing-masing max 2 kalimat]

## 🖨️ Variasi untuk Brosur/Website
[Buat 1 paragraf panjang yang cocok untuk landing page atau brosur cetak]`;

    const userPrompt = `Tolong transformasi copywriting sekolah berikut:

**Klaim/Fitur yang Dijual:**
${klaim}

**Ketakutan Tersembunyi Orang Tua:**
${ketakutan || "Tidak disebutkan"}

**Fakta Spesifik/Angka Nyata:**
${fakta || "Tidak ada data spesifik"}

Transformasi kalimat di atas dari Lapisan 1 (bahasa katalog) menjadi Lapisan 3 (bahasa kepercayaan).`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "copywriter-ai",
      academicYear,
      schoolName: profile?.school_name || "",
      inputData: { klaim, ketakutan, fakta },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast({ title: "Berhasil!", description: "Teks disalin ke clipboard." });
  };

  const handleReset = () => {
    setShowResult(false);
    setReport("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PenTool className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Copywriter AI: Pesan Emosional</h1>
          </div>
          <p className="text-muted-foreground">Transformasi bahasa katalog menjadi bahasa kepercayaan yang menyentuh hati orang tua.</p>
        </div>
        <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
      </div>

      {!showResult ? (
        <Tabs defaultValue="edukasi" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edukasi">📖 Framework Komunikasi</TabsTrigger>
            <TabsTrigger value="generator">✨ Generator AI</TabsTrigger>
          </TabsList>

          {/* Tab 1: Education Panel */}
          <TabsContent value="edukasi" className="space-y-6 mt-6">
            {/* Layer Explanation */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">🎯 Target: Tembus Lapisan 3</CardTitle>
                <CardDescription>Memahami 3 lapisan komunikasi sekolah ke orang tua</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-1">
                    <Badge variant="destructive" className="mb-2">Lapisan 1</Badge>
                    <p className="font-semibold text-sm text-foreground">Apa yang Sekolah Katakan</p>
                    <p className="text-xs text-muted-foreground">Fitur & Katalog — "Kami punya lab komputer modern"</p>
                  </div>
                  <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4 space-y-1">
                    <Badge className="mb-2 bg-chart-3 text-primary-foreground hover:bg-chart-3/90">Lapisan 2</Badge>
                    <p className="font-semibold text-sm text-foreground">Apa yang Didengar</p>
                    <p className="text-xs text-muted-foreground">Manfaat — "Anak belajar teknologi sejak dini"</p>
                  </div>
                  <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 space-y-1">
                    <Badge className="mb-2 bg-secondary text-secondary-foreground">Lapisan 3</Badge>
                    <p className="font-semibold text-sm text-foreground">Apa yang Dirasakan</p>
                    <p className="text-xs text-muted-foreground">Kepercayaan & Rasa Aman — "Anak saya siap menghadapi dunia digital"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5 Golden Principles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✨ 5 Prinsip Komunikasi Emas</CardTitle>
                <CardDescription>Fondasi menulis pesan yang menyentuh emosi dan membangun kepercayaan</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {principles.map((p, i) => (
                    <AccordionItem key={i} value={`p-${i}`}>
                      <AccordionTrigger className="text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                          {p.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-6">
                        {p.desc}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Simple Test Alert */}
            <Alert className="border-chart-3/50 bg-chart-3/10">
              <AlertTriangle className="h-4 w-4 text-chart-3" />
              <AlertTitle className="font-bold text-foreground">TEST SEDERHANA</AlertTitle>
              <AlertDescription className="text-foreground/80">
                Apakah kalimat Anda bisa diucapkan oleh sekolah lain tanpa diubah? <strong>Kalau Ya = Kalimat itu terlalu umum. Ganti!</strong>
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Tab 2: Generator Form */}
          <TabsContent value="generator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🧪 Laboratorium Copywriting AI</CardTitle>
                <CardDescription>Masukkan kalimat promosi Anda, dan AI akan mentransformasikannya menjadi bahasa kepercayaan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-semibold">Klaim Umum / Fitur yang Mau Dijual <span className="text-destructive">*</span></Label>
                  <Textarea
                    placeholder='Misal: "Kami punya guru berpengalaman dan program karakter unggulan."'
                    value={klaim}
                    onChange={(e) => setKlaim(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Ketakutan Tersembunyi Orang Tua</Label>
                  <Select value={ketakutan} onValueChange={setKetakutan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ketakutan utama orang tua..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Takut anak salah pergaulan dan tidak mandiri">Takut anak salah pergaulan & tidak mandiri</SelectItem>
                      <SelectItem value="Takut salah pilih sekolah dan menyesal">Takut salah pilih sekolah & menyesal</SelectItem>
                      <SelectItem value="Takut anak tidak bisa bersaing di masa depan">Takut anak tidak bisa bersaing di masa depan</SelectItem>
                      <SelectItem value="Takut anak kehilangan nilai moral dan agama">Takut anak kehilangan nilai moral & agama</SelectItem>
                      <SelectItem value="Takut biaya tidak sepadan dengan kualitas">Takut biaya tidak sepadan dengan kualitas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Fakta Spesifik / Angka Nyata Sekolah Anda</Label>
                  <Textarea
                    placeholder='Misal: "Tahun ini 94% orang tua merekomendasikan kami, guru rata-rata mengabdi 8 tahun."'
                    value={fakta}
                    onChange={(e) => setFakta(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !klaim.trim()}
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Mengonversi bahasa katalog menjadi bahasa kepercayaan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Transformasi Kalimat dengan AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        /* Result View */
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 print:hidden">
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Ubah Input
            </Button>
            <Button variant="outline" onClick={handleCopy} disabled={!report}>
              <Copy className="mr-2 h-4 w-4" /> Salin Teks
            </Button>
            <Button variant="outline" onClick={() => window.print()} disabled={!report}>
              🖨️ Cetak PDF
            </Button>
            {savedId && (
              <Badge variant="secondary" className="self-center">
                <Save className="mr-1 h-3 w-3" /> Tersimpan
              </Badge>
            )}
          </div>

          {isLoading && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p className="text-muted-foreground font-medium">Mengonversi bahasa katalog menjadi bahasa kepercayaan...</p>
              </CardContent>
            </Card>
          )}

          {report && (
            <Card className="dashboard-print">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <PenTool className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Hasil Transformasi Copywriting</CardTitle>
                    <CardDescription>
                      {profile?.school_name || "Sekolah"} — Tahun Ajaran {academicYear}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ReportDisplay title="Hasil Transformasi Copywriting" content={report} />
              </CardContent>
            </Card>
          )}

          {/* Print signature block */}
          <div className="hidden print:block mt-16 pt-8 border-t border-border">
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-16">Mengetahui,</p>
                <div className="border-b border-foreground w-48 mx-auto mb-1" />
                <p className="text-sm font-semibold">Kepala Sekolah</p>
                <p className="text-xs text-muted-foreground">{profile?.school_name}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-16">Dibuat Oleh,</p>
                <div className="border-b border-foreground w-48 mx-auto mb-1" />
                <p className="text-sm font-semibold">Ketua Tim Marketing</p>
                <p className="text-xs text-muted-foreground">{profile?.full_name}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
