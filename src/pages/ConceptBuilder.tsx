import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, Printer, Lightbulb, Target, Dna, BookOpen, Cog } from "lucide-react";
import { ReportDisplay } from "@/components/ReportDisplay";

const DEMOGRAPHICS = ["Menengah Bawah", "Menengah", "Menengah Atas", "Ekspatriat"];

const CORE_VALUES = [
  { id: "academic", label: "Akademik Ekselen" },
  { id: "character", label: "Character Building & Agama" },
  { id: "skill", label: "Skill-Based & Entrepreneurship" },
  { id: "nature", label: "Nature & Ecological" },
];

const ADDON_CURRICULUM = [
  "Tidak Ada",
  "Internasional (Cambridge/IB)",
  "Local Wisdom / Kewirausahaan",
  "Pendekatan Khas (Montessori/Tahfidz)",
];

const LEARNING_METHODS = [
  "Project-Based Learning (PjBL)",
  "Inquiry-Based Learning",
  "Dual Language / Bilingual",
  "Personalized Learning",
];

interface FormData {
  demographic: string;
  painPoints: string;
  competitorGaps: string;
  coreValues: string[];
  addonCurriculum: string;
  learningMethod: string;
  academicYear: string;
}

const initialForm: FormData = {
  demographic: "",
  painPoints: "",
  competitorGaps: "",
  coreValues: [],
  addonCurriculum: "",
  learningMethod: "",
  academicYear: "2025/2026",
};

