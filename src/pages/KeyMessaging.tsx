import { useState } from "react";
import { MessageSquareQuote, ArrowLeft, Copy, Save, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";

export default function KeyMessaging() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { report, isLoading, generate, setReport, savedId } = useAIReport();

  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [keunggulan, setKeunggulan] = useState("");
  const [target, setTarget] = useState("");
  const [diferensiasi, setDiferensiasi] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!keunggulan.trim()) {
      toast({ title: "Peringatan", description: "Mohon isi keunggulan utama sekolah.", variant: "destructive" });
      return;
    }
    setShowResult(true);

    const systemPrompt = `Kamu adalah pakar strategi komunikasi & branding sekolah di Indonesia.
Tugasmu: Menyusun KEY MESSAGING — yaitu 3 PESAN UTAMA yang harus disampaikan secara konsisten kepada calon siswa dan orang tua.

ATURAN:
- Pesan harus tajam, mudah diingat, dan emosional
- Tiap pesan mencerminkan satu keunggulan inti sekolah
- Hindari klaim umum — gunakan bahasa yang spesifik dan membedakan
- Tulis dalam Bahasa Indonesia yang elegan dan profesional

FORMAT OUTPUT (gunakan markdown rapi):

## 🎯 Ringkasan Strategi Pesan
[2-3 kalimat menjelaskan benang merah ketiga pesan ini]

## 💬 Pesan Utama #1
**Headline:** [1 kalimat tajam, max 12 kata]
**Pesan Lengkap:** [2-3 kalimat untuk orang tua]
**Versi untuk Calon Siswa:** [1-2 kalimat dengan bahasa anak/remaja]
**Cermin Keunggulan:** [Jelaskan keunggulan sekolah apa yang tercermin di pesan ini dan mengapa kuat]
**Bukti Pendukung:** [Fakta/angka/aktivitas nyata yang bisa dipakai untuk validasi]

## 💬 Pesan Utama #2
[Format sama seperti #1]

## 💬 Pesan Utama #3
[Format sama seperti #1]

## 📋 Tabel Penggunaan Pesan
| Channel | Pesan #1 | Pesan #2 | Pesan #3 |
|---------|----------|----------|----------|
| Instagram | ... | ... | ... |
| WhatsApp Broadcast | ... | ... | ... |
| Brosur/Banner | ... | ... | ... |
| Open House / Presentasi | ... | ... | ... |

## ✅ Tips Implementasi
[3-5 poin praktis agar pesan ini konsisten dipakai seluruh tim]`;

    const userPrompt = `Susun 3 Key Messaging untuk sekolah:

**Nama Sekolah:** ${profile?.school_name || "(belum diisi)"}
**Keunggulan Utama Sekolah:**
${keunggulan}

**Target Audiens (calon siswa & orang tua):**
${target || "Orang tua kelas menengah yang peduli karakter & masa depan anak"}

**Diferensiasi dari Kompetitor:**
${diferensiasi || "Belum disebutkan secara spesifik"}

Hasilkan 3 pesan utama yang ingin disampaikan ke calon siswa & orang tua, lengkap dengan penjelasan bagaimana setiap pesan mencerminkan keunggulan sekolah.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "key-messaging",
      academicYear,
      schoolName: profile?.school_name || "",
      inputData: { keunggulan, target, diferensiasi },
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Key Messaging Sekolah</h1>
          </div>
          <p className="text-muted-foreground">
            Hasilkan 3 pesan utama yang ingin disampaikan ke calon siswa & orang tua, beserta cara pesan tersebut mencerminkan keunggulan sekolah.
          </p>
        </div>
        <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
      </div>

      {!showResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧠 Input Data Strategis</CardTitle>
            <CardDescription>Semakin spesifik input, semakin tajam pesan yang dihasilkan AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold">
                Keunggulan Utama Sekolah <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder='Contoh: "Pembentukan karakter berbasis Quran, kelas kecil maks 18 siswa, guru tersertifikasi internasional, program coding sejak kelas 3."'
                value={keunggulan}
                onChange={(e) => setKeunggulan(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Target Audiens</Label>
              <Input
                placeholder='Contoh: "Orang tua muslim profesional usia 30-45 di kota besar"'
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Diferensiasi dari Kompetitor</Label>
              <Textarea
                placeholder='Contoh: "Beda dari sekolah lain karena memadukan tahfidz + STEM + entrepreneurship sejak SD."'
                value={diferensiasi}
                onChange={(e) => setDiferensiasi(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !keunggulan.trim()}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyusun pesan utama...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Hasilkan 3 Key Messaging
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
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

          {isLoading && !report && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p className="text-muted-foreground font-medium">AI sedang merangkai pesan utama...</p>
              </CardContent>
            </Card>
          )}

          {report && (
            <Card className="dashboard-print">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <MessageSquareQuote className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>3 Key Messaging Sekolah</CardTitle>
                    <CardDescription>
                      {profile?.school_name || "Sekolah"} — Tahun Ajaran {academicYear}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ReportDisplay title="3 Key Messaging Sekolah" content={report} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
