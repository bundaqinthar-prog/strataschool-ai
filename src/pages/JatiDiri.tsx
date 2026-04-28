import { useState } from "react";
import { Fingerprint, Loader2, Sparkles, ArrowLeft, Copy, Save, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { ReportDisplay } from "@/components/ReportDisplay";

const VALUE_OPTIONS = [
  "Integritas", "Kasih Sayang", "Disiplin", "Kreativitas", "Kemandirian",
  "Religiusitas", "Kepedulian Sosial", "Kejujuran", "Inovasi", "Toleransi",
  "Cinta Lingkungan", "Kerjasama", "Berpikir Kritis", "Keberanian", "Keteladanan",
];

export default function JatiDiri() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { report, isLoading, generate, setReport, savedId } = useAIReport();

  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [showResult, setShowResult] = useState(false);

  // Bagian 1: Sejarah & Asal Usul
  const [namaSekolah, setNamaSekolah] = useState("");
  const [tahunBerdiri, setTahunBerdiri] = useState("");
  const [pendiri, setPendiri] = useState("");
  const [pencapaian, setPencapaian] = useState("");

  // Bagian 2: Nilai & Kultur
  const [keyakinan, setKeyakinan] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customValues, setCustomValues] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [suasana, setSuasana] = useState("");
  const [tidakKompromi, setTidakKompromi] = useState("");

  // Bagian 3: Keunggulan Nyata
  const [programKhas, setProgramKhas] = useState("");
  const [pujian, setPujian] = useState("");
  const [bidangUnggulan, setBidangUnggulan] = useState("");

  // Bagian 4: Audiens & Kompetitor
  const [orangTuaIdeal, setOrangTuaIdeal] = useState("");
  const [tipeSiswa, setTipeSiswa] = useState("");
  const [alasanPilihLain, setAlasanPilihLain] = useState("");

  const toggleValue = (v: string) => {
    setSelectedValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 5 ? [...prev, v] : prev
    );
  };

  const addCustomValue = () => {
    const t = customInput.trim();
    if (!t) return;
    if (selectedValues.length + customValues.length >= 5) {
      toast({ title: "Maksimal 5 nilai", variant: "destructive" });
      return;
    }
    setCustomValues((prev) => [...prev, t]);
    setCustomInput("");
  };

  const removeCustomValue = (v: string) => {
    setCustomValues((prev) => prev.filter((x) => x !== v));
  };

  const allValues = [...selectedValues, ...customValues];

  const handleGenerate = async () => {
    if (!namaSekolah.trim() || !pendiri.trim() || allValues.length < 3) {
      toast({
        title: "Data belum lengkap",
        description: "Mohon isi nama sekolah, latar belakang pendiri, dan minimal 3 nilai inti.",
        variant: "destructive",
      });
      return;
    }

    setShowResult(true);

    const systemPrompt = `Kamu adalah konsultan brand strategist sekolah Indonesia yang ahli merumuskan jati diri (brand identity) lembaga pendidikan.

Tugasmu: Berdasarkan data yang diberikan, rumuskan JATI DIRI sekolah dalam 5 output yang tajam, otentik, dan tidak generik.

ATURAN:
- Hindari kata klise: "terbaik", "unggul", "berkualitas", "modern" tanpa konteks
- Bahasa harus spesifik, bermakna, dan mencerminkan keunikan sekolah
- Gunakan Bahasa Indonesia yang elegan, percaya diri, dan menyentuh emosi
- Setiap output harus terasa hanya bisa diucapkan oleh sekolah ini, bukan kompetitor

FORMAT OUTPUT (gunakan heading markdown persis seperti ini):

## 🧬 1. Jati Diri (Brand DNA)
[Tulis 2-3 paragraf yang menggambarkan inti karakter sekolah — siapa mereka sebenarnya, dari mana mereka berasal, dan untuk apa mereka ada. Bukan sekadar deskripsi, tapi narasi jiwa.]

## 💎 2. Brand Truth (Kebenaran Merek)
[Satu kalimat tajam dan jujur yang menyatakan kebenaran fundamental tentang sekolah ini. Format: "Kami adalah sekolah yang..." atau "Kebenaran kami adalah..."]

## 🎯 3. Positioning Statement
[Format profesional: "Untuk [orang tua ideal] yang [kebutuhan/kekhawatiran], [Nama Sekolah] adalah [kategori] yang [diferensiasi unik], karena [alasan/bukti]."]

## 💌 4. Pesan Kunci untuk Orang Tua Baru
[3-4 kalimat hangat dan menenangkan yang langsung berbicara ke hati orang tua yang sedang mempertimbangkan sekolah. Jawab ketakutan tersembunyi mereka, bangun kepercayaan.]

## ✨ 5. Tiga Pilihan Tagline
**Opsi A (Emosional):** [Tagline 3-7 kata yang menyentuh perasaan]
**Opsi B (Aspiratif):** [Tagline 3-7 kata yang membangkitkan visi masa depan]
**Opsi C (Berani/Distinctive):** [Tagline 3-7 kata yang berani dan membedakan dari kompetitor]

Untuk setiap tagline, beri 1 kalimat penjelasan singkat mengapa tagline ini cocok.`;

    const userPrompt = `Tolong rumuskan JATI DIRI sekolah berikut:

**BAGIAN 1 — SEJARAH & ASAL USUL**
- Nama Sekolah: ${namaSekolah}
- Tahun Berdiri & Latar Belakang: ${tahunBerdiri || "-"}
- Pendiri & Keyakinan Pendorong: ${pendiri}
- Pencapaian Paling Membanggakan: ${pencapaian || "-"}

**BAGIAN 2 — NILAI & KULTUR**
- Yang Benar-Benar Dipercaya: ${keyakinan || "-"}
- Nilai Inti (3-5): ${allValues.join(", ")}
- Tiga Kata Suasana Sekolah: ${suasana || "-"}
- Hal yang Tidak Akan Dikompromikan: ${tidakKompromi || "-"}

**BAGIAN 3 — KEUNGGULAN NYATA**
- Program/Pendekatan Khas: ${programKhas || "-"}
- Yang Paling Sering Dipuji: ${pujian || "-"}
- Bidang Unggulan: ${bidangUnggulan || "-"}

**BAGIAN 4 — AUDIENS & KOMPETITOR**
- Orang Tua Ideal: ${orangTuaIdeal || "-"}
- Tipe Siswa yang Paling Berkembang: ${tipeSiswa || "-"}
- Alasan Sebagian Memilih Sekolah Lain: ${alasanPilihLain || "-"}

Rumuskan 5 output sesuai format yang diminta.`;

    await generate(systemPrompt, userPrompt, {
      featureUsed: "jati-diri",
      academicYear,
      schoolName: profile?.school_name || namaSekolah,
      inputData: {
        namaSekolah, tahunBerdiri, pendiri, pencapaian,
        keyakinan, nilai: allValues, suasana, tidakKompromi,
        programKhas, pujian, bidangUnggulan,
        orangTuaIdeal, tipeSiswa, alasanPilihLain,
      },
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
              <Fingerprint className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Jati Diri Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Rumuskan identitas otentik sekolah: Brand DNA, Brand Truth, Positioning, Pesan Kunci & Tagline.
          </p>
        </div>
        <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
      </div>

      {!showResult ? (
        <div className="space-y-6">
          {/* Bagian 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary">Bagian 01</Badge> Sejarah & Asal Usul
              </CardTitle>
              <CardDescription>Akar yang memberi makna pada perjalanan sekolah Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Nama Lengkap Sekolah <span className="text-destructive">*</span></Label>
                <Input value={namaSekolah} onChange={(e) => setNamaSekolah(e.target.value)} placeholder="SD Islam Cendekia Nusantara" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Tahun Berdiri & Latar Belakang</Label>
                <Textarea rows={2} value={tahunBerdiri} onChange={(e) => setTahunBerdiri(e.target.value)} placeholder="Misal: Berdiri 2005 sebagai respons atas minimnya sekolah yang menyeimbangkan akademik dan karakter di kawasan kami." />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Pendiri & Keyakinan Pendorong <span className="text-destructive">*</span></Label>
                <Textarea rows={3} value={pendiri} onChange={(e) => setPendiri(e.target.value)} placeholder="Siapa pendirinya? Keyakinan/visi apa yang mendorong berdirinya sekolah ini?" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Momen / Pencapaian Paling Membanggakan</Label>
                <Textarea rows={2} value={pencapaian} onChange={(e) => setPencapaian(e.target.value)} placeholder="Misal: Lulusan diterima di 12 SMP Negeri favorit pada 2023." />
              </div>
            </CardContent>
          </Card>

          {/* Bagian 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary">Bagian 02</Badge> Nilai & Kultur
              </CardTitle>
              <CardDescription>Apa yang membentuk karakter dan denyut harian sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Apa yang Benar-Benar Anda Percaya</Label>
                <Textarea rows={2} value={keyakinan} onChange={(e) => setKeyakinan(e.target.value)} placeholder="Keyakinan inti tentang pendidikan/anak yang Anda pegang teguh." />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">
                  Pilih Nilai Inti (3-5) <span className="text-destructive">*</span>
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    Terpilih: {allValues.length}/5
                  </span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg border bg-muted/30">
                  {VALUE_OPTIONS.map((v) => {
                    const checked = selectedValues.includes(v);
                    const disabled = !checked && allValues.length >= 5;
                    return (
                      <label key={v} className={`flex items-center gap-2 text-sm cursor-pointer ${disabled ? "opacity-40" : ""}`}>
                        <Checkbox checked={checked} onCheckedChange={() => !disabled && toggleValue(v)} disabled={disabled} />
                        <span>{v}</span>
                      </label>
                    );
                  })}
                </div>

                {customValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customValues.map((v) => (
                      <Badge key={v} variant="outline" className="gap-1 pr-1">
                        {v}
                        <button onClick={() => removeCustomValue(v)} className="ml-1 hover:bg-destructive/20 rounded p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Input
                    placeholder="Tambah nilai lain (misal: Gotong Royong)"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomValue(); } }}
                  />
                  <Button type="button" variant="outline" onClick={addCustomValue}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Tiga Kata yang Menggambarkan Suasana Sekolah</Label>
                <Input value={suasana} onChange={(e) => setSuasana(e.target.value)} placeholder="Hangat, disiplin, ceria" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Hal yang Tidak Akan Dikompromikan</Label>
                <Textarea rows={2} value={tidakKompromi} onChange={(e) => setTidakKompromi(e.target.value)} placeholder="Prinsip non-negotiable Anda." />
              </div>
            </CardContent>
          </Card>

          {/* Bagian 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary">Bagian 03</Badge> Keunggulan Nyata
              </CardTitle>
              <CardDescription>Diferensiasi yang bermakna — bukan klaim "terbaik"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Program / Pendekatan Khas yang Tidak Dimiliki Kompetitor</Label>
                <Textarea rows={2} value={programKhas} onChange={(e) => setProgramKhas(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Yang Paling Sering Dipuji Orang Tua & Siswa</Label>
                <Textarea rows={2} value={pujian} onChange={(e) => setPujian(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Pilihan Bidang Unggulan</Label>
                <Input value={bidangUnggulan} onChange={(e) => setBidangUnggulan(e.target.value)} placeholder="Misal: Tahfidz, Sains, Seni, Olahraga" />
              </div>
            </CardContent>
          </Card>

          {/* Bagian 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="secondary">Bagian 04</Badge> Audiens & Kompetitor
              </CardTitle>
              <CardDescription>Mengenali siapa yang paling cocok bertumbuh bersama Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Gambaran Orang Tua Ideal</Label>
                <Textarea rows={2} value={orangTuaIdeal} onChange={(e) => setOrangTuaIdeal(e.target.value)} placeholder="Profil orang tua yang paling cocok dengan filosofi sekolah." />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Tipe Siswa yang Paling Berkembang</Label>
                <Textarea rows={2} value={tipeSiswa} onChange={(e) => setTipeSiswa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Mengapa Sebagian Orang Tua Memilih Sekolah Lain? (Jujur)</Label>
                <Textarea rows={2} value={alasanPilihLain} onChange={(e) => setAlasanPilihLain(e.target.value)} placeholder="Kejujuran ini membantu mempertajam positioning." />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            size="lg"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Merumuskan jati diri sekolah Anda...</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> Rumuskan Jati Diri dengan AI</>
            )}
          </Button>
        </div>
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

          {isLoading && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p className="text-muted-foreground font-medium">Merumuskan jati diri sekolah Anda...</p>
              </CardContent>
            </Card>
          )}

          {report && (
            <Card className="dashboard-print">
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Jati Diri Sekolah</CardTitle>
                    <CardDescription>
                      {namaSekolah || profile?.school_name} — Tahun Ajaran {academicYear}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ReportDisplay title="Jati Diri Sekolah" content={report} />
              </CardContent>
            </Card>
          )}

          <div className="hidden print:block mt-16 pt-8 border-t border-border">
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-16">Mengetahui,</p>
                <div className="border-b border-foreground w-48 mx-auto mb-1" />
                <p className="text-sm font-semibold">Kepala Sekolah</p>
                <p className="text-xs text-muted-foreground">{namaSekolah || profile?.school_name}</p>
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
