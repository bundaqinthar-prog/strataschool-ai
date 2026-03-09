import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { auditAspects, ratingLabels, calculateScores } from "@/lib/audit-questions";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";

export default function MarketingAudit() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<ReturnType<typeof calculateScores> | null>(null);
  const { report, isLoading, generate } = useAIReport();

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
      .map((a) => `${a.title}: ${a.percentage}%`)
      .join("\n");

    generate(
      `You are an expert school marketing consultant specializing in the Indonesian education market (TK, SD, SMP, SMA). Analyze marketing audit results and provide actionable insights. Write in a professional, consultative tone. Structure your response with clear sections using markdown headers.`,
      `Here are the marketing audit results for a school:\n\nTotal Score: ${result.totalPercentage}% (${result.level})\n\nScores by aspect:\n${scoresSummary}\n\nPlease provide a detailed marketing audit report including:\n1. **Executive Summary** - Overall assessment\n2. **Marketing Strengths** - What the school does well\n3. **Marketing Weaknesses** - Areas needing improvement\n4. **Growth Opportunities** - Untapped potential\n5. **Specific Recommendations** - Actionable steps prioritized by impact\n\nFocus on practical, actionable advice relevant to Indonesian school marketing.`
    );
  };

  if (scores) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketing Audit Results</h1>
          <p className="text-muted-foreground mt-1">Your school marketing performance analysis</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{scores.totalPercentage}%</div>
              <Progress value={scores.totalPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Performance Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                scores.level === "Strong" ? "text-secondary" : scores.level === "Average" ? "text-yellow-500" : "text-destructive"
              }`}>
                {scores.level}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Raw Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scores.totalScore}/{scores.totalMax}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Score by Aspect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scores.aspectScores.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{a.title}</span>
                  <span className="text-muted-foreground">{a.percentage}%</span>
                </div>
                <Progress value={a.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <ReportDisplay title="AI Marketing Audit Report" content={report} isLoading={isLoading} />

        <Button variant="outline" onClick={() => { setScores(null); setCurrentStep(0); setAnswers({}); }}>
          Start New Audit
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing Audit</h1>
        <p className="text-muted-foreground mt-1">
          Answer 60 questions to evaluate your school's marketing performance
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">{answeredCount} of {totalQuestions} answered</span>
          <span className="text-muted-foreground">Step {currentStep + 1} of {auditAspects.length}</span>
        </div>
        <Progress value={(answeredCount / totalQuestions) * 100} className="h-2" />
      </div>

      {/* Step tabs */}
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

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>{aspect.icon} {aspect.title}</CardTitle>
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

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((p) => p - 1)}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        {currentStep < auditAspects.length - 1 ? (
          <Button onClick={() => setCurrentStep((p) => p + 1)} disabled={!allCurrentAnswered}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={answeredCount < totalQuestions}>
            Submit Audit
          </Button>
        )}
      </div>
    </div>
  );
}
