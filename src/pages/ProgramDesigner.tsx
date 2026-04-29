import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { Lightbulb } from "lucide-react";

export default function ProgramDesigner() {
  const { report, isLoading, generate } = useAIReport();
  const [form, setForm] = useState({
    schoolName: "",
    educationLevel: "",
    academicYear: "",
    vision: "",
    mission: "",
    coreValues: "",
    targetStudent: "",
    constraints: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.academicYear || !form.vision || !form.mission) return;

    const systemPrompt = `Kamu adalah konsultan pengembangan kurikulum & program sekolah berpengalaman di Indonesia.
Tugasmu: merancang PROGRAM SEKOLAH yang benar-benar SELARAS dengan visi & misi yang diberikan — bukan program generik.

Setiap program harus secara EKSPLISIT menjawab: "Misi mana yang dijawab program ini?"

Jangan gunakan jargon kosong. Gunakan Bahasa Indonesia yang jelas, konkret, dan dapat dieksekusi.`;

    const userPrompt = `Profil Sekolah:
- Nama: ${form.schoolName}
- Jenjang: ${form.educationLevel}
- Tahun Ajaran: ${form.academicYear}
- Target Siswa: ${form.targetStudent || "-"}
- Kendala/Sumber Daya: ${form.constraints || "-"}

VISI:
${form.vision}

MISI:
${form.mission}

Nilai Inti:
${form.coreValues || "-"}

---

Buat output dengan struktur berikut (gunakan markdown heading):

## 1. Analisis Visi & Misi
Ringkas inti visi (1 kalimat) dan pecah misi menjadi poin-poin "kata kerja kunci" yang harus diwujudkan oleh program.

## 2. Pilar Program (3–5 Pilar)
Kelompokkan misi ke dalam 3–5 pilar program besar. Setiap pilar diberi nama yang menarik + 1 kalimat penjelasan.

## 3. Rekomendasi Program (8–12 Program)
Untuk SETIAP program, tulis dengan format:
### [Nama Program] 
- **Pilar:** ...
- **Misi yang Dijawab:** (kutip bagian misi yang relevan)
- **Deskripsi Singkat:** 2–3 kalimat
- **Aktivitas Konkret:** 3–5 bullet aktivitas nyata
- **Frekuensi:** (harian/mingguan/bulanan/semester)
- **Output yang Terukur:** apa hasil yang bisa dilihat orang tua
- **Sumber Daya yang Dibutuhkan:** (guru/alat/mitra)

## 4. Quick Wins (Program Prioritas 90 Hari)
Pilih 3 program yang paling mudah dieksekusi dalam 90 hari & paling berdampak pada citra sekolah.

## 5. Program Penanda (Signature Program)
1 program "WOW" yang akan membuat sekolah ini DIINGAT dan DIBICARAKAN orang tua. Jelaskan kenapa unik.

## 6. Roadmap Implementasi 1 Tahun
Tabel sederhana per kuartal: Q1, Q2, Q3, Q4 — program apa yang dijalankan/dievaluasi.`;

    generate(systemPrompt, userPrompt, {
      featureUsed: "program-designer",
      academicYear: form.academicYear,
      schoolName: form.schoolName,
      inputData: form,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Design Program Sekolah</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan visi & misi — AI akan merancang program-program yang selaras dan dapat dieksekusi.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Visi & Misi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AcademicYearSelector value={form.academicYear} onChange={(v) => update("academicYear", v)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama Sekolah</Label>
                  <Input value={form.schoolName} onChange={(e) => update("schoolName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Jenjang</Label>
                  <Select value={form.educationLevel} onValueChange={(v) => update("educationLevel", v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TK">TK</SelectItem>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                      <SelectItem value="Multiple">Multi Jenjang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visi Sekolah *</Label>
                <Textarea
                  value={form.vision}
                  onChange={(e) => update("vision", e.target.value)}
                  placeholder="Tulis visi sekolah secara lengkap..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Misi Sekolah *</Label>
                <Textarea
                  value={form.mission}
                  onChange={(e) => update("mission", e.target.value)}
                  placeholder={"Tulis poin-poin misi (boleh dalam bentuk daftar):\n1. ...\n2. ...\n3. ..."}
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nilai Inti / Core Values <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                <Textarea
                  value={form.coreValues}
                  onChange={(e) => update("coreValues", e.target.value)}
                  placeholder="cth: Integritas, Kreativitas, Kepedulian..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Siswa <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                <Input
                  value={form.targetStudent}
                  onChange={(e) => update("targetStudent", e.target.value)}
                  placeholder="cth: Anak usia dini dari keluarga muslim urban"
                />
              </div>
              <div className="space-y-2">
                <Label>Kendala / Sumber Daya <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                <Textarea
                  value={form.constraints}
                  onChange={(e) => update("constraints", e.target.value)}
                  placeholder="cth: Guru terbatas 12 orang, anggaran kegiatan Rp 5jt/bulan, lahan terbatas..."
                  rows={2}
                />
              </div>
              <Button type="submit" disabled={isLoading || !form.academicYear} className="w-full">
                {isLoading ? "Sedang merancang program..." : "Generate Program dari Misi"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Program AI</CardTitle>
          </CardHeader>
          <CardContent>
            {report || isLoading ? (
              <ReportDisplay report={report} isLoading={isLoading} />
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Hasil program akan muncul di sini setelah Anda mengisi visi & misi dan menekan tombol generate.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
