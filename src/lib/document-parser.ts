// Client-side document text extraction for Renstra context.
// Supports: PDF, DOCX, TXT/MD/CSV
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - vite worker import
import PdfWorker from "pdfjs-dist/build/pdf.worker.mjs?worker";
import mammoth from "mammoth";

// Configure worker once
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerPort = new PdfWorker();

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
export const MAX_TEXT_PER_FILE = 60_000; // ~60k chars to keep prompt manageable

export interface ParsedDocument {
  fileName: string;
  size: number;
  mimeType: string;
  text: string;
  truncated: boolean;
  pageCount?: number;
}

async function parsePdf(file: File): Promise<{ text: string; pages: number }> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it: any) => ("str" in it ? it.str : ""))
      .join(" ");
    text += `\n\n--- Halaman ${i} ---\n${pageText}`;
    if (text.length > MAX_TEXT_PER_FILE) break;
  }
  return { text, pages: pdf.numPages };
}

async function parseDocx(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return result.value;
}

async function parsePlain(file: File): Promise<string> {
  return await file.text();
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File "${file.name}" melebihi 15MB.`);
  }
  const name = file.name.toLowerCase();
  let text = "";
  let pageCount: number | undefined;

  try {
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      const r = await parsePdf(file);
      text = r.text;
      pageCount = r.pages;
    } else if (name.endsWith(".docx")) {
      text = await parseDocx(file);
    } else if (
      name.endsWith(".txt") ||
      name.endsWith(".md") ||
      name.endsWith(".csv") ||
      file.type.startsWith("text/")
    ) {
      text = await parsePlain(file);
    } else {
      throw new Error(`Format tidak didukung: ${file.name}. Gunakan PDF, DOCX, TXT, MD, atau CSV.`);
    }
  } catch (e: any) {
    throw new Error(e?.message || `Gagal membaca ${file.name}`);
  }

  const cleaned = text.replace(/\s+\n/g, "\n").trim();
  const truncated = cleaned.length > MAX_TEXT_PER_FILE;
  return {
    fileName: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    text: truncated ? cleaned.slice(0, MAX_TEXT_PER_FILE) : cleaned,
    truncated,
    pageCount,
  };
}
