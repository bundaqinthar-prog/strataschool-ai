import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { CalendarRange } from "lucide-react";

export default function ImplementationCalendar() {
  const { report, isLoading, generate } = useAIReport();
  const [horizon, setHorizon] = useState<"90" | "365">("90");
  const [form, setForm] = useState({
    schoolName: "",
    academicYear: "",
    programName: "",
    programGoal: "",
    startDate: "",
    teamSize: "",
    budget: "",
    constraints: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.academicYear || !form.programName || !form.programGoal) return;

    const isShort = horizon === "90";
    const horizonLabel = isShort ? "90 HARI" : "1 TAHUN (12 BULAN)";

    const systemPrompt = `Kamu adalah project manager & konsultan implementasi program sekolah di Indonesia.
Tugasmu: membuat KALENDER IMPLEMENTASI ${horizonLabel} yang konkret, realistis, dan dapat langsung dieksekusi oleh tim sekolah.

Aturan WAJIB:
- Selalu gunakan tanggal nyata berbasis tanggal mulai yang diberikan user.
- Setiap aktivitas harus punya: tanggal/rentang tanggal, PIC (penanggung jawab role), output/deliverable.
- Setiap fase harus ditutup dengan MILESTONE yang dapat diverifikasi (bukan sekadar "selesai sosialisasi").
- Hindari jargon kosong. Gunakan Bahasa Indonesia yang konkret.`;

    const structure90 = `
## 1. Ringkasan Program
- Nama program, tujuan, indikator keberhasilan utama (3 KPI angka).

## 2. Pembagian Fase 90 Hari
Bagi 90 hari menjadi 3 fase × 30 hari:
- **Fase 1 (Hari 1–30): Persiapan & Peluncuran**
- **Fase 2 (Hari 31–60): Eksekusi Inti**
- **Fase 3 (Hari 61–90): Skalasi & Evaluasi**

Untuk setiap fase, beri 1 paragraf strategi.

## 3. Kalender Mingguan (Minggu 1–13)
Buat tabel markdown dengan kolom:
| Minggu | Tanggal | Aktivitas Utama | PIC | Output |

Isi SEMUA 13 minggu. Aktivitas harus spesifik (bukan "rapat koordinasi" generik).

## 4. Milestone Utama (5–7 Milestone)
Untuk setiap milestone:
- **Tanggal target**
- **Nama milestone**
- **Kriteria selesai (verifikasi):** apa bukti konkretnya
- **Dampak ke program**

## 5. Checkpoint Evaluasi
- Evaluasi mingguan (apa yang dicek)
- Evaluasi 30 hari (review fase)
- Evaluasi akhir 90 hari (kriteria GO/NO-GO untuk lanjut)

## 6. Risiko & Mitigasi (3–5)
Tabel: Risiko | Probabilitas | Dampak | Mitigasi

## 7. Quick Win Hari 1–14
3 aksi "kemenangan kecil" yang harus terlihat di 2 minggu pertama untuk membangun momentum.`;

    const structure365 = `
## 1. Ringkasan Program
- Nama program, tujuan tahunan, 5 KPI tahunan dengan target angka.

## 2. Roadmap Kuartalan (Q1–Q4)
Untuk setiap kuartal:
- **Tema kuartal** (1 kalimat)
- **Tujuan utama** (2–3 poin)
- **Output yang harus tercapai di akhir kuartal**

## 3. Kalender Bulanan (12 Bulan)
Buat tabel markdown:
| Bulan | Rentang Tanggal | Fokus Bulan | Aktivitas Kunci (3–5) | PIC | Milestone Bulan |

Isi SEMUA 12 bulan. Hubungkan dengan kalender akademik Indonesia (tahun ajaran baru, ujian, libur semester, kenaikan kelas).

## 4. Milestone Tahunan (8–12 Milestone)
Untuk setiap milestone:
- **Tanggal target**
- **Nama milestone**
- **Kriteria selesai (verifikasi)**
- **Penanggung jawab**

## 5. Ritme Operasional
- Mingguan: ritual apa yang dijalankan
- Bulanan: review apa
- Kuartalan: review besar apa
- Tahunan: evaluasi & perencanaan ulang

## 6. Risiko Tahunan & Mitigasi (5–7)
Tabel: Risiko | Probabilitas | Dampak | Mitigasi | PIC

## 7. Anggaran & Sumber Daya per Kuartal
Tabel sederhana: Q1 | Q2 | Q3 | Q4 — alokasi fokus & estimasi sumber daya.

## 8. Indikator Keberhasilan Akhir Tahun
Daftar 5–7 bukti konkret yang menunjukkan program berhasil.`;

    const userPrompt = `Profil Implementasi:
- Sekolah: ${form.schoolName}
- Tahun Ajaran: ${form.academicYear}
- Tanggal Mulai: ${form.startDate || "Tentukan tanggal mulai realistis (gunakan awal bulan depan jika kosong)"}
- Ukuran Tim: ${form.teamSize || "-"}
- Anggaran/Sumber Daya: ${form.budget || "-"}
- Kendala: ${form.constraints || "-"}

PROGRAM YANG AKAN DIIMPLEMENTASIKAN:
Nama: ${form.programName}
Tujuan & Deskripsi: ${form.programGoal}

---

Buat KALENDER IMPLEMENTASI ${horizonLabel} dengan struktur berikut (gunakan markdown heading & tabel):
${isShort ? structure90 : structure365}`;

    generate(systemPrompt, userPrompt, {
      featureUsed: `implementation-calendar-${horizon}`,
      academicYear: form.academicYear,
      schoolName: form.schoolName,
      inputData: { ...form, horizon },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <CalendarRange className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Kalender Implementasi Program</h1>
          <p className="text-sm text-muted-foreground">
            Susun timeline & milestone konkret untuk program pilihan — pilih horizon 90 hari atau 1 tahun.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detail Program</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={horizon} onValueChange={(v) => setHorizon(v as "90" | "365")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="90">Sprint 90 Hari</TabsTrigger>
                  <TabsTrigger value="365">Roadmap 1 Tahun</TabsTrigger>
                </TabsList>
                <TabsContent value="90" className="text-xs text-muted-foreground pt-2">
                  Cocok untuk peluncuran program baru, pilot, atau quick win.
                </TabsContent>
                <TabsContent value="365" className="text-xs text-muted-foreground pt-2">
                  Cocok untuk program strategis tahunan dengan ritme kuartalan.
                </TabsContent>
              </Tabs>

              <AcademicYearSelector value={form.academicYear} onChange={(v) => update("academicYear", v)} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Sekolah</Label>
                  <Input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nama Program *</Label>
                <Input
                  value={form.programName}
                  onChange={(e) => update("programName", e.target.value)}
                  placeholder="cth: Program Literasi Karakter Harian"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tujuan & Deskripsi Program *</Label>
                <Textarea
                  value={form.programGoal}
                  onChange={(e) => update("programGoal", e.target.value)}
                  placeholder="Jelaskan tujuan, target audiens (siswa/orang tua/guru), aktivitas inti, dan hasil yang diharapkan..."
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ukuran Tim <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                  <Input
                    value={form.teamSize}
                    onChange={(e) => update("teamSize", e.target.value)}
                    placeholder="cth: 1 PJ + 4 guru"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Anggaran <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                  <Input
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    placeholder="cth: Rp 10 juta/kuartal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Kendala / Catatan <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                <Textarea
                  value={form.constraints}
                  onChange={(e) => update("constraints", e.target.value)}
                  placeholder="cth: Hindari minggu UTS, libur Idul Fitri di bulan X, ruang terbatas..."
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={isLoading || !form.academicYear} className="w-full">
                {isLoading
                  ? "Menyusun kalender..."
                  : horizon === "90"
                  ? "Generate Kalender 90 Hari"
                  : "Generate Roadmap 1 Tahun"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {report || isLoading ? (
          <ReportDisplay
            title={horizon === "90" ? "Kalender Implementasi 90 Hari" : "Roadmap Implementasi 1 Tahun"}
            content={report}
            isLoading={isLoading}
            pdfMeta={{
              schoolName: form.schoolName,
              featureName: horizon === "90" ? "Kalender Implementasi 90 Hari" : "Roadmap Implementasi 1 Tahun",
              academicYear: form.academicYear,
              inputSummary: form.programName,
            }}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Kalender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground text-sm">
                Pilih horizon, isi detail program, lalu generate untuk melihat timeline & milestone lengkap.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
