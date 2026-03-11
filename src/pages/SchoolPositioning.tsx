import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function SchoolPositioning() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah ahli strategi brand yang berspesialisasi dalam positioning sekolah di pasar pendidikan Indonesia. Buat strategi positioning yang menarik dan berbeda. Tulis dalam Bahasa Indonesia dengan format markdown.`,
      `Buat strategi positioning untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nTahun Ajaran: ${data.academicYear}\n\nBerikan:\n1. **Proposisi Nilai Unik (USP)** - USP yang jelas dan menarik\n2. **Pernyataan Positioning Brand** - Pernyataan positioning formal\n3. **Strategi Diferensiasi** - Cara menonjol dari kompetitor\n4. **Pesan Brand untuk Orang Tua** - Pesan utama yang beresonansi dengan target orang tua\n5. **Rekomendasi Implementasi**`,
      {
        featureUsed: "Positioning Sekolah",
        academicYear: data.academicYear,
        schoolName: data.schoolName,
        inputData: data,
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Positioning Sekolah</h1>
        <p className="text-muted-foreground mt-1">Temukan positioning brand unik sekolah Anda</p>
      </div>
      <SchoolProfileForm title="Profil Sekolah" description="Masukkan detail untuk menemukan positioning Anda" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay
        title="Laporan Positioning"
        content={report}
        isLoading={isLoading}
        pdfMeta={report ? { schoolName: profile?.school_name || "", featureName: "Positioning Sekolah", academicYear: "" } : undefined}
      />
    </div>
  );
}
