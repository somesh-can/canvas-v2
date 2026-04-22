import { getRankedThemes, getRespondentCount } from "./presentationInsights.js";
import { getReportHero, getReportSections } from "./reportContent.js";

function sanitizePdfText(value) {
  return String(value)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022]/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxChars) {
      currentLine = candidate;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildReportBlocks(data) {
  const reportHero = getReportHero(data);
  const reportSections = Object.fromEntries(
    getReportSections().map((section) => [section.id, section.title]),
  );
  const rankedThemes = getRankedThemes(data);
  const respondentCount = getRespondentCount(data);
  const prioritizedThemes = rankedThemes.slice(0, 4);

  const blocks = [
    { text: reportHero.eyebrow, font: "bold", size: 12, gapAfter: 8 },
    { text: reportHero.title, font: "bold", size: 24, gapAfter: 10 },
    { text: reportHero.description, size: 12, gapAfter: 14 },
    { text: reportSections["goal-metrics"], font: "bold", size: 16, gapAfter: 10 },
    { text: `Goal of the workshop: ${data.goal}`, size: 12, gapAfter: 8 },
    { text: `Respondents: ${respondentCount}`, size: 11, gapAfter: 4 },
    { text: `Themes identified: ${data.themes.length}`, size: 11, gapAfter: 4 },
    { text: `Messages captured: ${data.quotes.length}`, size: 11, gapAfter: 16 },
  ];

  blocks.push({ text: reportSections.questions, font: "bold", size: 16, gapAfter: 10 });
  data.questions.forEach((question, index) => {
    blocks.push({ text: `${index + 1}. ${question.text}`, size: 11, gapAfter: 6 });
  });
  blocks.push({ text: "", size: 11, gapAfter: 10 });

  blocks.push({ text: reportSections["signal-quotes"], font: "bold", size: 16, gapAfter: 10 });
  data.quotes.slice(0, 6).forEach((quote) => {
    blocks.push({ text: `"${quote.text}"`, size: 11, gapAfter: 6 });
  });
  blocks.push({ text: "", size: 11, gapAfter: 10 });

  blocks.push({ text: reportSections["theme-analysis"], font: "bold", size: 16, gapAfter: 10 });
  rankedThemes.forEach((theme, index) => {
    blocks.push({
      text: `Theme ${String(index + 1).padStart(2, "0")}: ${theme.title}`,
      font: "bold",
      size: 12,
      gapAfter: 5,
    });
    blocks.push({
      text: `${theme.count} of ${respondentCount} responses (${theme.percentage}%)`,
      size: 11,
      gapAfter: 5,
    });
    blocks.push({ text: theme.description, size: 11, gapAfter: 5 });
    blocks.push({
      text: `Sub-themes: ${theme.subthemes.join(", ")}`,
      size: 11,
      gapAfter: 5,
    });
    theme.quotes.slice(0, 3).forEach((quote) => {
      blocks.push({ text: `- "${quote.text}"`, size: 10, gapAfter: 4 });
    });
    blocks.push({ text: "", size: 11, gapAfter: 8 });
  });

  blocks.push({ text: reportSections["recommended-actions"], font: "bold", size: 16, gapAfter: 10 });
  prioritizedThemes.forEach((theme) => {
    blocks.push({ text: theme.title, font: "bold", size: 12, gapAfter: 5 });
    blocks.push({
      text: `${theme.count} of ${respondentCount} responses (${theme.percentage}%)`,
      size: 11,
      gapAfter: 4,
    });
    blocks.push({ text: theme.description, size: 11, gapAfter: 8 });
  });

  blocks.push({ text: reportSections["growth-loop"], font: "bold", size: 16, gapAfter: 10 });
  blocks.push({ text: data.growthLoop.title, font: "bold", size: 12, gapAfter: 6 });
  blocks.push({ text: data.growthLoop.body, size: 11, gapAfter: 6 });
  blocks.push({ text: data.growthLoop.cta, size: 11, gapAfter: 12 });

  return blocks;
}

function paginateBlocks(blocks) {
  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 48;
  const topY = 790;
  const bottomY = 56;
  const pages = [[]];
  let currentY = topY;

  blocks.forEach((block) => {
    const lineHeight = Math.max(14, block.size + 3);
    const maxChars = Math.max(38, Math.floor((pageWidth - marginX * 2) / (block.size * 0.5)));
    const lines = block.text ? wrapText(block.text, maxChars) : [""];
    const blockHeight = lines.length * lineHeight + (block.gapAfter ?? 0);

    if (currentY - blockHeight < bottomY) {
      pages.push([]);
      currentY = topY;
    }

    pages[pages.length - 1].push({
      ...block,
      lines,
      y: currentY,
      lineHeight,
    });

    currentY -= blockHeight;
  });

  return pages;
}

function buildPdfBytes(pageStreams) {
  const encoder = new TextEncoder();
  const objects = [];
  const pageObjectNumbers = [];
  const contentObjectNumbers = [];

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = null;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  let nextObjectNumber = 5;
  pageStreams.forEach((stream) => {
    const pageObjectNumber = nextObjectNumber++;
    const contentObjectNumber = nextObjectNumber++;
    pageObjectNumbers.push(pageObjectNumber);
    contentObjectNumbers.push(contentObjectNumber);

    objects[pageObjectNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;
    objects[contentObjectNumber] =
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[2] = `<< /Type /Pages /Kids [${pageObjectNumbers.map((pageNumber) => `${pageNumber} 0 R`).join(" ")}] /Count ${pageObjectNumbers.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = encoder.encode(pdf).length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefStart = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return encoder.encode(pdf);
}

export function buildDetailedReportPdf(data) {
  const pages = paginateBlocks(buildReportBlocks(data));
  const pageStreams = pages.map((blocks, pageIndex) => {
    const commands = [];

    blocks.forEach((block) => {
      const fontRef = block.font === "bold" ? "F2" : "F1";
      block.lines.forEach((line, index) => {
        const y = block.y - index * block.lineHeight;
        commands.push(
          `BT /${fontRef} ${block.size} Tf 48 ${y.toFixed(2)} Td (${sanitizePdfText(line)}) Tj ET`,
        );
      });
    });

    commands.push(
      `BT /F1 9 Tf 48 28 Td (Page ${pageIndex + 1} of ${pages.length}) Tj ET`,
    );

    return commands.join("\n");
  });

  return buildPdfBytes(pageStreams);
}

export function downloadDetailedReportPdf(data) {
  const pdfBytes = buildDetailedReportPdf(data);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "canvas-detailed-insights-report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
