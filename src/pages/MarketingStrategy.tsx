import { useState } from "react";
import { FileSpreadsheet, ArrowLeft, Loader2, Sparkles, Save } from "lucide-react";
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

export default function MarketingStrategy() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { report, isLoading, generate, setReport, savedId } = useAIReport();

  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [tujuan, setTujuan] = useState("");
  const [targetSiswa, setTargetSiswa] = useState("");
  const [keunggulan, setKeunggulan] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [periode, setPeriode] = useState("12 bulan");
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!tujuan.trim() || !keunggulan.trim()) {
      toast({ title: "Peringatan", description: "Mohon isi tujuan pemasaran & keunggulan sekolah.", variant: "destructive" });
      return;
    }
    setShowResult(true);

    const systemPrompt = `Kamu adalah konsultan strategi marketing sekolah profesional di Indonesia.
Tugasmu: Menyusun DOKUMEN STRATEGI MARKETING SEKOLAH yang lengkap, terstruktur, dan siap dieksekusi tim sekolah.

ATURAN:
- Gunakan Bahasa Indonesia yang profesional
- Setiap bagian harus konkret, spesifik, dan actionable (tidak normatif)
- Gunakan tabel markdown untuk anggaran dan jadwal
- Buat dokumen seolah-olah ini akan dipresentasikan ke Yayasan/Kepala Sekolah

FORMAT OUTPUT (markdown rapi, gunakan struktur ini secara berurutan):

# 📘 Dokumen Strategi Marketing Sekolah

## 1. 🏫 Profil Sekolah
[Ringkasan profil sekolah berdasarkan input]

## 2. 🎯 Tujuan Pemasaran
- Tujuan utama (SMART goals)
- Target jumlah pendaftar
- KPI keberhasilan

## 3. 👥 Segmentasi Pasar
[Bagi pasar menjadi 2-3 segmen utama dengan deskripsi demografis, psikografis, geografis]

## 4. 🧭 Positioning Sekolah
**Positioning Statement:** [1 kalimat tajam]
[Penjelasan kenapa positioning ini relevan & berbeda]

## 5. 💬 Key Messaging
3 pesan utama:
1. **Pesan #1** — [headline + deskripsi]
2. **Pesan #2** — [headline + deskripsi]
3. **Pesan #3** — [headline + deskripsi]

## 6. 📡 Saluran Pemasaran
| Saluran | Tujuan | Aktivitas Utama | Frekuensi |
|---------|--------|-----------------|-----------|
| Instagram | ... | ... | ... |
| WhatsApp | ... | ... | ... |
| Open House | ... | ... | ... |
| Brosur/Flyer | ... | ... | ... |
| Word of Mouth | ... | ... | ... |
| Google/SEO | ... | ... | ... |

## 7. 💰 Anggaran Pemasaran
| Pos Anggaran | Estimasi (Rp) | % Total | Catatan |
|--------------|--------------:|--------:|---------|
| Konten & Sosmed | ... | ... | ... |
| Iklan berbayar | ... | ... | ... |
| Event/Open House | ... | ... | ... |
| Cetak (brosur/banner) | ... | ... | ... |
| Endorse/Influencer lokal | ... | ... | ... |
| Lain-lain | ... | ... | ... |
| **TOTAL** | ... | 100% | |

## 8. 📅 Jadwal Implementasi (Timeline)
| Bulan | Fokus Utama | Aktivitas Kunci | PIC |
|-------|-------------|-----------------|-----|
| Bulan 1 | ... | ... | ... |
| Bulan 2 | ... | ... | ... |
| ... | ... | ... | ... |

## 9. 📊 Indikator Keberhasilan (KPI)
[List KPI yang diukur per bulan/kuartal]

## 10. ✅ Rekomendasi Eksekusi
[5-7 poin praktis agar strategi ini berhasil dijalankan]`;

    const userPrompt = `Susun Dokumen Strategi Marketing untuk sekolah berikut:

**Nama Sekolah:** ${profile?.school_name || "(belum diisi)"}
**Lokasi:** ${profile?.city || ""} ${profile?.province || ""}
**Alamat:** ${profile?.address || "-"}

**Tujuan Pemasaran:**
${tujuan}

**Target Calon Siswa:**
${targetSiswa || "Orang tua kelas menengah yang peduli pendidikan karakter & masa depan anak"}

**Keunggulan Sekolah:**
${keunggulan}

**Anggaran Total:** ${anggaran || "Belum ditentukan — buat estimasi realistis sesuai skala sekolah menengah"}
**Periode Implementasi:** ${periode}
**Tahun Ajaran:** ${academicYear}

Buatkan dokumen strategi marketing lengkap yang siap diunduh dan dipresentasikan ke Yayasan/Kepala Sekolah.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "marketing-strategy",
      academicYear,
      schoolName: profile?.school_name || "",
      inputData: { tujuan, targetSiswa, keunggulan, anggaran, periode },
    });
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
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Strategi Marketing Sekolah</h1>
          </div>
          <p className="text-muted-foreground">
            Hasilkan dokumen strategi marketing lengkap (profil, tujuan, segmentasi, positioning, key messaging, saluran, anggaran, & jadwal) — siap diunduh sebagai PDF.
          </p>
        </div>
        <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
      </div>

      {!showResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧠 Input Data Strategis</CardTitle>
            <CardDescription>Isi sedetail mungkin agar dokumen strategi yang dihasilkan tajam & realistis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="font-semibold">
                Tujuan Pemasaran <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder='Contoh: "Mendapatkan 120 pendaftar baru di TA 2025/2026, meningkatkan brand awareness di kota X, membangun reputasi sebagai sekolah karakter."'
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">
                Keunggulan Sekolah <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder='Contoh: "Tahfidz 5 juz, kelas kecil 18 siswa, guru tersertifikasi, program coding & entrepreneurship."'
                value={keunggulan}
                onChange={(e) => setKeunggulan(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Target Calon Siswa & Orang Tua</Label>
              <Textarea
                placeholder='Contoh: "Orang tua muslim profesional 30-45 tahun di kota X, penghasilan menengah ke atas, peduli karakter."'
                value={targetSiswa}
                onChange={(e) => setTargetSiswa(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Anggaran Marketing (Rp)</Label>
                <Input
                  placeholder="Contoh: 50.000.000"
                  value={anggaran}
                  onChange={(e) => setAnggaran(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Periode Implementasi</Label>
                <Input
                  placeholder="Contoh: 12 bulan / 6 bulan"
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isLoading || !tujuan.trim() || !keunggulan.trim()}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyusun dokumen strategi...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Hasilkan Dokumen Strategi Marketing
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
                <p className="text-muted-foreground font-medium">AI sedang menyusun dokumen strategi marketing...</p>
              </CardContent>
            </Card>
          )}

          {(report || isLoading) && (
            <ReportDisplay
              title="📘 Dokumen Strategi Marketing Sekolah"
              content={report}
              isLoading={isLoading}
              pdfMeta={{
                schoolName: profile?.school_name || "",
                featureName: "Dokumen Strategi Marketing Sekolah",
                academicYear,
                inputSummary: `Tujuan: ${tujuan}\nKeunggulan: ${keunggulan}\nTarget: ${targetSiswa}\nAnggaran: ${anggaran}\nPeriode: ${periode}`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
