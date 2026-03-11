export interface AuditQuestion {
  id: number;
  text: string;
}

export interface AuditAspect {
  id: string;
  title: string;
  icon: string;
  questions: AuditQuestion[];
}

export const auditAspects: AuditAspect[] = [
  {
    id: "brand",
    title: "Brand Awareness",
    icon: "🎯",
    questions: [
      { id: 1, text: "Sekolah memiliki identitas brand yang jelas dan mudah diingat (logo, warna, tagline)" },
      { id: 2, text: "Pesan brand mengkomunikasikan nilai unik sekolah dengan jelas" },
      { id: 3, text: "Positioning sekolah berbeda dari kompetitor" },
      { id: 4, text: "Konsistensi brand di semua materi marketing" },
      { id: 5, text: "Sekolah memiliki cerita brand yang menarik" },
      { id: 6, text: "Identitas visual menarik bagi demografi target orang tua" },
      { id: 7, text: "Nada komunikasi brand konsisten dan profesional" },
      { id: 8, text: "Reputasi sekolah dikelola secara aktif secara online" },
      { id: 9, text: "Kesadaran brand di komunitas lokal" },
      { id: 10, text: "Nilai-nilai sekolah dikomunikasikan dengan jelas kepada pemangku kepentingan" },
    ],
  },
  {
    id: "digital",
    title: "Digital Presence",
    icon: "💻",
    questions: [
      { id: 11, text: "Website sekolah modern, ramah mobile, dan informatif" },
      { id: 12, text: "Kehadiran media sosial aktif dan menarik" },
      { id: 13, text: "Google Business Profile dioptimalkan dan terbaru" },
      { id: 14, text: "Sekolah menggunakan iklan digital (Google Ads, iklan media sosial)" },
      { id: 15, text: "Strategi content marketing ada (blog, video, newsletter)" },
      { id: 16, text: "SEO website dioptimalkan untuk pencarian lokal" },
      { id: 17, text: "WhatsApp atau platform pesan digunakan untuk komunikasi" },
      { id: 18, text: "Email marketing digunakan untuk calon orang tua" },
      { id: 19, text: "Sekolah memantau analitik digital (traffic, engagement)" },
      { id: 20, text: "Video content sekolah diproduksi secara konsisten" },
    ],
  },
  {
    id: "leadgen",
    title: "Lead Generation",
    icon: "🧲",
    questions: [
      { id: 21, text: "Formulir pendaftaran atau pertanyaan online tersedia dan mudah" },
      { id: 22, text: "Sekolah berpartisipasi dalam pameran dan acara pendidikan" },
      { id: 23, text: "Kemitraan komunitas dan program outreach ada" },
      { id: 24, text: "Sekolah menggunakan marketing tradisional (spanduk, brosur, cetak)" },
      { id: 25, text: "Program referral untuk mendatangkan calon siswa baru" },
      { id: 26, text: "Database calon orang tua dikelola dengan baik" },
      { id: 27, text: "Landing page khusus untuk kampanye pendaftaran" },
      { id: 28, text: "Lead magnet (ebook, webinar, trial) tersedia" },
      { id: 29, text: "Sekolah memanfaatkan KOL/influencer lokal" },
      { id: 30, text: "Program open day/house dijalankan secara berkala" },
    ],
  },
  {
    id: "conversion",
    title: "Conversion Strategy",
    icon: "🔄",
    questions: [
      { id: 31, text: "Proses pendaftaran sederhana dan mudah digunakan" },
      { id: 32, text: "Sekolah menawarkan tur kampus atau acara open house" },
      { id: 33, text: "Sistem follow-up untuk pertanyaan calon orang tua" },
      { id: 34, text: "Sekolah melacak tingkat konversi dari pertanyaan ke pendaftaran" },
      { id: 35, text: "Kelas percobaan atau program orientasi ditawarkan" },
      { id: 36, text: "Testimoni dan kisah sukses ditampilkan" },
      { id: 37, text: "Waktu respons terhadap pertanyaan orang tua cepat" },
      { id: 38, text: "Tim pendaftaran terlatih dalam penjualan konsultatif" },
      { id: 39, text: "Informasi beasiswa atau bantuan keuangan mudah diakses" },
      { id: 40, text: "Proses onboarding siswa baru terstruktur" },
    ],
  },
  {
    id: "engagement",
    title: "Parent Engagement",
    icon: "💬",
    questions: [
      { id: 41, text: "Kepuasan orang tua diukur secara berkala" },
      { id: 42, text: "Program referral ada untuk orang tua saat ini" },
      { id: 43, text: "Sekolah mengkomunikasikan pencapaian dan milestone" },
      { id: 44, text: "Acara komunitas orang tua memperkuat keterlibatan" },
      { id: 45, text: "Jaringan alumni dipelihara dan dimanfaatkan" },
      { id: 46, text: "Sekolah menangani keluhan dan umpan balik secara efektif" },
      { id: 47, text: "Komunikasi dengan orang tua sering dan transparan" },
      { id: 48, text: "Tingkat retensi siswa dipantau secara aktif" },
      { id: 49, text: "Sekolah mendorong ulasan dan testimoni online" },
      { id: 50, text: "Word-of-mouth menjadi pendorong signifikan pendaftaran" },
    ],
  },
  {
    id: "team",
    title: "Marketing Team & Budget",
    icon: "👔",
    questions: [
      { id: 51, text: "Tim marketing sekolah memiliki struktur dan tanggung jawab jelas" },
      { id: 52, text: "Anggaran marketing dialokasikan secara memadai" },
      { id: 53, text: "KPI marketing ditetapkan dan diukur secara berkala" },
      { id: 54, text: "Tim marketing mendapat pelatihan dan pengembangan rutin" },
      { id: 55, text: "Tools dan teknologi marketing digunakan secara efektif" },
      { id: 56, text: "Riset pasar dilakukan secara berkala" },
      { id: 57, text: "Laporan marketing dibuat dan dianalisis secara rutin" },
      { id: 58, text: "Kolaborasi antara tim marketing dan tim akademik baik" },
      { id: 59, text: "ROI dari setiap channel marketing diukur" },
      { id: 60, text: "Rencana marketing tahunan disusun dengan target yang jelas" },
    ],
  },
];

export const ratingLabels: Record<number, string> = {
  1: "Sangat Buruk",
  2: "Buruk",
  3: "Cukup",
  4: "Baik",
  5: "Sangat Baik",
};

export function calculateScores(answers: Record<number, number>) {
  const aspectScores = auditAspects.map((aspect) => {
    const total = aspect.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const max = aspect.questions.length * 5;
    const percentage = Math.round((total / max) * 100);
    const average = parseFloat((total / aspect.questions.length).toFixed(1));
    return { id: aspect.id, title: aspect.title, score: total, max, percentage, average };
  });

  const totalScore = aspectScores.reduce((sum, a) => sum + a.score, 0);
  const totalMax = aspectScores.reduce((sum, a) => sum + a.max, 0);
  const totalPercentage = Math.round((totalScore / totalMax) * 100);
  const totalAverage = parseFloat((totalScore / 60).toFixed(1));

  let level: "Lemah" | "Cukup" | "Kuat";
  if (totalPercentage < 40) level = "Lemah";
  else if (totalPercentage < 70) level = "Cukup";
  else level = "Kuat";

  return { aspectScores, totalScore, totalMax, totalPercentage, totalAverage, level };
}
