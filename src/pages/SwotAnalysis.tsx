import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function SwotAnalysis() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah konsultan perencanaan strategis untuk sekolah Indonesia. Buat analisis SWOT yang menyeluruh. Tulis dalam Bahasa Indonesia dengan format markdown dan bagian yang jelas.`,
      `Buat analisis SWOT untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nTahun Ajaran: ${data.academicYear}\n\nBerikan:\n1. **Kekuatan (Strengths)** - Keunggulan internal (5-8 item dengan penjelasan)\n2. **Kelemahan (Weaknesses)** - Tantangan internal (5-8 item dengan penjelasan)\n3. **Peluang (Opportunities)** - Kemungkinan eksternal (5-8 item dengan penjelasan)\n4. **Ancaman (Threats)** - Risiko eksternal (5-8 item dengan penjelasan)\n5. **Prioritas Strategis** - 5 aksi teratas berdasarkan SWOT\n6. **Matriks SWOT** - Analisis silang (strategi SO, WO, ST, WT)`,
      {
        featureUsed: "Analisis SWOT",
        academicYear: data.academicYear,
        schoolName: data.schoolName,
        inputData: data,
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analisis SWOT</h1>
        <p className="text-muted-foreground mt-1">Buat analisis SWOT komprehensif untuk sekolah Anda</p>
      </div>
      <SchoolProfileForm title="Profil Sekolah" description="Masukkan detail untuk membuat analisis SWOT" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay
        title="Laporan Analisis SWOT"
        content={report}
        isLoading={isLoading}
        pdfMeta={report ? { schoolName: profile?.school_name || "", featureName: "Analisis SWOT", academicYear: "" } : undefined}
      />
    </div>
  );
}
