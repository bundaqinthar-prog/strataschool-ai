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

// ============== Markdown helpers ==============

const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableSeparator = (line: string) =>
  /^\s*\|?[\s:-]*\|[\s:|-]*$/.test(line) && /-{2,}/.test(line);

const parseTableRow = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => stripInlineMd(c.trim()));

// Strip emojis & symbols that helvetica cannot render (would show as garbage glyphs)
const stripEmoji = (s: string) =>
  s
    // Remove emoji & pictographic ranges
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .replace(/[\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/[\u{FE0F}\u{200D}]/gu, "")
    // Common bullet/arrow symbols not in WinAnsi
    .replace(/[→←↑↓➜➤➔➡⇒⇨►▶◆◇■□●○★☆✓✔✗✘✦✧]/g, "")
    .replace(/[\u{1F100}-\u{1F1FF}]/gu, "")
    // Collapse multiple spaces left behind
    .replace(/[ \t]{2,}/g, " ")
    .trim();

// Remove markdown emphasis but keep characters (used for tables / headings)
const stripInlineMd = (s: string) =>
  stripEmoji(
    s
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .trim()
  );

// Tokenise inline text into bold/italic/normal segments for proper rendering
type InlineToken = { text: string; bold: boolean; italic: boolean };
function tokenizeInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // First strip links and inline code (render as plain)
  const cleaned = input
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1");

  const regex = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(cleaned)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: cleaned.slice(lastIndex, m.index), bold: false, italic: false });
    }
    if (m[2] !== undefined || m[3] !== undefined) {
      tokens.push({ text: m[2] ?? m[3], bold: true, italic: false });
    } else if (m[4] !== undefined || m[5] !== undefined) {
      tokens.push({ text: m[4] ?? m[5], bold: false, italic: true });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < cleaned.length) {
    tokens.push({ text: cleaned.slice(lastIndex), bold: false, italic: false });
  }
  return tokens.length ? tokens : [{ text: cleaned, bold: false, italic: false }];
}

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

// ============== PDF generator ==============