export default function ConceptBuilder() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const { report, isLoading, generate, setReport, savedId } = useAIReport();
  const { profile } = useAuth();

  const isValid =
    form.demographic &&
    form.painPoints.trim() &&
    form.competitorGaps.trim() &&
    form.coreValues.length > 0 &&
    form.addonCurriculum &&
    form.learningMethod &&
    form.academicYear;

  const handleGenerate = async () => {
    if (!isValid) return;
    setShowResult(true);

    const systemPrompt = `Kamu adalah konsultan pendidikan elite Indonesia yang membantu merancang konsep sekolah baru.

Berikan output dalam bahasa Indonesia dengan format Markdown yang terstruktur. Output HARUS mengikuti format ini secara KETAT:

## 🌟 THE BIG IDEA — Sintesa Konsep Sekolah

Tuliskan satu paragraf singkat (2-3 kalimat) yang merangkum konsep unik sekolah ini. Ini harus terasa seperti elevator pitch yang memukau.

## 📋 Breakdown Konsep Utama

- 🎯 **Target Pasar**: [rangkum target demografis dan pain points]
- 🧬 **DNA Utama**: [rangkum core values yang dipilih]
- 📚 **Mesin Kurikulum**: [rangkum kurikulum utama + add-on]
- ⚙️ **Model Belajar**: [rangkum metode pembelajaran]

## 📣 Sudut Pandang Marketing (Marketing Angle)

Berikan 3-4 paragraf saran strategis bagaimana menjual konsep sekolah ini kepada orang tua. Fokus pada:
1. Pesan utama yang harus digunakan
2. Pain point yang harus ditonjolkan
3. Diferensiasi dari kompetitor
4. Cara mengkomunikasikan value jangka panjang

## 🗓️ Rencana Aksi 90 Hari Peluncuran Konsep

### Bulan 1: Fondasi
- [aksi konkret 1]
- [aksi konkret 2]
- [aksi konkret 3]

### Bulan 2: Validasi
- [aksi konkret 1]
- [aksi konkret 2]
- [aksi konkret 3]

### Bulan 3: Soft Launch
- [aksi konkret 1]
- [aksi konkret 2]
- [aksi konkret 3]

## 💡 Rekomendasi Tambahan

Berikan 3-5 insight tambahan yang relevan untuk memastikan konsep ini berhasil.`;

    const userPrompt = `Berikut data konsep sekolah yang ingin dirancang:

**Target Demografis:** ${form.demographic}
**Pain Points Orang Tua:** ${form.painPoints}
**Celah Kompetitor:** ${form.competitorGaps}
**Core Values / DNA Utama:** ${form.coreValues.join(", ")}
**Kurikulum:** Kurikulum Merdeka (Wajib) + Add-on: ${form.addonCurriculum}
**Metode Pembelajaran:** ${form.learningMethod}
**Tahun Ajaran Target:** ${form.academicYear}
**Nama Sekolah:** ${profile?.school_name || "-"}

Tolong sintesakan konsep sekolah ini secara strategis dan berikan rencana aksi yang actionable.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "concept-builder",
      academicYear: form.academicYear,
      schoolName: profile?.school_name || "",
      inputData: form,
    });
  };

  const handleCoreValueToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      coreValues: prev.coreValues.includes(id)
        ? prev.coreValues.filter((v) => v !== id)
        : prev.coreValues.length < 2
        ? [...prev.coreValues, id]
        : prev.coreValues,
    }));
  };

  const handleBack = () => {
    setShowResult(false);
    setReport("");
  };

  if (showResult) {
    return (
      <div className="space-y-6 print-report">
        {/* Header */}
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Ubah Input
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Cetak Blueprint (PDF)
            </Button>
          </div>
        </div>

        {/* Report Header */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="text-center pb-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Blueprint Konsep Sekolah</p>
            <CardTitle className="text-2xl md:text-3xl text-primary">
              Arsitek Konsep Sekolah AI
            </CardTitle>
            <CardDescription className="text-base">
              {profile?.school_name || "Sekolah"} • Tahun Ajaran {form.academicYear}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Input Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Target Pasar</p>
              </div>
              <p className="text-sm font-medium">{form.demographic}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Dna className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">DNA Utama</p>
              </div>
              <p className="text-sm font-medium">
                {form.coreValues.map((v) => CORE_VALUES.find((c) => c.id === v)?.label).join(", ")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Kurikulum</p>
              </div>
              <p className="text-sm font-medium">Merdeka + {form.addonCurriculum}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Cog className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase">Metode Belajar</p>
              </div>
              <p className="text-sm font-medium">{form.learningMethod}</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Report */}
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold text-primary">AI sedang menyusun sintesa konsep strategis...</p>
              <p className="text-sm text-muted-foreground mt-1">Mohon tunggu beberapa saat</p>
            </CardContent>
          </Card>
        ) : report ? (
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none">
              <ReportDisplay content={report} />
            </CardContent>
          </Card>
        ) : null}

        {/* Print signature */}
        <div className="hidden print:flex justify-between mt-16 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-16">Mengetahui,</p>
            <p className="font-semibold text-sm">Kepala Sekolah</p>
            <p className="text-xs text-muted-foreground mt-1">{profile?.school_name}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-16">Dibuat Oleh,</p>
            <p className="font-semibold text-sm">{profile?.full_name || "Evaluator"}</p>
            <p className="text-xs text-muted-foreground mt-1">{profile?.jabatan || "Tim Pengembangan"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Arsitek Konsep Sekolah AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Rumuskan konsep atau purwarupa sekolah Anda dari nol menggunakan 5 tahapan strategis.
        </p>
      </div>

      {/* Academic Year */}
      <Card>
        <CardContent className="pt-6">
          <AcademicYearSelector value={form.academicYear} onChange={(v) => setForm((p) => ({ ...p, academicYear: v }))} />
        </CardContent>
      </Card>

      {/* Stage 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
            Analisis Kebutuhan Pasar
          </CardTitle>
          <CardDescription>Market Gap Analysis — Identifikasi peluang yang belum digarap kompetitor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Demografis</Label>
            <Select value={form.demographic} onValueChange={(v) => setForm((p) => ({ ...p, demographic: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih segmen target..." /></SelectTrigger>
              <SelectContent>
                {DEMOGRAPHICS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Pain Points Orang Tua</Label>
            <Textarea
              placeholder="Misal: Jam pulang terlalu cepat, kurang penguatan agama, atau kurang life-skills..."
              value={form.painPoints}
              onChange={(e) => setForm((p) => ({ ...p, painPoints: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Celah Kompetitor</Label>
            <Textarea
              placeholder="Sebutkan kelemahan 3 sekolah pesaing yang bisa Anda isi..."
              value={form.competitorGaps}
              onChange={(e) => setForm((p) => ({ ...p, competitorGaps: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
            Menentukan "DNA" / Core Values
          </CardTitle>
          <CardDescription>Pilih 1–2 fokus utama yang akan menjadi identitas sekolah Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CORE_VALUES.map((cv) => {
              const checked = form.coreValues.includes(cv.id);
              const disabled = !checked && form.coreValues.length >= 2;
              return (
                <label
                  key={cv.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => handleCoreValueToggle(cv.id)}
                  />
                  <span className="text-sm font-medium">{cv.label}</span>
                </label>
              );
            })}
          </div>
          {form.coreValues.length >= 2 && (
            <p className="text-xs text-muted-foreground mt-2">Maksimal 2 pilihan. Hapus salah satu untuk mengubah.</p>
          )}
        </CardContent>
      </Card>

      {/* Stage 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
            Kurikulum sebagai Mesin Penggerak
          </CardTitle>
          <CardDescription>Tentukan fondasi kurikulum dan add-on yang memperkuat konsep.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <Checkbox checked disabled />
            <span className="text-sm font-medium">Kurikulum Merdeka <span className="text-xs text-muted-foreground">(Wajib)</span></span>
          </label>
          <div className="space-y-2">
            <Label>Kurikulum Add-on</Label>
            <Select value={form.addonCurriculum} onValueChange={(v) => setForm((p) => ({ ...p, addonCurriculum: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih kurikulum tambahan..." /></SelectTrigger>
              <SelectContent>
                {ADDON_CURRICULUM.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stage 4 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
            Model Pembelajaran (Learning Experience)
          </CardTitle>
          <CardDescription>Pilih metode utama yang akan dirasakan siswa setiap hari.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Metode Utama</Label>
            <Select value={form.learningMethod} onValueChange={(v) => setForm((p) => ({ ...p, learningMethod: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih metode pembelajaran..." /></SelectTrigger>
              <SelectContent>
                {LEARNING_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        size="lg"
        className="w-full text-base h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
        disabled={!isValid || isLoading}
        onClick={handleGenerate}
      >
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <span className="mr-2">🧠</span>}
        Sintesa: Rangkum Konsep dengan AI
      </Button>
    </div>
  );
}
