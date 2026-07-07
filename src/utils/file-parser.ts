import mammoth from "mammoth";

export async function parseDocument(buffer: Buffer, originalName: string): Promise<string> {
  const ext = originalName.toLowerCase().split(".").pop();

  if (ext === "pdf") {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } 
  
  if (ext === "docx" || ext === "doc") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  if (ext === "txt") {
    return buffer.toString("utf-8");
  }

  throw new Error(`Ekstensi berkas '.${ext}' tidak didukung untuk ekstraksi teks.`);
}
