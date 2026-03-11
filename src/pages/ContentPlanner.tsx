import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";
import { useAuth } from "@/contexts/AuthContext";

export default function ContentPlanner() {
  const { report, isLoading, generate } = useAIReport();
  const { profile } = useAuth();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah ahli strategi konten media sosial untuk sekolah di Indonesia. Buat rencana konten yang menarik dan praktis. Tulis dalam Bahasa Indonesia dengan format markdown dan tabel jika sesuai.`,
      `Buat rencana konten media sosial 30 hari untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nTarget Orang Tua: ${data.targetParents}\nProgram Unggulan: ${data.uniquePrograms}\nTarget Audiens: ${data.targetAudience || data.targetParents}\nTema Utama: ${data.keyThemes || "Keunggulan akademik, kehidupan sekolah, edukasi orang tua"}\nTahun Ajaran: ${data.academicYear}\n\nBerikan:\n1. **Ringkasan Strategi Konten** - Tujuan dan tema\n2. **Kalender Konten 30 Hari** - Rencana harian dengan jenis posting, platform, ide caption\n3. **Ide Posting** - 15+ ide posting kreatif\n4. **Ide Konten Video** - 10 konsep video (Reels/TikTok/YouTube)\n5. **Konten Edukatif untuk Orang Tua** - 10 ide konten informatif\n6. **Tips & Praktik Terbaik** - Waktu posting, hashtag, tips engagement untuk audiens Indonesia`,
      {
        featureUsed: "Perencana Konten",
        academicYear: data.academicYear,
        schoolName: data.schoolName,
        inputData: data,
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perencana Konten Media Sosial</h1>
        <p className="text-muted-foreground mt-1">Buat rencana konten media sosial 30 hari</p>
      </div>
      <SchoolProfileForm title="Detail Rencana Konten" description="Masukkan info sekolah dan preferensi konten" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["targetAudience", "keyThemes"]} />
      <ReportDisplay
        title="Rencana Konten 30 Hari"
        content={report}
        isLoading={isLoading}
        pdfMeta={report ? { schoolName: profile?.school_name || "", featureName: "Perencana Konten", academicYear: "" } : undefined}
      />
    </div>
  );
}
