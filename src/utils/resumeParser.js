// src/utils/resumeParser.js
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

import mammoth from "mammoth";

// Worker setup for PDF.js
GlobalWorkerOptions.workerSrc = pdfjsWorker;


export async function parseResume(file) {
  const buffer = await file.arrayBuffer();
  let text = "";

  if (file.type === "application/pdf") {
    const pdf = await getDocument({ data: buffer }).promise;
const pageTexts = await Promise.all(
  Array.from({ length: pdf.numPages }, (_, i) =>
    pdf.getPage(i + 1).then(page => page.getTextContent())
  )
);

    text = pageTexts
      .map(content => content.items.map(it => it.str).join(" "))
      .join("\n");
  } else if (file.type.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    text = result.value;
  } else {
    text = new TextDecoder().decode(buffer);
  }

  // Use lazy regex, short-circuit evaluation
  const name = (text.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}/) || [null])[0];
  const email = (text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i) || [null])[0];
  const phone = (text.match(/(\+?\d{1,3}[-.\s]?)?\d{10}\b/) || [null])[0];

  return { name, email, phone, rawText: text };
}
