import assert from "node:assert/strict";

import { buildDetailedReportPdf } from "../src/lib/reportPdf.js";
import { presentationData } from "../src/data/mockData.js";

const pdfBytes = buildDetailedReportPdf(presentationData);
const pdfText = Buffer.from(pdfBytes).toString("latin1");

assert.ok(pdfBytes instanceof Uint8Array);
assert.match(pdfText, /^%PDF-1\.4/);
assert.match(pdfText, /Interactive Strategy Insights/);
assert.match(pdfText, /Detailed Insights Report/);
assert.match(pdfText, /Strategic Clarity/);

console.log("report pdf tests passed");
