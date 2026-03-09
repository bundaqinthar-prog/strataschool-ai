import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function GrowthStrategy() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah ahli strategi pertumbuhan pendaftaran sekolah yang berspesialisasi di sekolah-sekolah Indonesia. Berikan strategi pertumbuhan yang kreatif dan praktis. Tulis dalam Bahasa Indonesia dengan format markdown.`,
      `Buat strategi pertumbuhan pendaftaran untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\nTantangan Saat Ini: ${data.currentEnrollment || "Tidak disebutkan"}\n\nBerikan:\n1. **Strategi Promosi** - Kampanye dan taktik marketing\n2. **Keterlibatan Komunitas** - Ide keterlibatan komunitas lokal\n3. **Acara Sekolah** - Acara yang menarik calon orang tua\n4. **Kemitraan** - Peluang kemitraan strategis\n5. **Strategi Referral** - Program word-of-mouth dan referral\n6. **Timeline Implementasi** - Rencana aksi 90 hari`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Strategi Pertumbuhan</h1>
        <p className="text-muted-foreground mt-1">Buat strategi untuk meningkatkan pendaftaran siswa</p>
      </div>
      <SchoolProfileForm title="Profil Sekolah" description="Masukkan detail untuk membuat strategi pertumbuhan" onSubmit={handleSubmit} isLoading={isLoading} extraFields={["currentEnrollment"]} />
      <ReportDisplay title="Laporan Strategi Pertumbuhan" content={report} isLoading={isLoading} />
    </div>
  );
}