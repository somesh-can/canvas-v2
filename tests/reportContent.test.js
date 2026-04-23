import assert from "node:assert/strict";

import { presentationData } from "../src/data/mockData.js";
import { getReportHero, getReportSections } from "../src/lib/reportContent.js";

const hero = getReportHero(presentationData);
assert.equal(hero.eyebrow, "Collective Discovery report");
assert.doesNotMatch(hero.title, /Canvas Report:/);
assert.equal(hero.title, "Align on our strategic direction for 2026 and beyond");
assert.equal(
  hero.description,
  "This report translates the workshop held on 23.04.2026 into a clear summary of the signals, themes, and priorities that emerged.",
);

const sections = getReportSections();
assert.deepEqual(
  sections.map((section) => section.title),
  [
    "Workshop Setup",
    "Questions Asked",
    "Some Quotes From the Workshop",
    "Six Themes Identified",
    "Prioritized Themes",
    "Keep the Collective Discovery Going",
  ],
);
assert.ok(!sections.some((section) => section.id === "executive-summary"));

assert.equal(
  presentationData.growthLoop.title,
  "Your team has a perspective you haven't heard yet.",
);
assert.equal(
  presentationData.growthLoop.cta,
  "Start your first session for free",
);

console.log("report content tests passed");
