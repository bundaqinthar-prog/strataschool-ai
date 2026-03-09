import { SchoolProfileForm, SchoolProfile } from "@/components/SchoolProfileForm";
import { ReportDisplay } from "@/components/ReportDisplay";
import { useAIReport } from "@/hooks/useAIReport";

export default function ParentPersona() {
  const { report, isLoading, generate } = useAIReport();

  const handleSubmit = (data: SchoolProfile) => {
    generate(
      `Anda adalah spesialis persona marketing pendidikan untuk sekolah Indonesia. Buat persona orang tua yang detail dan realistis. Tulis dalam Bahasa Indonesia dengan format markdown.`,
      `Buat persona target orang tua untuk:\n\nSekolah: ${data.schoolName}\nKota: ${data.city}\nJenjang: ${data.educationLevel}\nJumlah Siswa: ${data.studentCount}\nTarget Orang Tua: ${data.targetParents}\nKisaran SPP: ${data.tuitionRange}\nProgram Unggulan: ${data.uniquePrograms}\n\nBuat 3 persona orang tua yang detail termasuk:\n1. **Demografi** - Usia, jenis kelamin, lokasi, jumlah keluarga\n2. **Profesi & Penghasilan** - Karir, tingkat penghasilan\n3. **Prioritas Pendidikan** - Apa yang paling mereka hargai\n4. **Kekhawatiran tentang Sekolah** - Ketakutan, kekhawatiran, keberatan\n5. **Saluran Komunikasi Pilihan** - Bagaimana mereka mengonsumsi informasi\n6. **Proses Pengambilan Keputusan** - Bagaimana mereka memilih sekolah\n7. **Pesan Marketing yang Beresonansi** - Apa yang akan menarik mereka\n\nBuat persona yang realistis untuk konteks Indonesia di ${data.city}.`
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Persona Orang Tua</h1>
        <p className="text-muted-foreground mt-1">Buat profil detail target orang tua siswa</p>
      </div>
      <SchoolProfileForm title="Profil Sekolah" description="Masukkan detail untuk membuat persona orang tua" onSubmit={handleSubmit} isLoading={isLoading} />
      <ReportDisplay title="Persona Orang Tua" content={report} isLoading={isLoading} />
    </div>
  );
}