export function generateReportPdf(opts: PdfOptions) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Palette
  const PRIMARY: [number, number, number] = [30, 58, 138]; // deep blue
  const ACCENT: [number, number, number] = [37, 99, 235];
  const TEXT: [number, number, number] = [33, 37, 41];
  const MUTED: [number, number, number] = [100, 116, 139];
  const RULE: [number, number, number] = [226, 232, 240];

  // Typography (pt)
  const BODY_SIZE = 10;
  const BODY_LINE = 5.2; // mm per line at 10pt — generous line-height
  const PARA_GAP = 2.5;
  const H_GAP_BEFORE = 5;
  const H_GAP_AFTER = 2.5;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };
  const checkPage = (needed: number) => {
    if (y + needed > pageHeight - margin - 12) addPage();
  };

  // ===== Cover header =====
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 34, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("SchoolGrowth AI", margin, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Laporan Analisis Profesional", margin, 22);
  // Right side: date
  doc.setFontSize(8.5);
  doc.text(opts.date, pageWidth - margin, 22, { align: "right" });

  y = 46;

  // Title
  doc.setTextColor(...PRIMARY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(opts.featureName, contentWidth);
  titleLines.forEach((tl: string) => {
    doc.text(tl, margin, y);
    y += 8;
  });
  y += 1;

  // Meta block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const metaItems = [
    `Sekolah  :  ${opts.schoolName || "-"}`,
    `Tahun Ajaran  :  ${opts.academicYear || "-"}`,
  ];
  metaItems.forEach((l) => {
    doc.text(l, margin, y);
    y += 5;
  });
  y += 3;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Scores
  if (opts.scores && typeof opts.scores === "object") {
    const so = opts.scores as Record<string, unknown>;
    if (so.totalPercentage !== undefined) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...PRIMARY);
      doc.text("Skor Marketing", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT);
      doc.text(`Skor Total: ${so.totalPercentage}%  •  ${so.level}`, margin, y);
      y += 5.5;
      if (Array.isArray(so.aspectScores)) {
        (so.aspectScores as Array<{ title: string; percentage: number }>).forEach((a) => {
          checkPage(5);
          doc.setTextColor(...MUTED);
          doc.text(`•  ${a.title}: ${a.percentage}%`, margin + 2, y);
          y += 5;
        });
      }
      y += 3;
      doc.setDrawColor(...RULE);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
    }
  }

  // Input summary
  if (opts.inputSummary) {
    checkPage(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PRIMARY);
    doc.text("Ringkasan Input", margin, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    const inputLines = doc.splitTextToSize(opts.inputSummary, contentWidth);
    inputLines.forEach((line: string) => {
      checkPage(4.6);
      doc.text(line, margin, y);
      y += 4.6;
    });
    y += 4;
    doc.setDrawColor(...RULE);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // ===== Inline rendering helpers =====
  const setBodyFont = (bold: boolean, italic: boolean, size = BODY_SIZE) => {
    let style: "normal" | "bold" | "italic" | "bolditalic" = "normal";
    if (bold && italic) style = "bolditalic";
    else if (bold) style = "bold";
    else if (italic) style = "italic";
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };

  /**
   * Render inline tokens with word wrapping, supporting mixed bold/italic.
   * Returns final y after rendering.
   */
  const renderInline = (
    tokens: InlineToken[],
    startX: number,
    maxWidth: number,
    fontSize = BODY_SIZE,
    lineHeight = BODY_LINE,
    color: [number, number, number] = TEXT,
  ) => {
    doc.setTextColor(...color);
    let cursorX = startX;
    const right = startX + maxWidth;

    const drawWord = (word: string, bold: boolean, italic: boolean, trailingSpace: boolean) => {
      setBodyFont(bold, italic, fontSize);
      const w = doc.getTextWidth(word);
      const sp = trailingSpace ? doc.getTextWidth(" ") : 0;
      if (cursorX + w > right + 0.01) {
        // wrap
        y += lineHeight;
        checkPage(lineHeight);
        cursorX = startX;
      }
      doc.text(word, cursorX, y);
      cursorX += w + sp;
    };

    checkPage(lineHeight);
    for (const tok of tokens) {
      // Split token by whitespace, preserve spacing
      const parts = tok.text.split(/(\s+)/);
      for (const part of parts) {
        if (part === "") continue;
        if (/^\s+$/.test(part)) {
          setBodyFont(tok.bold, tok.italic, fontSize);
          cursorX += doc.getTextWidth(" ");
          continue;
        }
        // Word may itself be too long — fall back to splitTextToSize
        setBodyFont(tok.bold, tok.italic, fontSize);
        if (doc.getTextWidth(part) > maxWidth) {
          const wrapped = doc.splitTextToSize(part, maxWidth);
          wrapped.forEach((wl: string, i: number) => {
            if (i > 0 || cursorX > startX + 0.1) {
              y += lineHeight;
              checkPage(lineHeight);
              cursorX = startX;
            }
            doc.text(wl, cursorX, y);
            cursorX += doc.getTextWidth(wl);
          });
        } else {
          drawWord(part, tok.bold, tok.italic, false);
        }
      }
    }
    y += lineHeight;
  };

  // ===== Content blocks =====
  const blocks = blockify(opts.reportContent);

  const renderText = (lines: string[]) => {
    for (let idx = 0; idx < lines.length; idx++) {
      const rawLine = lines[idx];
      const trimmed = rawLine.trim();

      if (trimmed === "") {
        y += PARA_GAP;
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = stripInlineMd(headingMatch[2]);
        const sizes = [0, 15, 13, 11.5, 10.5, 10, 10];
        const size = sizes[level] || 10;
        checkPage(size + 6);
        y += H_GAP_BEFORE;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(size);
        doc.setTextColor(...PRIMARY);
        const wrapped = doc.splitTextToSize(text, contentWidth);
        wrapped.forEach((wl: string) => {
          checkPage(size * 0.45 + 2);
          doc.text(wl, margin, y);
          y += size * 0.5 + 1;
        });
        if (level <= 2) {
          y += 1.5;
          doc.setDrawColor(...(level === 1 ? PRIMARY : RULE));
          doc.setLineWidth(level === 1 ? 0.5 : 0.3);
          doc.line(margin, y, pageWidth - margin, y);
        }
        y += H_GAP_AFTER;
        continue;
      }

      // Horizontal rule
      if (/^([-*_])\1{2,}$/.test(trimmed)) {
        checkPage(6);
        y += 2;
        doc.setDrawColor(...RULE);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;
        continue;
      }

      // Lists (bullet + ordered)
      const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (bulletMatch || orderedMatch) {
        const marker = bulletMatch ? "•" : `${orderedMatch![1]}.`;
        const text = bulletMatch ? bulletMatch[1] : orderedMatch![2];
        const indent = bulletMatch ? 4.5 : 5.5;

        checkPage(BODY_LINE);
        // Draw marker
        doc.setFont("helvetica", "bold");
        doc.setFontSize(BODY_SIZE);
        doc.setTextColor(...ACCENT);
        doc.text(marker, margin, y);

        // Render the text inline (starting at same baseline)
        const tokens = tokenizeInline(text);
        renderInline(tokens, margin + indent, contentWidth - indent, BODY_SIZE, BODY_LINE, TEXT);
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(trimmed)) {
        const text = trimmed.replace(/^>\s?/, "");
        checkPage(BODY_LINE + 2);
        const startY = y - 3;
        doc.setDrawColor(...ACCENT);
        doc.setLineWidth(1.2);
        const beforeY = y;
        const tokens = tokenizeInline(text);
        renderInline(tokens, margin + 4, contentWidth - 4, BODY_SIZE, BODY_LINE, MUTED);
        doc.line(margin, startY, margin, y - 2);
        continue;
      }

      // Regular paragraph (with inline bold/italic)
      const tokens = tokenizeInline(trimmed);
      renderInline(tokens, margin, contentWidth, BODY_SIZE, BODY_LINE, TEXT);
    }
  };

  for (const block of blocks) {
    if (block.type === "text") {
      renderText(block.lines);
    } else {
      checkPage(24);
      y += 1;
      autoTable(doc, {
        head: [block.header],
        body: block.rows,
        startY: y + 1,
        margin: { left: margin, right: margin },
        styles: {
          font: "helvetica",
          fontSize: 8.5,
          cellPadding: 3,
          overflow: "linebreak",
          textColor: TEXT,
          lineColor: RULE,
          lineWidth: 0.15,
          valign: "top",
        },
        headStyles: {
          fillColor: PRIMARY,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
          halign: "left",
          cellPadding: 3.2,
        },
        bodyStyles: {
          minCellHeight: 6,
        },
        alternateRowStyles: { fillColor: [247, 250, 254] },
        tableLineColor: RULE,
        tableLineWidth: 0.1,
      });
      // @ts-ignore
      const lastY = (doc as any).lastAutoTable?.finalY;
      if (typeof lastY === "number") y = lastY + 5;
    }
  }

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Footer rule
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`SchoolGrowth AI  •  ${opts.featureName}`, margin, pageHeight - 7);
    doc.text(`Halaman ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  }

  const fileName = `${opts.featureName.toLowerCase().replace(/\s+/g, "-")}-${(opts.academicYear || "report").replace("/", "-")}.pdf`;
  doc.save(fileName);
}
