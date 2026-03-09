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
    title: "Brand & Positioning",
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
    id: "market",
    title: "Target Pasar & Segmentasi",
    icon: "👥",
    questions: [
      { id: 11, text: "Sekolah memiliki persona target orang tua yang jelas" },
      { id: 12, text: "Area target geografis telah ditentukan dengan baik" },
      { id: 13, text: "Pemahaman tentang demografi dan psikografi orang tua" },
      { id: 14, text: "Riset pasar dilakukan secara berkala" },
      { id: 15, text: "Lanskap persaingan dipahami dengan baik" },
      { id: 16, text: "Sekolah memantau tren populasi dan demografi lokal" },
      { id: 17, text: "Pesan marketing disesuaikan untuk segmen orang tua yang berbeda" },
      { id: 18, text: "Sekolah memahami mengapa orang tua memilih kompetitor" },
      { id: 19, text: "Umpan balik dari calon orang tua dikumpulkan" },
      { id: 20, text: "Sekolah memantau tren dan pola pendaftaran" },
    ],
  },
  {
    id: "product",
    title: "Produk Pendidikan & Proposisi Nilai",
    icon: "📚",
    questions: [
      { id: 21, text: "Keunggulan kurikulum diartikulasikan dengan jelas" },
      { id: 22, text: "Program ekstrakurikuler ditonjolkan dalam marketing" },
      { id: 23, text: "Prestasi dan hasil belajar siswa dikomunikasikan" },
      { id: 24, text: "Metode pengajaran unik ditampilkan" },
      { id: 25, text: "Fasilitas dan infrastruktur digunakan sebagai aset marketing" },
      { id: 26, text: "Kualitas dan kualifikasi guru dipromosikan" },
      { id: 27, text: "Budaya dan nilai sekolah terlihat jelas bagi pengunjung" },
      { id: 28, text: "Integrasi teknologi ditonjolkan" },
      { id: 29, text: "Program kesejahteraan siswa dikomunikasikan" },
      { id: 30, text: "Biaya pendidikan kompetitif dan dijustifikasi dengan baik" },
    ],
  },
  {
    id: "channels",
    title: "Saluran Marketing",
    icon: "📢",
    questions: [
      { id: 31, text: "Website sekolah modern, ramah mobile, dan informatif" },
      { id: 32, text: "Kehadiran media sosial aktif dan menarik" },
      { id: 33, text: "Google Business Profile dioptimalkan dan terbaru" },
      { id: 34, text: "Sekolah menggunakan iklan digital (Google Ads, iklan media sosial)" },
      { id: 35, text: "Strategi content marketing ada (blog, video, newsletter)" },
      { id: 36, text: "Sekolah berpartisipasi dalam pameran dan acara pendidikan" },
      { id: 37, text: "Kemitraan komunitas dan program outreach ada" },
      { id: 38, text: "Email marketing digunakan untuk calon orang tua" },
      { id: 39, text: "WhatsApp atau platform pesan digunakan untuk komunikasi" },
      { id: 40, text: "Sekolah menggunakan marketing tradisional (spanduk, brosur, cetak)" },
    ],
  },
  {
    id: "conversion",
    title: "Konversi & Sistem Pendaftaran",
    icon: "🔄",
    questions: [
      { id: 41, text: "Proses pendaftaran sederhana dan mudah digunakan" },
      { id: 42, text: "Sekolah menawarkan tur kampus atau acara open house" },
      { id: 43, text: "Sistem follow-up untuk pertanyaan calon orang tua" },
      { id: 44, text: "Formulir pendaftaran atau pertanyaan online tersedia" },
      { id: 45, text: "Sekolah melacak tingkat konversi dari pertanyaan ke pendaftaran" },
      { id: 46, text: "Kelas percobaan atau program orientasi ditawarkan" },
      { id: 47, text: "Testimoni dan kisah sukses ditampilkan" },
      { id: 48, text: "Waktu respons terhadap pertanyaan orang tua cepat" },
      { id: 49, text: "Tim pendaftaran terlatih dalam penjualan konsultatif" },
      { id: 50, text: "Informasi beasiswa atau bantuan keuangan mudah diakses" },
    ],
  },
  {
    id: "retention",
    title: "Retensi & Word of Mouth",
    icon: "💬",
    questions: [
      { id: 51, text: "Kepuasan orang tua diukur secara berkala" },
      { id: 52, text: "Program referral ada untuk orang tua saat ini" },
      { id: 53, text: "Sekolah mengkomunikasikan pencapaian dan milestone" },
      { id: 54, text: "Acara komunitas orang tua memperkuat keterlibatan" },
      { id: 55, text: "Jaringan alumni dipelihara dan dimanfaatkan" },
      { id: 56, text: "Sekolah menangani keluhan dan umpan balik secara efektif" },
      { id: 57, text: "Komunikasi dengan orang tua sering dan transparan" },
      { id: 58, text: "Tingkat retensi siswa dipantau secara aktif" },
      { id: 59, text: "Sekolah mendorong ulasan dan testimoni online" },
      { id: 60, text: "Word-of-mouth menjadi pendorong signifikan pendaftaran" },
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
    return { id: aspect.id, title: aspect.title, score: total, max, percentage };
  });

  const totalScore = aspectScores.reduce((sum, a) => sum + a.score, 0);
  const totalMax = aspectScores.reduce((sum, a) => sum + a.max, 0);
  const totalPercentage = Math.round((totalScore / totalMax) * 100);

  let level: "Lemah" | "Cukup" | "Kuat";
  if (totalPercentage < 40) level = "Lemah";
  else if (totalPercentage < 70) level = "Cukup";
  else level = "Kuat";

  return { aspectScores, totalScore, totalMax, totalPercentage, level };
}