import { extractPdfText } from "@/lib/extract-pdf-text";

const MAX_FILE_SIZE_MB = 5;
const MIN_TEXT_LENGTH = 200;

export type CvFileReading = { text: string } | { error: string };

export async function readCvFile(file: File): Promise<CvFileReading> {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Só são aceites ficheiros PDF." };
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      error: `O ficheiro excede o limite de ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  let text: string;
  try {
    text = (await extractPdfText(file)).trim();
  } catch {
    return { error: "Não foi possível ler o PDF." };
  }

  if (text.length < MIN_TEXT_LENGTH) {
    return {
      error:
        "Formato não suportado: o PDF parece ser um CV digitalizado, sem texto que se possa extrair.",
    };
  }
  return { text };
}
