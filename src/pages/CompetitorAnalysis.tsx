import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function CompetitorAnalysis() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah ahli analisis kompetitif untuk sektor pendidikan Indonesia. Berikan analisis kompetitif yang menyeluruh dan strategis. Tulis dalam Bahasa Indonesia dengan format markdown.`,
      `Analisis lanskap persaingan untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nKompetitor: ${data.competitors || "Tidak disebutkan"}\nTahun Ajaran: ${data.academicYear}\n\nBerikan:\n1. **Kekuatan Kompetitor** - Kekuatan umum kompetitor\n2. **Kelemahan Kompetitor** - Kelemahan yang bisa dimanfaatkan\n3. **Peluang Positioning** - Celah di pasar\n4. **Rekomendasi Strategis** - Cara mendapatkan keunggulan kompetitif\n5. **Rencana Aksi** - Langkah-langkah yang diprioritaskan`,
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
