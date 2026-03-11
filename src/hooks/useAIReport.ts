import { useState, useCallback } from "react";
import { streamChat } from "@/lib/ai-stream";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SaveOptions {
  featureUsed: string;
  academicYear: string;
  schoolName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputData: object;
  score?: object | null;
}

export function useAIReport() {
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generate = useCallback(async (
    systemPrompt: string,
    userPrompt: string,
    saveOptions?: SaveOptions
  ) => {
    setReport("");
    setIsLoading(true);
    setSavedId(null);
    let fullReport = "";

    await streamChat({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      onDelta: (chunk) => {
        fullReport += chunk;
        setReport((prev) => prev + chunk);
      },
      onDone: async () => {
        setIsLoading(false);
        // Save to database
        if (saveOptions && user) {
          const { data, error } = await supabase.from("ai_reports").insert({
            user_id: user.id,
            school_name: saveOptions.schoolName,
            feature_used: saveOptions.featureUsed,
            academic_year: saveOptions.academicYear,
            input_data: saveOptions.inputData as any,
            ai_report_result: fullReport,
            score: saveOptions.score as any ?? null,
          }).select("id").single();

          if (error) {
            toast({ title: "Peringatan", description: "Laporan berhasil dibuat tapi gagal disimpan.", variant: "destructive" });
          } else if (data) {
            setSavedId(data.id);
            toast({ title: "Tersimpan!", description: "Laporan berhasil disimpan ke database." });
          }
        }
      },
      onError: (error) => {
        setIsLoading(false);
        toast({ title: "Kesalahan", description: error, variant: "destructive" });
      },
    });
  }, [toast, user]);

  return { report, isLoading, generate, setReport, savedId };
}
