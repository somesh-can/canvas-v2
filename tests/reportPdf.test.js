import assert from "node:assert/strict";

import { buildDetailedReportPdf } from "../src/lib/reportPdf.js";
import { presentationData } from "../src/data/mockData.js";

const pdfBytes = buildDetailedReportPdf(presentationData);
const pdfText = Buffer.from(pdfBytes).toString("latin1");

assert.ok(pdfBytes instanceof Uint8Array);
assert.match(pdfText, /^%PDF-1\.4/);
assert.match(pdfText, /Collective Discovery report/);
assert.doesNotMatch(pdfText, /Canvas Report:/);
assert.doesNotMatch(pdfText, /What the Canvas Is Telling Us/);
assert.doesNotMatch(pdfText, /Messages on canvas/i);
assert.match(pdfText, /Align on our strategic direction for 2026 and beyond/i);
assert.match(pdfText, /Workshop Setup/);
assert.match(pdfText, /Some Quotes From the Workshop/);
assert.match(pdfText, /Six Themes Identified/);
assert.match(pdfText, /Prioritized Themes/);
assert.match(pdfText, /Keep the Collective Discovery Going/);
assert.match(pdfText, /Strategic Clarity/);
assert.match(pdfText, /Your team has a perspective you haven't heard yet/i);
assert.match(pdfText, /Start your first session for free/i);

console.log("report pdf tests passed");
