import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AcademicYearSelector } from "@/components/AcademicYearSelector";
import { AuditReportView } from "@/components/AuditReportView";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";
import { auditAspects, ratingLabels, calculateScores } from "@/lib/audit-questions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MarketingAudit() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<ReturnType<typeof calculateScores> | null>(null);
  const [academicYear, setAcademicYear] = useState("");
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const aspect = auditAspects[currentStep];
  const totalQuestions = 60;
  const answeredCount = Object.keys(answers).length;
  const allCurrentAnswered = aspect?.questions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const result = calculateScores(answers);
    setScores(result);

    const scoresSummary = result.aspectScores
      .map((a) => `${a.title}: ${a.percentage}% (rata-rata: ${a.average}/5)`)
      .join("\n");

    generate(
      `Anda adalah konsultan marketing sekolah ahli yang berspesialisasi di pasar pendidikan Indonesia (TK, SD, SMP, SMA). Analisis hasil audit marketing dan berikan insight yang dapat ditindaklanjuti. Tulis dalam Bahasa Indonesia yang profesional. Gunakan format markdown dengan header yang jelas.

PENTING: Di akhir laporan, sertakan bagian "## Rencana Aksi 30 Hari" dengan sub-bagian "### Minggu 1", "### Minggu 2", "### Minggu 3", "### Minggu 4". Setiap minggu berisi daftar aksi dengan format "- Aksi item".`,
      `Berikut hasil audit marketing sekolah:\n\nSekolah: ${profile?.school_name || "Unknown"}\nTahun Ajaran: ${academicYear}\nSkor Total: ${result.totalPercentage}% (${result.level})\nRata-rata: ${result.totalAverage}/5\n\nSkor per kategori:\n${scoresSummary}\n\nBerikan laporan audit marketing yang detail termasuk:\n1. **Ringkasan Eksekutif** - Penilaian keseluruhan\n2. **Kekuatan Marketing** - Apa yang sudah dilakukan dengan baik\n3. **Kelemahan Marketing** - Area yang perlu diperbaiki\n4. **Peluang Pertumbuhan** - Potensi yang belum dimanfaatkan\n5. **Rekomendasi Spesifik** - Langkah-langkah aksi yang diprioritaskan berdasarkan dampak\n6. **Rencana Aksi 30 Hari** - Rencana aksi mingguan (Minggu 1 s/d Minggu 4) dengan langkah konkret\n\nFokus pada saran praktis dan dapat diterapkan untuk marketing sekolah di Indonesia.`,
      {
        featureUsed: "Marketing Audit",
        academicYear,
        schoolName: profile?.school_name || "Unknown",
        inputData: { answers, academicYear },
        score: result,
      }
    );
  };

  const handleReset = () => {
    setScores(null);
    setCurrentStep(0);
    setAnswers({});
    setAcademicYear("");
  };

  if (scores) {
    return (
      <AuditReportView
        scores={scores}
        report={report}
        isLoading={isLoading}
        academicYear={academicYear}
        schoolName={profile?.school_name || "Sekolah"}
        evaluatorName={profile?.full_name || "—"}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Marketing</h1>
        <p className="text-muted-foreground mt-1">
          Jawab 60 pertanyaan untuk mengevaluasi performa marketing sekolah Anda
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AcademicYearSelector value={academicYear} onChange={setAcademicYear} />
        </CardContent>
      </Card>

      {!academicYear ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Pilih tahun ajaran terlebih dahulu untuk memulai audit.
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{answeredCount} dari {totalQuestions} terjawab</span>
              <span className="text-muted-foreground">Langkah {currentStep + 1} dari {auditAspects.length}</span>
            </div>
            <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2">
            {auditAspects.map((a, i) => {
              const answered = a.questions.filter((q) => answers[q.id] !== undefined).length;
              return (
                <button
                  key={a.id}
                  onClick={() => setCurrentStep(i)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : answered === 10
                      ? "bg-secondary/20 text-secondary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {a.icon} {a.title}
                </button>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{aspect.icon} {aspect.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{aspect.desc}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {aspect.questions.map((q, qi) => (
                <div key={q.id} className="space-y-3 pb-4 border-b last:border-0">
                  <p className="text-sm font-medium">
                    {qi + 1}. {q.text}
                  </p>
                  <RadioGroup
                    value={answers[q.id]?.toString()}
                    onValueChange={(val) => handleAnswer(q.id, parseInt(val))}
                    className="flex flex-wrap gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <div key={v} className="flex items-center">
                        <RadioGroupItem value={v.toString()} id={`q${q.id}-${v}`} className="sr-only peer" />
                        <Label
                          htmlFor={`q${q.id}-${v}`}
                          className="cursor-pointer px-3 py-1.5 rounded-md border text-xs font-medium transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary hover:bg-muted"
                        >
                          {v} - {ratingLabels[v]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep((p) => p - 1)} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
            </Button>
            {currentStep < auditAspects.length - 1 ? (
              <Button onClick={() => setCurrentStep((p) => p + 1)} disabled={!allCurrentAnswered}>
                Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={answeredCount < totalQuestions}>
                Kirim Audit
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
