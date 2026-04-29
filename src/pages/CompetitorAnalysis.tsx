import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function CompetitorAnalysis() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    const linksBlock = data.competitorLinks?.trim()
      ? `\n\nLink Website & Media Sosial Kompetitor (gali insight dari sini — perkirakan positioning, gaya komunikasi, target audiens, program unggulan, dan tone berdasarkan domain/platform):\n${data.competitorLinks}`
      : "";

    generate(
      `Anda adalah ahli analisis kompetitif untuk sektor pendidikan Indonesia. Berikan analisis kompetitif yang menyeluruh dan strategis. Jika diberikan link website atau media sosial kompetitor, gunakan informasi domain, nama akun, dan platform tersebut untuk menyimpulkan positioning, gaya konten, dan strategi marketing kompetitor secara cerdas (sebutkan secara eksplisit insight per link). Tulis dalam Bahasa Indonesia dengan format markdown.`,
      `Analisis lanskap persaingan untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nKompetitor: ${data.competitors || "Tidak disebutkan"}\nTahun Ajaran: ${data.academicYear}${linksBlock}\n\nBerikan:\n1. **Analisis Profil Online Kompetitor** (jika ada link) - insight per link/akun\n2. **Kekuatan Kompetitor** - Kekuatan umum kompetitor\n3. **Kelemahan Kompetitor** - Kelemahan yang bisa dimanfaatkan\n4. **Peluang Positioning** - Celah di pasar\n5. **Rekomendasi Strategis** - Cara mendapatkan keunggulan kompetitif\n6. **Rencana Aksi** - Langkah-langkah yang diprioritaskan`,
      {
        featureUsed: "Analisis Kompetitor",
        academicYear: data.academicYear,
        schoolName: data.schoolName,
        inputData: data,
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analisis Kompetitor</h1>
        <p className="text-muted-foreground mt-1">Analisis lanskap persaingan sekolah Anda</p>
      </div>
      <SchoolProfileForm title="Info Sekolah & Kompetitor" description="Masukkan detail sekolah dan kompetitor Anda" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["competitors"]} />
      <ReportDisplay
        title="Laporan Analisis Kompetitor"
        content={report}
        isLoading={isLoading}
        pdfMeta={report ? { schoolName: profile?.school_name || "", featureName: "Analisis Kompetitor", academicYear: "" } : undefined}
      />
    </div>
  );
}
