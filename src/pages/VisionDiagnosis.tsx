import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  "Saya bisa menyebutkan visi sekolah kita tanpa melihat dinding",
  "Saya tahu apa makna visi itu bagi cara saya mengajar sehari-hari",
  "Saya pernah merujuk pada visi saat mengambil keputusan di kelas",
  "Siswa saya tahu mengapa mereka belajar di sekolah ini",
  "Saya bangga menceritakan visi sekolah ini kepada orang lain",
];

type Level = {
  label: string;
  range: string;
  color: string;
  bg: string;
  description: string;
  recommendation: string;
};

const levels: Record<number, Level> = {
  0: {
    label: "Kritis",
    range: "0 Ya",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description: "Visi sekolah belum hidup dalam keseharian. Guru dan siswa belum terhubung dengan arah sekolah.",
    recommendation: "Lakukan rumusan ulang visi bersama tim inti, lalu sosialisasikan dengan ritual mingguan.",
  },
  1: {
    label: "Perlu Perhatian",
    range: "1 Ya",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    description: "Visi sudah ada namun belum diinternalisasi. Hanya sebagian kecil warga sekolah yang menghidupinya.",
    recommendation: "Adakan workshop visi dan turunkan menjadi perilaku konkret di kelas.",
  },
  2: {
    label: "Berkembang",
    range: "2 Ya",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    description: "Visi mulai dipahami, tapi belum menjadi pegangan utama dalam pengambilan keputusan.",
    recommendation: "Buat sistem refleksi rutin: 'Apakah keputusan ini sejalan dengan visi?'",
  },
  3: {
    label: "Kuat",
    range: "3 Ya",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description: "Visi sudah menjadi kompas. Banyak guru yang menjadikannya rujukan dalam mengajar.",
    recommendation: "Perkuat dengan storytelling visi melalui testimoni guru dan siswa.",
  },
  4: {
    label: "Kuat",
    range: "4 Ya",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description: "Visi sudah menjadi kompas. Banyak guru yang menjadikannya rujukan dalam mengajar.",
    recommendation: "Perkuat dengan storytelling visi melalui testimoni guru dan siswa.",
  },
  5: {
    label: "Luar Biasa",
    range: "5 Ya",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description: "Visi telah menjadi DNA sekolah. Setiap warga sekolah hidup dan bangga membawanya.",
    recommendation: "Dokumentasikan praktik baik ini dan jadikan model untuk sekolah lain.",
  },
};

export default function VisionDiagnosis() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (idx: number, value: boolean) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
  };

  const allAnswered = answers.every((a) => a !== null);
  const yesCount = answers.filter((a) => a === true).length;
  const result = levels[yesCount];

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Diagnosis Visi</h1>
            <p className="text-sm text-muted-foreground">
              Ukur seberapa hidup visi sekolah Anda dalam 5 pertanyaan
            </p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Pertanyaan Refleksi</CardTitle>
            <CardDescription>
              Jawab dengan jujur. Pilih ✓ (Ya) atau ✗ (Tidak) untuk setiap pernyataan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:border-primary/40 transition-colors"
              >
                <div className="flex gap-3 flex-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-foreground">{q}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant={answers[idx] === true ? "default" : "outline"}
                    onClick={() => setAnswer(idx, true)}
                    className={cn(
                      "min-w-[80px]",
                      answers[idx] === true && "bg-emerald-600 hover:bg-emerald-700"
                    )}
                  >
                    <Check className="h-4 w-4" /> Ya
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={answers[idx] === false ? "default" : "outline"}
                    onClick={() => setAnswer(idx, false)}
                    className={cn(
                      "min-w-[80px]",
                      answers[idx] === false && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    <X className="h-4 w-4" /> Tidak
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-4 flex justify-end">
              <Button
                size="lg"
                disabled={!allAnswered}
                onClick={() => setSubmitted(true)}
              >
                <Sparkles className="h-4 w-4" />
                Lihat Hasil Diagnosis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className={cn("border-2 shadow-sm", result.bg)}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardDescription className="font-medium">Skor Anda: {result.range} dari 5</CardDescription>
                <span className={cn("text-xs font-semibold px-3 py-1 rounded-full bg-white/80", result.color)}>
                  Level Visi
                </span>
              </div>
              <CardTitle className={cn("text-4xl mt-2", result.color)}>{result.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Diagnosis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
              </div>
              <div className="pt-3 border-t border-current/10">
                <h3 className="text-sm font-semibold text-foreground mb-1">Rekomendasi Langkah</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Skala Tingkat Visi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { l: "Kritis", c: "bg-red-100 text-red-700", n: "0" },
                  { l: "Perlu Perhatian", c: "bg-orange-100 text-orange-700", n: "1" },
                  { l: "Berkembang", c: "bg-yellow-100 text-yellow-700", n: "2" },
                  { l: "Kuat", c: "bg-blue-100 text-blue-700", n: "3-4" },
                  { l: "Luar Biasa", c: "bg-emerald-100 text-emerald-700", n: "5" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className={cn(
                      "p-3 rounded-lg text-center",
                      s.c,
                      s.l === result.label && "ring-2 ring-offset-2 ring-current"
                    )}
                  >
                    <div className="text-lg font-bold">{s.n}</div>
                    <div className="text-xs font-medium">{s.l}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Ulangi Diagnosis
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
