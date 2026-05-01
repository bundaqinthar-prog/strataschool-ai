import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, Printer, Compass, Target, Users, TrendingUp, BookOpen } from "lucide-react";
import { ReportDisplay } from "@/components/ReportDisplay";

const ANALYSIS_FRAMEWORKS = ["SWOT", "SOAR (Strengths, Opportunities, Aspirations, Results)"];

const PRIORITY_AREAS = [
  "Mutu Akademik & Prestasi Siswa",
  "Karakter & Budaya Sekolah",
  "Kompetensi Guru & Tenaga Kependidikan",
  "Sarana & Prasarana",
  "Tata Kelola & Manajemen",
  "Kemitraan & Hubungan Masyarakat",
  "Digitalisasi & Inovasi Pembelajaran",
  "Pertumbuhan Siswa Baru (PPDB)",
];

interface FormData {
  academicYear: string;
  startYear: string;
  endYear: string;
  currentVision: string;
  currentMission: string;
  schoolContext: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  aspirations: string;
  framework: string;
  priorityAreas: string[];
  stakeholders: string;
  longTermGoals: string;
}

const initialForm: FormData = {
  academicYear: "2025/2026",
  startYear: "2025",
  endYear: "2030",
  currentVision: "",
  currentMission: "",
  schoolContext: "",
  strengths: "",
  weaknesses: "",
  opportunities: "",
  threats: "",
  aspirations: "",
  framework: "SWOT",
  priorityAreas: [],
  stakeholders: "",
  longTermGoals: "",
};

