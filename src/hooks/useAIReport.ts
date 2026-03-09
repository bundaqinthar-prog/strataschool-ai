import { useState, useCallback } from "react";
import { streamChat } from "@/lib/ai-stream";
import { useToast } from "@/hooks/use-toast";

export function useAIReport() {
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generate = useCallback(async (systemPrompt: string, userPrompt: string) => {
    setReport("");
    setIsLoading(true);

    await streamChat({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      onDelta: (chunk) => {
        setReport((prev) => prev + chunk);
      },
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        toast({ title: "Kesalahan", description: error, variant: "destructive" });
      },
    });
  }, [toast]);

  return { report, isLoading, generate, setReport };
}