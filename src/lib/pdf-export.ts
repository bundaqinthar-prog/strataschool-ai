import jsPDF from "jspdf";

interface PdfOptions {
  schoolName: string;
  featureName: string;
  academicYear: string;
  date: string;
  inputSummary?: string;
  reportContent: string;
  scores?: Record<string, unknown> | null;
}

export function generateReportPdf(opts: PdfOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPage = () => { doc.addPage(); y = margin; };
  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage();
  };

  // Header bar
  doc.setFillColor(30, 58, 138); // primary blue
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SchoolGrowth AI", margin, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan Analisis Profesional", margin, 23);
  y = 45;

  // Meta info
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(opts.featureName, margin, y);
  y += 8;

  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const metaLines = [
    `Sekolah: ${opts.schoolName}`,
    `Tahun Ajaran: ${opts.academicYear}`,
    `Tanggal: ${opts.date}`,
  ];
  metaLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 5;
  });
  y += 3;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Scores section if available
  if (opts.scores && typeof opts.scores === "object") {
    const scoreObj = opts.scores as Record<string, unknown>;
    if (scoreObj.totalPercentage !== undefined) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text("Skor Marketing", margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`Skor Total: ${scoreObj.totalPercentage}% (${scoreObj.level})`, margin, y);
      y += 5;

      if (Array.isArray(scoreObj.aspectScores)) {
        (scoreObj.aspectScores as Array<{ title: string; percentage: number }>).forEach((a) => {
          checkPage(5);
          doc.text(`  • ${a.title}: ${a.percentage}%`, margin, y);
          y += 5;
        });
      }
      y += 5;
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }
  }

  // Input summary
  if (opts.inputSummary) {
    checkPage(15);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("Ringkasan Input", margin, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const inputLines = doc.splitTextToSize(opts.inputSummary, contentWidth);
    inputLines.forEach((line: string) => {
      checkPage(5);
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // Report content
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);

  const lines = opts.reportContent.split("\n");
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    // Handle markdown headers
    if (trimmed.startsWith("### ")) {
      checkPage(10);
      y += 3;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text(trimmed.replace(/^###\s*/, "").replace(/\*\*/g, ""), margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
    } else if (trimmed.startsWith("## ")) {
      checkPage(12);
      y += 4;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text(trimmed.replace(/^##\s*/, "").replace(/\*\*/g, ""), margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
    } else if (trimmed.startsWith("# ")) {
      checkPage(14);
      y += 5;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text(trimmed.replace(/^#\s*/, "").replace(/\*\*/g, ""), margin, y);
      y += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
    } else if (trimmed === "") {
      y += 3;
    } else {
      // Bold detection
      const cleanLine = trimmed.replace(/\*\*/g, "");
      const isBold = trimmed.startsWith("**") && trimmed.endsWith("**");
      if (isBold) doc.setFont("helvetica", "bold");

      const wrapped = doc.splitTextToSize(cleanLine, contentWidth);
      wrapped.forEach((wl: string) => {
        checkPage(5);
        doc.text(wl, margin, y);
        y += 4.5;
      });

      if (isBold) doc.setFont("helvetica", "normal");
    }
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `SchoolGrowth AI — ${opts.featureName} — Halaman ${i}/${totalPages}`,
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  const fileName = `${opts.featureName.toLowerCase().replace(/\s+/g, "-")}-${opts.academicYear.replace("/", "-")}.pdf`;
  doc.save(fileName);
}
