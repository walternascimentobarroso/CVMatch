export async function extractPdfText(file: File) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
  const pageTexts: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const { items } = await page.getTextContent();
    pageTexts.push(
      items
        .map((item) =>
          "str" in item ? item.str + (item.hasEOL ? "\n" : "") : "",
        )
        .join(""),
    );
  }
  return pageTexts.join("\n");
}
