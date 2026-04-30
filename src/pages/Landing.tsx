import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, ClipboardCheck, Search, Target, Users, TrendingUp,
  Calendar, UserCircle, Shield, Compass, PenTool, Eye, Fingerprint,
  ArrowRight, Check, Sparkles, BarChart3, Zap, Brain, Award, Rocket,
} from "lucide-react";

const features = [
  { icon: ClipboardCheck, title: "Audit Marketing", desc: "60 pertanyaan diagnostik untuk mengukur kesehatan marketing sekolah Anda." },
  { icon: Compass, title: "Arsitek Konsep AI", desc: "Rumuskan purwarupa sekolah dari nol dengan 5 tahapan strategis." },
  { icon: Fingerprint, title: "Jati Diri Generator", desc: "Temukan Brand DNA, positioning, dan tagline sekolah yang autentik." },
  { icon: PenTool, title: "Copywriter AI", desc: "Ubah bahasa katalog menjadi pesan emosional yang membangun trust." },
  { icon: Eye, title: "Diagnosis Visi", desc: "Ukur seberapa kuat visi sekolah terinternalisasi pada guru & siswa." },
  { icon: Target, title: "Positioning Sekolah", desc: "Bangun positioning yang tajam dan berbeda dari kompetitor." },
  { icon: Users, title: "Analisis Kompetitor", desc: "Pahami kekuatan & kelemahan sekolah pesaing di area Anda." },
  { icon: TrendingUp, title: "Strategi Pertumbuhan", desc: "Roadmap pertumbuhan PPDB berbasis data dan analisis AI." },
  { icon: Calendar, title: "Perencana Konten", desc: "Kalender konten sosmed siap pakai untuk tim marketing sekolah." },
  { icon: UserCircle, title: "Persona Orang Tua", desc: "Profil mendalam target orang tua ideal sekolah Anda." },
  { icon: Shield, title: "Analisis SWOT", desc: "Pemetaan SWOT komprehensif berbasis AI untuk pengambilan keputusan." },
  { icon: Search, title: "Riset Pasar", desc: "Insight pasar pendidikan lokal untuk strategi PPDB yang tepat." },
];

const benefits = [
  { icon: Brain, title: "Didukung AI Terdepan", desc: "Menggunakan model Google Gemini terbaru untuk analisis strategis berkualitas konsultan." },
  { icon: Zap, title: "Hasil Dalam Hitungan Menit", desc: "Tidak perlu menunggu konsultan eksternal berminggu-minggu. Laporan siap pakai instan." },
  { icon: Award, title: "Dirancang Khusus Sekolah Indonesia", desc: "100% Bahasa Indonesia dengan konteks pendidikan lokal yang relevan." },
  { icon: BarChart3, title: "Laporan Siap Cetak", desc: "Setiap analisis dilengkapi laporan PDF profesional dengan blok tanda tangan." },
];

