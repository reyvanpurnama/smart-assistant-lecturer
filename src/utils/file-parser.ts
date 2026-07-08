import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

export async function parseDocument(buffer: Buffer, originalName: string): Promise<string> {
  const ext = originalName.toLowerCase().split(".").pop();

  if (ext === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text || "";
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
