import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfOptions {
  schoolName: string;
  featureName: string;
  academicYear: string;
  date: string;
  inputSummary?: string;
  reportContent: string;
  scores?: Record<string, unknown> | null;
}

// Strip markdown inline formatting for plain-text PDF rendering
const stripInline = (s: string) =>
  s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s+/, "")
    .trim();

// Detect markdown table rows: | col1 | col2 |
const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableSeparator = (line: string) => /^\s*\|?[\s:-]*\|[\s:|-]*$/.test(line) && /-{2,}/.test(line);

const parseTableRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => stripInline(c.trim()));

interface TableBlock {
  type: "table";
  header: string[];
  rows: string[][];
}
interface TextBlock {
  type: "text";
  lines: string[];
}
type Block = TableBlock | TextBlock;

function blockify(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let buf: string[] = [];

  const flushText = () => {
    if (buf.length) {
      blocks.push({ type: "text", lines: buf });
      buf = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect table: header row + separator + body
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushText();
      const header = parseTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      i--;
      blocks.push({ type: "table", header, rows });
    } else {
      buf.push(line);
    }
  }
  flushText();
  return blocks;
}

export function generateReportPdf(opts: PdfOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const PRIMARY: [number, number, number] = [30, 58, 138];
  const TEXT: [number, number, number] = [40, 40, 40];
  const MUTED: [number, number, number] = [90, 90, 90];

  const addPage = () => {
    doc.addPage();
    y = margin;
  };
  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin - 10) addPage();
  };

  // Cover header bar
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SchoolGrowth AI", margin, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Laporan Analisis Profesional", margin, 21);
  y = 40;

  // Title
  doc.setTextColor(...PRIMARY);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(opts.featureName, contentWidth);
  titleLines.forEach((tl: string) => {
    doc.text(tl, margin, y);
    y += 7;
  });
  y += 2;

  // Meta
  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  [`Sekolah: ${opts.schoolName || "-"}`, `Tahun Ajaran: ${opts.academicYear}`, `Tanggal: ${opts.date}`].forEach((l) => {
    doc.text(l, margin, y);
    y += 5;
  });
  y += 2;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Scores
  if (opts.scores && typeof opts.scores === "object") {
    const so = opts.scores as Record<string, unknown>;
    if (so.totalPercentage !== undefined) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PRIMARY);
      doc.text("Skor Marketing", margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT);
      doc.text(`Skor Total: ${so.totalPercentage}% (${so.level})`, margin, y);
      y += 5;
      if (Array.isArray(so.aspectScores)) {
        (so.aspectScores as Array<{ title: string; percentage: number }>).forEach((a) => {
          checkPage(5);
          doc.text(`  • ${a.title}: ${a.percentage}%`, margin, y);
          y += 5;
        });
      }
      y += 3;
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    }
  }

  // Input summary
  if (opts.inputSummary) {
    checkPage(15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text("Ringkasan Input", margin, y);
    y += 5;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    const inputLines = doc.splitTextToSize(opts.inputSummary, contentWidth);
    inputLines.forEach((line: string) => {
      checkPage(4.5);
      doc.text(line, margin, y);
      y += 4.2;
    });
    y += 3;
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  }

  // ===== Content blocks =====
  const blocks = blockify(opts.reportContent);

  const renderText = (lines: string[]) => {
    for (const rawLine of lines) {
      const trimmed = rawLine.trim();

      if (trimmed === "") {
        y += 3;
        continue;
      }

      // Markdown headings
      if (/^#{1,6}\s/.test(trimmed)) {
        const level = (trimmed.match(/^#+/) || [""])[0].length;
        const text = stripInline(trimmed.replace(/^#+\s*/, ""));
        const sizes = [0, 14, 12, 11, 10.5, 10, 10];
        const size = sizes[level] || 10;
        checkPage(size + 4);
        y += level <= 2 ? 4 : 2;
        doc.setFontSize(size);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...PRIMARY);
        const wrapped = doc.splitTextToSize(text, contentWidth);
        wrapped.forEach((wl: string) => {
          checkPage(size * 0.5 + 2);
          doc.text(wl, margin, y);
          y += size * 0.55;
        });
        if (level === 1) {
          y += 1;
          doc.setDrawColor(30, 58, 138);
          doc.setLineWidth(0.5);
          doc.line(margin, y, pageWidth - margin, y);
          doc.setLineWidth(0.2);
        }
        y += 3;
        continue;
      }

      // Horizontal rule
      if (/^([-*_])\1{2,}$/.test(trimmed)) {
        checkPage(6);
        y += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
        continue;
      }

      // Bullet list
      const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (bulletMatch || orderedMatch) {
        const bullet = bulletMatch ? "•" : `${orderedMatch![1]}.`;
        const text = stripInline(bulletMatch ? bulletMatch[1] : orderedMatch![2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT);
        const indent = 5;
        const wrapped = doc.splitTextToSize(text, contentWidth - indent - 2);
        wrapped.forEach((wl: string, idx: number) => {
          checkPage(5);
          if (idx === 0) doc.text(bullet, margin, y);
          doc.text(wl, margin + indent, y);
          y += 4.5;
        });
        continue;
      }

      // Bold whole line
      const isBold = /^\*\*(.+)\*\*$/.test(trimmed);
      const text = stripInline(trimmed);
      doc.setFontSize(9);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(...TEXT);
      const wrapped = doc.splitTextToSize(text, contentWidth);
      wrapped.forEach((wl: string) => {
        checkPage(5);
        doc.text(wl, margin, y);
        y += 4.5;
      });
    }
  };

  for (const block of blocks) {
    if (block.type === "text") {
      renderText(block.lines);
    } else {
      // Render table via autoTable
      checkPage(20);
      autoTable(doc, {
        head: [block.header],
        body: block.rows,
        startY: y + 2,
        margin: { left: margin, right: margin },
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2.5,
          overflow: "linebreak",
          textColor: TEXT,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          valign: "top",
        },
        headStyles: {
          fillColor: PRIMARY,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5,
          halign: "left",
        },
        alternateRowStyles: { fillColor: [245, 247, 252] },
        didDrawPage: () => {
          // ensure y is reset for new pages drawn by autoTable
        },
      });
      // @ts-ignore – jspdf-autotable adds lastAutoTable
      const lastY = (doc as any).lastAutoTable?.finalY;
      if (typeof lastY === "number") y = lastY + 4;
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `SchoolGrowth AI — ${opts.featureName} — Halaman ${i}/${totalPages}`,
      margin,
      pageHeight - 8,
    );
  }

  const fileName = `${opts.featureName.toLowerCase().replace(/\s+/g, "-")}-${opts.academicYear.replace("/", "-")}.pdf`;
  doc.save(fileName);
}