const testimonials = [
  { name: "Bpk. Ahmad Hidayat", role: "Kepala Sekolah SD IT Al-Hikmah", quote: "Audit marketingnya membuka mata kami. Dalam 30 hari kami tahu persis apa yang harus diperbaiki." },
  { name: "Ibu Sari Lestari", role: "Marketing SMP Permata Bangsa", quote: "Copywriter AI-nya luar biasa. Brosur kami sekarang benar-benar menyentuh hati orang tua." },
  { name: "Bpk. Rizal Pratama", role: "Yayasan Cendekia Nusantara", quote: "Arsitek Konsep AI membantu kami merumuskan sekolah baru dari nol. Hemat waktu berbulan-bulan." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">SchoolGrowth</span>
              <span className="text-xs text-secondary font-semibold">AI</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#manfaat" className="hover:text-primary transition-colors">Manfaat</a>
            <a href="#testimoni" className="hover:text-primary transition-colors">Testimoni</a>
            <a href="#harga" className="hover:text-primary transition-colors">Harga</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/5 text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              Platform Marketing AI #1 untuk Sekolah Indonesia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Bangun Sekolah yang <span className="text-primary">Tumbuh & Diingat</span> dengan Kekuatan AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              13+ tools strategis berbasis AI untuk membantu sekolah Anda merumuskan jati diri, menarik orang tua ideal, dan tumbuh secara berkelanjutan—tanpa perlu konsultan mahal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-base h-12 px-8">
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#fitur">
                <Button size="lg" variant="outline" className="text-base h-12 px-8">
                  Lihat Semua Fitur
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> 100% Bahasa Indonesia</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> Tanpa Kartu Kredit</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> Laporan PDF Siap Cetak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "13+", label: "Tools AI Strategis" },
            { num: "60", label: "Pertanyaan Audit" },
            { num: "5", label: "Output Brand Identity" },
            { num: "100%", label: "Konteks Indonesia" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{s.num}</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">Fitur Lengkap</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Semua yang Sekolah Anda Butuhkan</h2>
            <p className="text-muted-foreground text-lg">
              Dari audit marketing hingga membangun jati diri brand—satu platform untuk semua kebutuhan strategis sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="manfaat" className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">Mengapa SchoolGrowth AI</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dibuat untuk Hasil Nyata</h2>
            <p className="text-muted-foreground text-lg">
              Bukan sekadar tools—ini partner strategis sekolah Anda 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <Card key={b.title} className="border-l-4 border-l-primary">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">Cara Kerja</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">3 Langkah Mudah</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Daftar Akun", desc: "Buat akun gratis dengan email & data sekolah Anda. Akun akan diverifikasi admin." },
              { step: "02", title: "Pilih Tools", desc: "Akses 13+ tools AI strategis. Mulai dari audit marketing atau bangun brand dari nol." },
              { step: "03", title: "Eksekusi & Cetak", desc: "Dapatkan laporan strategis lengkap. Cetak PDF profesional, langsung pakai." },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="text-6xl font-extrabold text-primary/10 mb-2">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">Testimoni</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dipercaya Sekolah-Sekolah Visioner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 italic text-foreground/80">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {t.name.split(" ")[1]?.[0] ?? t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4">Harga</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investasi yang Sebanding</h2>
            <p className="text-muted-foreground text-lg">
              Lebih murah dari satu sesi konsultan, manfaat sepanjang tahun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Professional", price: "Rp 59K", per: "/bulan", desc: "Untuk sekolah aktif tumbuh", features: ["Semua 13+ Tools AI", "Laporan Tanpa Batas", "Cetak PDF Premium", "Riwayat Lengkap", "Support Prioritas"], highlight: true },
              { name: "Enterprise", price: "Hubungi Kami", desc: "Untuk yayasan & multi-sekolah", features: ["Multi-Sekolah", "Dedicated Manager", "Custom Branding", "Training Tim", "SLA Khusus"], highlight: false },
            ].map((p) => (
              <Card key={p.name} className={p.highlight ? "border-primary border-2 shadow-xl relative" : ""}>
                {p.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Paling Populer</Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    {p.per && <span className="text-muted-foreground text-sm">{p.per}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{p.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button className={`w-full ${p.highlight ? "bg-primary hover:bg-primary/90" : ""}`} variant={p.highlight ? "default" : "outline"}>
                      Mulai Sekarang
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <Rocket className="absolute top-4 right-4 h-40 w-40" />
            </div>
            <CardContent className="p-10 md:p-14 text-center relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Tumbuhkan Sekolah Anda?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
                Bergabung dengan ratusan sekolah Indonesia yang sudah merasakan dampak strategi marketing berbasis AI.
              </p>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-base h-12 px-8 bg-background text-primary hover:bg-background/90">
                  Daftar Gratis Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">SchoolGrowth AI</span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} SchoolGrowth AI. Platform Marketing untuk Sekolah Indonesia.
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link to="/login" className="hover:text-primary">Masuk</Link>
              <Link to="/register" className="hover:text-primary">Daftar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
