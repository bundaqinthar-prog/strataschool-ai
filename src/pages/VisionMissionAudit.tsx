import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScanSearch, Sparkles, RotateCcw } from "lucide-react";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function VisionMissionAudit() {
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [arahBaru, setArahBaru] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const { report, isLoading, generate, setReport } = useAIReport();
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!visi.trim() || !misi.trim()) {
      toast({ title: "Lengkapi data", description: "Visi dan misi wajib diisi.", variant: "destructive" });
      return;
    }
    if (!academicYear) {
      toast({ title: "Pilih tahun ajaran", variant: "destructive" });
      return;
    }

    const systemPrompt = `Anda adalah konsultan branding & strategi sekolah Indonesia yang JUJUR, TAJAM, TIDAK BERTELE-TELE, dan FOKUS PADA PERBAIKAN NYATA. Tulis dalam Bahasa Indonesia yang profesional. Gunakan format markdown dengan header, tabel, dan daftar yang rapi. Hindari basa-basi.`;

    const userPrompt = `Analisis visi dan misi sekolah berikut:

**Sekolah:** ${profile?.school_name || "—"}
**Tahun Ajaran:** ${academicYear}

**Visi saat ini:**
${visi}

**Misi saat ini:**
${misi}

${arahBaru.trim() ? `**Arah baru sekolah (opsional):**\n${arahBaru}\n` : ""}

Lakukan audit mendalam dengan format berikut (gunakan heading ## untuk setiap bagian):

## 1. Penilaian Umum
- Apakah visi jelas atau terlalu umum?
- Apakah misi operasional atau hanya normatif?

## 2. Kelemahan Utama
Identifikasi (gunakan tabel jika perlu):
- Terlalu abstrak?
- Tidak bisa diukur?
- Tidak membedakan dari sekolah lain?
- Tidak relevan dengan kebutuhan orang tua saat ini?

## 3. Gap dengan Kebutuhan Nyata
Bandingkan dengan kebutuhan orang tua zaman sekarang dalam tabel dengan kolom: Kebutuhan | Sudah Tercakup? | Catatan. Aspek: karakter anak, lifeskill, teknologi, masa depan anak.

## 4. Rekomendasi Perbaikan
### Visi Versi Perbaikan
(lebih tajam, lebih spesifik, tetap singkat)

### Misi Versi Perbaikan
(lebih operasional, berbasis aktivitas nyata — buat 4-6 poin)

## 5. Versi Marketing
👉 **Headline (1 kalimat utama):**
👉 **Penjelasan 30 detik (elevator pitch):**

## 6. Skor Kekuatan (1–10)
Buat tabel skor untuk: Kejelasan, Kekuatan Diferensiasi, Kemudahan Implementasi. Sertakan skor visi LAMA dan visi BARU agar terlihat peningkatannya.

Akhiri dengan **Kesimpulan & Langkah Selanjutnya** maksimal 3 poin.`;

    generate(systemPrompt, userPrompt, {
      featureUsed: "Audit Visi & Misi",
      academicYear,
      schoolName: profile?.school_name || "Unknown",
      inputData: { visi, misi, arahBaru, academicYear },
    });
  };

  const handleReset = () => {
    setVisi("");
    setMisi("");
    setArahBaru("");
    setReport("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ScanSearch className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Visi & Misi</h1>
          <p className="text-sm text-muted-foreground">
            Evaluator AI yang jujur & tajam — bedah visi-misi sekolah, temukan gap, dapatkan versi perbaikan.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Input Visi & Misi</CardTitle>
          <CardDescription>Tempelkan visi dan misi sekolah Anda saat ini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />

          <div className="space-y-2">
            <Label htmlFor="visi">Visi Sekolah Saat Ini *</Label>
            <Textarea
              id="visi"
              placeholder="Contoh: Menjadi sekolah unggul yang berakhlak mulia dan berprestasi..."
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              rows={3}
              maxLength={1500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="misi">Misi Sekolah Saat Ini *</Label>
            <Textarea
              id="misi"
              placeholder="Tulis setiap poin misi pada baris baru..."
              value={misi}
              onChange={(e) => setMisi(e.target.value)}
              rows={6}
              maxLength={3000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arah">Arah Baru Sekolah (opsional)</Label>
            <Textarea
              id="arah"
              placeholder="Misal: ingin fokus ke karakter & teknologi, target segmen menengah-atas, dll."
              value={arahBaru}
              onChange={(e) => setArahBaru(e.target.value)}
              rows={3}
              maxLength={1500}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Sparkles className="h-4 w-4 mr-1" />
              {isLoading ? "Menganalisis..." : "Audit Sekarang"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReportDisplay
        title="Hasil Audit Visi & Misi"
        content={report}
        isLoading={isLoading}
        pdfMeta={{
          schoolName: profile?.school_name || "Sekolah",
          featureName: "Audit Visi & Misi",
          academicYear,
          inputSummary: `Visi: ${visi.slice(0, 200)}...\n\nMisi: ${misi.slice(0, 300)}...`,
        }}
      />
    </div>
  );
}
