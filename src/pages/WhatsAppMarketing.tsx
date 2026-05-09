import { useState } from "react";
import { MessageCircleMore, ArrowLeft, Loader2, Sparkles, Save } from "lucide-react";
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

export default function WhatsAppMarketing() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { report, isLoading, generate, setReport, savedId } = useAIReport();

  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [positioning, setPositioning] = useState("");
  const [keunggulan, setKeunggulan] = useState("");
  const [visiMisi, setVisiMisi] = useState("");
  const [bahasaMarketing, setBahasaMarketing] = useState("");
  const [targetAudiens, setTargetAudiens] = useState("");
  const [periodePPDB, setPeriodePPDB] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = async () => {
    if (!keunggulan.trim()) {
      toast({ title: "Peringatan", description: "Mohon isi minimal keunggulan sekolah.", variant: "destructive" });
      return;
    }
    setShowResult(true);

    const systemPrompt = `Kamu adalah konsultan WhatsApp Marketing untuk sekolah di Indonesia.
Tugasmu: Menyusun PLAYBOOK WHATSAPP MARKETING lengkap & siap pakai untuk tim marketing/PPDB sekolah.

ATURAN:
- Bahasa Indonesia, gaya hangat, persuasif tapi tidak lebay, profesional
- Setiap template chat harus REALISTIS, langsung copy-paste, panjang wajar (3-7 baris)
- Selipkan emoji secukupnya (jangan berlebihan), gunakan placeholder seperti {{nama_ortu}}, {{nama_anak}}, {{nama_sekolah}}, {{tanggal_open_house}}
- SOP harus konkret: ada aturan respon time, tone, do & don't
- Gunakan tabel markdown untuk jadwal & matriks template
- Selaraskan SEMUA pesan dengan positioning, keunggulan, visi-misi & bahasa marketing yang diberikan user

FORMAT OUTPUT (markdown rapi & berurutan):

# 📱 Playbook WhatsApp Marketing Sekolah

## 1. 🎯 Ringkasan Strategi WA Marketing
[Strategi singkat 1 paragraf: tujuan, gaya komunikasi, & positioning yang dipakai]

## 2. 📋 SOP Chat Tim Marketing
### a. Aturan Umum
- Respon time
- Jam operasional
- Identitas admin (greeting standar)
- Tone of voice
### b. Etika & Larangan
- Do
- Don't
### c. Eskalasi
[Kapan diteruskan ke kepala marketing/kepala sekolah]

## 3. 💬 Template Greeting & Pembuka
**Template 1 — Sapaan Awal Calon Wali**
\`\`\`
[isi pesan siap copy paste]
\`\`\`
**Template 2 — Respon Pertanyaan Umum**
\`\`\`
[isi pesan]
\`\`\`

## 4. 📢 Template Broadcast
Buat 5 template broadcast untuk momen berbeda:
1. **Broadcast Pengenalan Sekolah**
2. **Broadcast Pembukaan PPDB**
3. **Broadcast Open House / Trial Class**
4. **Broadcast Promo / Early Bird**
5. **Broadcast Reminder Deadline Pendaftaran**

Tiap template:
\`\`\`
[isi pesan lengkap, ada CTA]
\`\`\`

## 5. 🔁 Template Follow-Up (Funnel)
Buat 6 template untuk tiap tahap funnel:
1. **FU-1: Setelah tanya-tanya pertama (H+1)**
2. **FU-2: Setelah kirim brosur (H+3)**
3. **FU-3: Setelah ikut Open House (H+1)**
4. **FU-4: Wali ragu / belum respon (H+7)**
5. **FU-5: Mendekati deadline pendaftaran**
6. **FU-6: Wali yang batal / pending pembayaran**

Tiap template tulis lengkap dalam blok kode.

## 6. 📅 Jadwal Follow-Up Standar
| Tahap | Waktu | Saluran | PIC | Tujuan |
|-------|-------|---------|-----|--------|
| ... | ... | WA | ... | ... |

## 7. 🗓️ Kalender Broadcast Bulanan
| Minggu | Tema Broadcast | Target Audiens | Template |
|--------|----------------|----------------|----------|
| Minggu 1 | ... | ... | ... |
| Minggu 2 | ... | ... | ... |
| Minggu 3 | ... | ... | ... |
| Minggu 4 | ... | ... | ... |

## 8. ❓ Template FAQ Cepat (Quick Reply)
Buat 8 quick reply untuk pertanyaan paling sering:
- Biaya
- Kurikulum
- Fasilitas
- Jadwal
- Open House
- Cara daftar
- Beasiswa
- Lokasi & antar-jemput
Tiap jawaban dalam blok kode, max 4 baris.

## 9. 🏷️ Sistem Labeling Kontak
Buat sistem label/tag WA Business:
| Label | Arti | Aksi Selanjutnya |
|-------|------|------------------|
| ... | ... | ... |

## 10. 📊 KPI & Metrik
[5-7 metrik untuk mengukur efektivitas WA marketing]

## 11. ✅ Tips Eksekusi
[5-7 tips praktis agar tim marketing konsisten & tidak terkesan spam]`;

    const userPrompt = `Susun Playbook WhatsApp Marketing untuk sekolah berikut:

**Nama Sekolah:** ${profile?.school_name || "(belum diisi)"}
**Lokasi:** ${(profile as any)?.city || ""} ${(profile as any)?.province || ""}

**Positioning Sekolah:**
${positioning || "(gunakan asumsi positioning sekolah yang fokus pada karakter & akademik)"}

**Keunggulan Sekolah:**
${keunggulan}

**Visi & Misi:**
${visiMisi || "(belum disediakan — selaraskan dengan keunggulan)"}

**Bahasa Marketing (gaya copywriter sekolah):**
${bahasaMarketing || "Hangat, persuasif, fokus emosi orang tua, tidak hard-selling"}

**Target Audiens:**
${targetAudiens || "Orang tua kelas menengah yang peduli pendidikan karakter & masa depan anak"}

**Periode PPDB / Kampanye:** ${periodePPDB || "PPDB tahun ajaran berjalan"}
**Tahun Ajaran:** ${academicYear}

Buatkan playbook WA marketing lengkap (SOP, template broadcast, template follow-up, jadwal follow-up, kalender broadcast, FAQ, KPI). SEMUA template harus selaras dengan positioning, keunggulan, visi-misi & bahasa marketing di atas — siap dipakai langsung oleh tim marketing.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "wa-marketing",
      academicYear,
      schoolName: profile?.school_name || "",
      inputData: { positioning, keunggulan, visiMisi, bahasaMarketing, targetAudiens, periodePPDB },
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
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">WA Marketing Playbook</h1>
          </div>
          <p className="text-muted-foreground">
            Hasilkan SOP chat tim marketing, template broadcast, template follow-up, jadwal & kalender — selaras dengan positioning, keunggulan, visi-misi & bahasa marketing sekolah.
          </p>
        </div>
        <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
      </div>

      {!showResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🧠 Input Data Sekolah</CardTitle>
            <CardDescription>Isi sedetail mungkin agar template chat yang dihasilkan benar-benar khas sekolahmu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
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
              <Label className="font-semibold">Positioning Sekolah</Label>
              <Textarea
                placeholder='Contoh: "Sekolah Islam berbasis karakter & teknologi untuk anak siap masa depan."'
                value={positioning}
                onChange={(e) => setPositioning(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Visi & Misi</Label>
              <Textarea
                placeholder="Salin visi & misi sekolah agar template chat selaras dengan nilai sekolah"
                value={visiMisi}
                onChange={(e) => setVisiMisi(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Bahasa Marketing (dari Copywriter AI)</Label>
              <Textarea
                placeholder='Tempel hasil Copywriter AI atau jelaskan tone: "Hangat, emosional, fokus masa depan anak..."'
                value={bahasaMarketing}
                onChange={(e) => setBahasaMarketing(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Target Audiens</Label>
                <Input
                  placeholder="Contoh: Orang tua muslim 30-45 thn"
                  value={targetAudiens}
                  onChange={(e) => setTargetAudiens(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Periode PPDB / Kampanye</Label>
                <Input
                  placeholder="Contoh: Nov 2025 - Mar 2026"
                  value={periodePPDB}
                  onChange={(e) => setPeriodePPDB(e.target.value)}
                />
              </div>
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
                  Menyusun playbook WA marketing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Hasilkan WA Marketing Playbook
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
                <p className="text-muted-foreground font-medium">AI sedang menyusun playbook WA marketing...</p>
              </CardContent>
            </Card>
          )}

          {(report || isLoading) && (
            <ReportDisplay
              title="📱 WA Marketing Playbook"
              content={report}
              isLoading={isLoading}
              pdfMeta={{
                schoolName: profile?.school_name || "",
                featureName: "WA Marketing Playbook",
                academicYear,
                inputSummary: `Positioning: ${positioning}\nKeunggulan: ${keunggulan}\nVisi-Misi: ${visiMisi}\nBahasa Marketing: ${bahasaMarketing}\nTarget: ${targetAudiens}\nPeriode: ${periodePPDB}`,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
