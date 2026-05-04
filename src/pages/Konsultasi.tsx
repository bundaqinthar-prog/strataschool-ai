import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Loader2, Sparkles, Trash2 } from "lucide-react";
import { streamChat } from "@/lib/ai-stream";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WelcomeHero } from "@/components/WelcomeHero";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `Kamu adalah "Asisten Konsultan Marketing Sekolah" — pakar marketing, branding, dan manajemen sekolah di Indonesia.

Tugasmu:
- Menjawab pertanyaan kepala sekolah / tim marketing seputar PPDB, branding sekolah, strategi konten, positioning, kompetitor, persona orang tua, hingga renstra.
- Memberi saran konkret, terstruktur, dan dapat langsung diterapkan di konteks sekolah Indonesia (Kurikulum Merdeka, SNP, dst).
- Gunakan bahasa Indonesia yang ramah, profesional, dan to the point.
- Format jawaban dengan markdown rapi: heading, bullet, tabel, dan langkah-langkah jika relevan.
- Jika data sekolah belum disebut, ajukan pertanyaan klarifikasi singkat sebelum memberi rekomendasi besar.
- Hindari jawaban generik; selalu beri contoh nyata, angka, atau template siap pakai.`;

const SUGGESTIONS = [
  "Bagaimana strategi PPDB di tengah persaingan ketat?",
  "Buatkan caption Instagram untuk open house sekolah.",
  "Apa diferensiasi yang kuat untuk SD swasta baru?",
  "Bantu saya merumuskan visi & misi sekolah.",
];

export default function Konsultasi() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Msg = { role: "user", content };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const schoolContext = profile?.school_name
      ? `\n\nKonteks pengguna: Sekolah "${profile.school_name}", jabatan ${profile.jabatan || "-"}.`
      : "";

    await streamChat({
      messages: [
        { role: "system", content: SYSTEM_PROMPT + schoolContext },
        ...newHistory,
      ],
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          )
        );
      },
      onDone: () => setLoading(false),
      onError: (err) => {
        setLoading(false);
        toast.error(err);
        setMessages((prev) => prev.slice(0, -1));
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Konsultasi AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Tanya apa saja seputar marketing dan pengembangan sekolah Anda.
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Bersihkan
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 space-y-6">
              <div className="w-full max-w-3xl">
                <WelcomeHero variant="compact" schoolName={profile?.school_name} />
              </div>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Halo! Saya asisten AI Anda 👋</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Mulai konsultasi gratis dengan memilih pertanyaan di bawah, atau ketik pertanyaan Anda sendiri.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary transition-colors text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-2xl px-4 py-2.5 max-w-[80%] ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none report-markdown">
                        {m.content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-3 bg-card">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pertanyaan Anda... (Enter untuk kirim, Shift+Enter baris baru)"
              className="resize-none min-h-[44px] max-h-32"
              rows={1}
              disabled={loading}
            />
            <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI bisa membuat kesalahan. Verifikasi informasi penting sebelum digunakan.
          </p>
        </div>
      </Card>
    </div>
  );
}