export default function Renstra() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const { report, isLoading, generate, setReport } = useAIReport();
  const { profile } = useAuth();

  const isValid =
    form.academicYear &&
    form.startYear &&
    form.endYear &&
    form.schoolContext.trim() &&
    form.strengths.trim() &&
    form.opportunities.trim() &&
    form.priorityAreas.length > 0 &&
    form.longTermGoals.trim();

  const togglePriority = (area: string) => {
    setForm((p) => ({
      ...p,
      priorityAreas: p.priorityAreas.includes(area)
        ? p.priorityAreas.filter((a) => a !== area)
        : [...p.priorityAreas, area],
    }));
  };

  const handleGenerate = async () => {
    if (!isValid) return;
    setShowResult(true);

    const systemPrompt = `Kamu adalah konsultan perencanaan strategis pendidikan senior di Indonesia, ahli menyusun Rencana Strategis (Renstra) Sekolah jangka 5 tahun yang selaras dengan Kurikulum Merdeka, Standar Nasional Pendidikan (SNP), dan Rapor Pendidikan.

Susun dokumen Renstra yang lengkap, terstruktur, profesional, dan siap dijadikan dokumen resmi sekolah. Gunakan bahasa Indonesia formal dan jelas.

Output WAJIB mengikuti format Markdown berikut secara KETAT:

# 📘 RENCANA STRATEGIS (RENSTRA) SEKOLAH
**Periode [tahun mulai] – [tahun akhir]**

## BAB I — PENDAHULUAN
### 1.1 Latar Belakang
[2-3 paragraf konteks penyusunan Renstra berdasarkan data sekolah]

### 1.2 Landasan Hukum
[Daftar landasan hukum yang relevan: UU Sisdiknas, Permendikbudristek, dll]

### 1.3 Maksud dan Tujuan Renstra
[Maksud dan tujuan dokumen Renstra ini disusun]

## BAB II — ANALISIS SITUASI / KONTEKS
### 2.1 Profil Singkat Sekolah
[Rangkum profil sekolah]

### 2.2 Analisis ${"{framework}"}
[Uraikan hasil analisis berbasis framework yang dipilih, dalam bentuk tabel matriks dan narasi]

### 2.3 Isu-Isu Strategis
[5-7 isu strategis hasil sintesa analisis]

## BAB III — VISI, MISI, TUJUAN, DAN SASARAN
### 3.1 Visi Sekolah (5 Tahun ke Depan)
[Rumusan visi yang inspiratif, terukur, dan kontekstual — boleh menyempurnakan visi yang ada]

### 3.2 Misi Sekolah
[5-7 butir misi yang operasional dan selaras dengan visi]

### 3.3 Tujuan Strategis (5 Tahun)
[5-8 tujuan strategis terukur]

### 3.4 Sasaran Tahunan
[Sajikan dalam tabel: Tahun ke-1 sampai Tahun ke-5, dengan indikator kunci untuk setiap sasaran]

## BAB IV — STRATEGI DAN KEBIJAKAN
### 4.1 Strategi Pencapaian
[Strategi per area prioritas yang dipilih]

### 4.2 Kebijakan Sekolah
[Kebijakan turunan untuk mendukung strategi]

## BAB V — PROGRAM DAN KEGIATAN (ROADMAP 5 TAHUN)
Sajikan dalam bentuk tabel matriks per tahun.

### 5.1 Tahun ke-1 (Fondasi & Penguatan Internal)
| Area | Program | Kegiatan Utama | Indikator Keberhasilan | PIC |
|------|---------|----------------|------------------------|-----|

### 5.2 Tahun ke-2 (Akselerasi Mutu)
[Tabel dengan format yang sama]

### 5.3 Tahun ke-3 (Konsolidasi & Diferensiasi)
[Tabel dengan format yang sama]

### 5.4 Tahun ke-4 (Ekspansi Dampak)
[Tabel dengan format yang sama]

### 5.5 Tahun ke-5 (Pencapaian Visi & Keberlanjutan)
[Tabel dengan format yang sama]

## BAB VI — INDIKATOR KINERJA UTAMA (KPI)
Sajikan dalam tabel: Indikator | Baseline | Target Th-1 | Th-2 | Th-3 | Th-4 | Th-5

## BAB VII — KERANGKA PENDANAAN INDIKATIF
[Estimasi sumber dan alokasi pendanaan per tahun: BOS, Komite, CSR, Mandiri]

## BAB VIII — MONITORING DAN EVALUASI
### 8.1 Mekanisme Monev
### 8.2 Jadwal Evaluasi (Triwulanan, Tahunan, Tengah Periode)
### 8.3 Pelibatan Pemangku Kepentingan

## BAB IX — PENUTUP
[Paragraf penutup yang menegaskan komitmen sekolah]

---
**Ditetapkan di:** [Kota]
**Pada Tanggal:** [Tanggal Penetapan]
**Kepala Sekolah:** ${"{kepala_sekolah}"}`;

    const userPrompt = `Tolong susun Renstra Sekolah lengkap berdasarkan data berikut:

**Identitas Sekolah:**
- Nama Sekolah: ${profile?.school_name || "-"}
- Periode Renstra: ${form.startYear} – ${form.endYear} (5 Tahun)
- Tahun Ajaran Penyusunan: ${form.academicYear}
- Penyusun: ${profile?.full_name || "-"} (${profile?.jabatan || "-"})

**Visi Saat Ini (jika ada):**
${form.currentVision || "(belum dirumuskan, mohon usulkan visi baru yang kuat)"}

**Misi Saat Ini (jika ada):**
${form.currentMission || "(belum dirumuskan, mohon usulkan misi baru)"}

**Konteks & Profil Sekolah:**
${form.schoolContext}

**Framework Analisis Situasi:** ${form.framework}

**Strengths (Kekuatan):**
${form.strengths}

**Weaknesses (Kelemahan) / Areas to Improve:**
${form.weaknesses || "(tidak diisi)"}

**Opportunities (Peluang):**
${form.opportunities}

**Threats (Ancaman):**
${form.threats || "(tidak diisi)"}

**Aspirations (Aspirasi/Cita-cita):**
${form.aspirations || "(tidak diisi)"}

**Area Prioritas Pengembangan (5 Tahun):**
${form.priorityAreas.map((a) => `- ${a}`).join("\n")}

**Pemangku Kepentingan yang Dilibatkan:**
${form.stakeholders || "Guru, Tenaga Kependidikan, Komite Sekolah, Orang Tua, Yayasan"}

**Tujuan Jangka Panjang yang Diharapkan (5 Tahun):**
${form.longTermGoals}

Susun dokumen Renstra yang siap pakai, kontekstual untuk sekolah Indonesia, terukur, dan mudah dieksekusi. Pastikan setiap program di roadmap tahunan saling terhubung dan progresif.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "renstra",
      academicYear: form.academicYear,
      schoolName: profile?.school_name || "",
      inputData: form,
    });
  };

  const handleBack = () => {
    setShowResult(false);
    setReport("");
  };

  if (showResult) {
    return (
      <div className="space-y-6 print-report">
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Ubah Input
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Cetak Dokumen Renstra (PDF)
          </Button>
        </div>

        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="text-center pb-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Dokumen Perencanaan Strategis</p>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              Renstra Sekolah {form.startYear}–{form.endYear}
            </CardTitle>
            <CardDescription className="text-base">
              {profile?.school_name || "Sekolah"} • Disusun T.A. {form.academicYear}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Compass className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Periode</p>
              </div>
              <p className="text-sm font-medium">{form.startYear} – {form.endYear}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Framework</p>
              </div>
              <p className="text-sm font-medium">{form.framework.split(" ")[0]}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Area Prioritas</p>
              </div>
              <p className="text-sm font-medium">{form.priorityAreas.length} area</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Penyusun</p>
              </div>
              <p className="text-sm font-medium truncate">{profile?.full_name || "-"}</p>
            </CardContent>
          </Card>
        </div>

        {isLoading && !report ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold text-primary">AI sedang menyusun Renstra 5 tahun...</p>
              <p className="text-sm text-muted-foreground mt-1">Proses ini bisa memakan waktu lebih lama karena dokumen panjang</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none">
              <ReportDisplay
                title="Dokumen Renstra Sekolah"
                content={report}
                isLoading={isLoading}
                pdfMeta={{
                  schoolName: profile?.school_name || "",
                  featureName: `Renstra ${form.startYear}-${form.endYear}`,
                  academicYear: form.academicYear,
                  inputSummary: `Periode: ${form.startYear}-${form.endYear} | Framework: ${form.framework} | Area: ${form.priorityAreas.join(", ")}`,
                }}
              />
            </CardContent>
          </Card>
        )}

        <div className="hidden print:flex justify-between mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-16">Mengetahui,</p>
            <p className="font-semibold text-sm">Ketua Komite Sekolah</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-16">Ditetapkan Oleh,</p>
            <p className="font-semibold text-sm">Kepala Sekolah</p>
            <p className="text-xs text-muted-foreground mt-1">{profile?.school_name}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          Renstra Sekolah (Rencana Strategis 5 Tahun)
        </h1>
        <p className="text-muted-foreground mt-1">
          Susun dokumen perencanaan jangka panjang berisi visi, misi, tujuan, strategi, program kerja,
          dan roadmap 5 tahun untuk peningkatan mutu sekolah secara terstruktur.
        </p>
      </div>

      {/* Periode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
            Periode Renstra
          </CardTitle>
          <CardDescription>Tentukan jangka waktu Renstra (umumnya 5 tahun).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AcademicYearSelector value={form.academicYear} onChange={(v) => setForm((p) => ({ ...p, academicYear: v }))} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tahun Mulai</Label>
              <Input
                type="number"
                value={form.startYear}
                onChange={(e) => setForm((p) => ({ ...p, startYear: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tahun Akhir</Label>
              <Input
                type="number"
                value={form.endYear}
                onChange={(e) => setForm((p) => ({ ...p, endYear: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visi Misi Saat Ini */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
            Visi & Misi Saat Ini (Opsional)
          </CardTitle>
          <CardDescription>Jika sudah ada, AI akan menyempurnakannya. Jika belum, AI akan mengusulkan yang baru.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visi Saat Ini</Label>
            <Textarea
              placeholder="Contoh: Menjadi sekolah unggul yang menghasilkan generasi berakhlak mulia..."
              value={form.currentVision}
              onChange={(e) => setForm((p) => ({ ...p, currentVision: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Misi Saat Ini</Label>
            <Textarea
              placeholder="Sebutkan butir-butir misi yang sudah berjalan..."
              value={form.currentMission}
              onChange={(e) => setForm((p) => ({ ...p, currentMission: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Konteks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
            Profil & Konteks Sekolah
          </CardTitle>
          <CardDescription>Gambarkan kondisi sekolah saat ini secara ringkas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Jenjang, jumlah siswa, jumlah guru, akreditasi, lokasi, karakteristik komunitas, prestasi terkini..."
            value={form.schoolContext}
            onChange={(e) => setForm((p) => ({ ...p, schoolContext: e.target.value }))}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Analisis Situasi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
            Analisis Situasi (SWOT / SOAR)
          </CardTitle>
          <CardDescription>Pilih framework analisis dan isi data faktual sekolah.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Framework Analisis</Label>
            <Select value={form.framework} onValueChange={(v) => setForm((p) => ({ ...p, framework: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ANALYSIS_FRAMEWORKS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Strengths (Kekuatan) *</Label>
              <Textarea
                placeholder="Apa kekuatan utama sekolah?"
                value={form.strengths}
                onChange={(e) => setForm((p) => ({ ...p, strengths: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Weaknesses (Kelemahan)</Label>
              <Textarea
                placeholder="Apa yang perlu diperbaiki?"
                value={form.weaknesses}
                onChange={(e) => setForm((p) => ({ ...p, weaknesses: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Opportunities (Peluang) *</Label>
              <Textarea
                placeholder="Peluang eksternal yang bisa dimanfaatkan"
                value={form.opportunities}
                onChange={(e) => setForm((p) => ({ ...p, opportunities: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{form.framework.startsWith("SOAR") ? "Aspirations (Cita-cita)" : "Threats (Ancaman)"}</Label>
              <Textarea
                placeholder={form.framework.startsWith("SOAR") ? "Cita-cita warga sekolah ke depan" : "Ancaman dari lingkungan eksternal"}
                value={form.framework.startsWith("SOAR") ? form.aspirations : form.threats}
                onChange={(e) =>
                  setForm((p) =>
                    form.framework.startsWith("SOAR")
                      ? { ...p, aspirations: e.target.value }
                      : { ...p, threats: e.target.value },
                  )
                }
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area Prioritas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
            Area Prioritas Pengembangan
          </CardTitle>
          <CardDescription>Pilih area yang akan menjadi fokus dalam 5 tahun ke depan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRIORITY_AREAS.map((area) => {
              const checked = form.priorityAreas.includes(area);
              return (
                <label
                  key={area}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePriority(area)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-sm font-medium">{area}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pemangku Kepentingan & Tujuan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">6</span>
            Pemangku Kepentingan & Tujuan Jangka Panjang
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pemangku Kepentingan yang Dilibatkan</Label>
            <Textarea
              placeholder="Contoh: Guru, Tenaga Kependidikan, Komite Sekolah, Orang Tua, Yayasan, Pengawas Dinas..."
              value={form.stakeholders}
              onChange={(e) => setForm((p) => ({ ...p, stakeholders: e.target.value }))}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Tujuan/Hasil yang Diharapkan dalam 5 Tahun *</Label>
            <Textarea
              placeholder="Contoh: Akreditasi A, lulusan diterima di PTN top 10, program tahfidz berjalan, branding sekolah dikenal regional..."
              value={form.longTermGoals}
              onChange={(e) => setForm((p) => ({ ...p, longTermGoals: e.target.value }))}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full text-base h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
        disabled={!isValid || isLoading}
        onClick={handleGenerate}
      >
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <TrendingUp className="mr-2 h-5 w-5" />}
        Susun Dokumen Renstra 5 Tahun dengan AI
      </Button>
    </div>
  );
}
