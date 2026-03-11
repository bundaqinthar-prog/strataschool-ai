import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketResearch() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah peneliti pasar pendidikan ahli yang berspesialisasi di pasar pendidikan Indonesia. Berikan analisis yang detail dan berbasis data. Tulis dalam Bahasa Indonesia yang profesional dengan format markdown.`,
      `Analisis pasar untuk sekolah ini:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nTahun Ajaran: ${data.academicYear}\n\nBerikan:\n1. **Peluang Pasar Lokal** - Ukuran pasar, potensi pertumbuhan di ${data.city}\n2. **Insight Permintaan Orang Tua** - Apa yang diinginkan orang tua, prioritas, faktor keputusan\n3. **Tren Pendidikan** - Tren relevan dalam pendidikan Indonesia\n4. **Potensi Pertumbuhan** - Peluang spesifik untuk pertumbuhan pendaftaran\n5. **Rekomendasi Strategis** - Langkah-langkah aksi yang dapat ditindaklanjuti`,
      {
        featureUsed: "Riset Pasar",
        academicYear: data.academicYear,
        schoolName: data.schoolName,
        inputData: data,
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Riset Pasar</h1>
        <p className="text-muted-foreground mt-1">Analisis pasar pendidikan lokal dan permintaan orang tua</p>
      </div>
      <SchoolProfileForm title="Profil Sekolah" description="Masukkan detail sekolah Anda untuk menghasilkan riset pasar" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay
        title="Laporan Riset Pasar"
        content={report}
        isLoading={isLoading}
        pdfMeta={report ? { schoolName: profile?.school_name || "", featureName: "Riset Pasar", academicYear: "" } : undefined}
      />
    </div>
  );
}
