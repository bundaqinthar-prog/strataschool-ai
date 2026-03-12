export interface AuditQuestion {
  id: number;
  text: string;
}

export interface AuditAspect {
  id: string;
  title: string;
  desc: string;
  icon: string;
  questions: AuditQuestion[];
}

export const auditAspects: AuditAspect[] = [
  {
    id: "branding",
    title: "Branding & Positioning",
    desc: "Mengevaluasi seberapa kuat identitas, keunikan, dan pesan utama sekolah Anda di benak masyarakat dibandingkan kompetitor.",
    icon: "🎯",
    questions: [
      { id: 1, text: "Apakah sekolah memiliki keunggulan utama yang jelas dan mudah dijelaskan dalam satu kalimat?" },
      { id: 2, text: "Apakah positioning sekolah berbeda dan relevan dibanding sekolah sekitar?" },
      { id: 3, text: "Apakah pesan utama sekolah konsisten di semua media (brosur, website, sosial media)?" },
      { id: 4, text: "Apakah orang tua dapat memahami nilai sekolah dalam waktu kurang dari 30 detik?" },
      { id: 5, text: "Apakah citra sekolah sesuai dengan target market yang dituju?" },
      { id: 6, text: "Apakah identitas visual (logo, warna, desain) terlihat rapi dan profesional?" },
      { id: 7, text: "Apakah sekolah memiliki cerita / narasi yang membangun kepercayaan?" },
      { id: 8, text: "Apakah branding mendukung harga/biaya pendidikan yang ditawarkan?" },
      { id: 9, text: "Apakah sekolah mengetahui segmen orang tua yang TIDAK cocok dengan sekolah ini?" },
      { id: 10, text: "Apakah seluruh tim mampu menjelaskan positioning sekolah dengan pesan yang sama?" },
    ],
  },
  {
    id: "channel",
    title: "Marketing Channel & Strategi",
    desc: "Mengukur seberapa efektif saluran promosi, konsistensi distribusi konten, dan strategi penyampaian pesan sekolah.",
    icon: "📢",
    questions: [
      { id: 11, text: "Apakah sekolah memiliki channel utama yang benar-benar fokus?" },
      { id: 12, text: "Apakah promosi dilakukan sepanjang tahun, bukan hanya saat PPDB?" },
      { id: 13, text: "Apakah konten menjawab kekhawatiran orang tua, bukan hanya kegiatan internal?" },
      { id: 14, text: "Apakah sekolah mengetahui konten mana yang paling menarik minat?" },
      { id: 15, text: "Apakah media sosial aktif dan konsisten?" },
      { id: 16, text: "Apakah iklan (jika ada) memiliki pesan yang jelas dan terarah?" },
      { id: 17, text: "Apakah sekolah memiliki database calon orang tua yang dimanfaatkan dengan baik?" },
      { id: 18, text: "Apakah pesan marketing mudah dipahami orang awam?" },
      { id: 19, text: "Apakah sekolah mengevaluasi hasil promosi secara berkala?" },
      { id: 20, text: "Apakah setiap periode marketing memiliki tujuan yang jelas?" },
    ],
  },
  {
    id: "funnel",
    title: "PPDB Funnel & Konversi",
    desc: "Mengevaluasi alur perjalanan calon pendaftar mulai dari bertanya hingga resmi mendaftar, serta kecepatan respons tim.",
    icon: "🔄",
    questions: [
      { id: 21, text: "Apakah sekolah memiliki alur PPDB yang jelas dari awal hingga daftar?" },
      { id: 22, text: "Apakah setiap calon orang tua dicatat dan ditindaklanjuti?" },
      { id: 23, text: "Apakah tim PPDB memiliki script komunikasi yang seragam?" },
      { id: 24, text: "Apakah follow-up dilakukan secara teratur dan terjadwal?" },
      { id: 25, text: "Apakah sekolah mengetahui di tahap mana calon murid paling sering hilang?" },
      { id: 26, text: "Apakah respon tim PPDB cepat dan konsisten?" },
      { id: 27, text: "Apakah proses pendaftaran terasa mudah dan tidak membingungkan?" },
      { id: 28, text: "Apakah calon orang tua selalu mendapatkan informasi langkah berikutnya?" },
      { id: 29, text: "Apakah sekolah membangun hubungan sebelum meminta pendaftaran?" },
      { id: 30, text: "Apakah sekolah mengevaluasi hasil PPDB setiap tahun?" },
    ],
  },
  {
    id: "team",
    title: "Tim & Sistem Internal",
    desc: "Menilai kesiapan SDM, kejelasan SOP, koordinasi komunikasi internal, dan sistem pelaporan berbasis data.",
    icon: "👔",
    questions: [
      { id: 31, text: "Apakah tim PPDB memiliki pembagian tugas yang jelas?" },
      { id: 32, text: "Apakah setiap anggota memahami perannya masing-masing?" },
      { id: 33, text: "Apakah ada SOP sederhana untuk PPDB?" },
      { id: 34, text: "Apakah komunikasi tim berjalan rapi dan terkoordinasi?" },
      { id: 35, text: "Apakah tim mendapatkan pembekalan komunikasi?" },
      { id: 36, text: "Apakah sekolah memiliki sistem pencatatan yang rapi?" },
      { id: 37, text: "Apakah laporan PPDB dibuat secara berkala?" },
      { id: 38, text: "Apakah pimpinan menerima laporan yang mudah dipahami?" },
      { id: 39, text: "Apakah keputusan diambil berdasarkan data, bukan perasaan?" },
      { id: 40, text: "Apakah sekolah belajar dari kesalahan tahun sebelumnya?" },
    ],
  },
  {
    id: "value",
    title: "Penawaran & Value",
    desc: "Memastikan program unggulan, biaya, dan nilai tambah pendidikan dapat dipahami serta relevan dengan orang tua masa kini.",
    icon: "💎",
    questions: [
      { id: 41, text: "Apakah penawaran sekolah sesuai dengan kebutuhan orang tua saat ini?" },
      { id: 42, text: "Apakah manfaat lebih ditonjolkan daripada fasilitas?" },
      { id: 43, text: "Apakah biaya terasa masuk akal dibanding value yang diberikan?" },
      { id: 44, text: "Apakah sekolah mampu menjelaskan hasil pendidikan yang dijanjikan?" },
      { id: 45, text: "Apakah program unggulan benar-benar dipahami orang tua?" },
      { id: 46, text: "Apakah sekolah memiliki pembeda selain harga?" },
      { id: 47, text: "Apakah penawaran dikomunikasikan dengan bahasa sederhana?" },
      { id: 48, text: "Apakah orang tua memahami manfaat jangka panjang bagi anaknya?" },
      { id: 49, text: "Apakah penawaran relevan dengan kondisi lingkungan sekitar?" },
      { id: 50, text: "Apakah value sekolah mudah diceritakan ulang oleh orang tua?" },
    ],
  },
  {
    id: "market",
    title: "Market Behaviour Readiness",
    desc: "Melihat tingkat adaptasi sekolah terhadap perilaku komparasi, penundaan keputusan, dan kekhawatiran spesifik calon orang tua.",
    icon: "🧠",
    questions: [
      { id: 51, text: "Apakah sekolah memahami sekolah mana yang paling sering dibandingkan oleh orang tua?" },
      { id: 52, text: "Apakah keunggulan sekolah mudah terlihat saat dibandingkan?" },
      { id: 53, text: "Apakah sekolah memiliki strategi untuk orang tua yang menunda keputusan?" },
      { id: 54, text: "Apakah sekolah tetap hadir selama masa pertimbangan orang tua?" },
      { id: 55, text: "Apakah sekolah memiliki bukti nyata (hasil lulusan/testimoni) yang mudah ditemukan?" },
      { id: 56, text: "Apakah pesan sekolah konsisten di semua titik kontak?" },
      { id: 57, text: "Apakah sekolah mengetahui tahap silent drop-off calon siswa?" },
      { id: 58, text: "Apakah follow-up menyesuaikan fase keraguan orang tua?" },
      { id: 59, text: "Apakah penawaran sekolah menjawab kekhawatiran utama orang tua saat ini?" },
      { id: 60, text: "Apakah sekolah mampu menjelaskan value dalam <30 detik sesuai cara pikir orang tua?" },
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
