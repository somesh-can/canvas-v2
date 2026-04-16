import assert from "node:assert/strict";

import {
  getActionSummary,
  getExecutiveSummary,
} from "../src/lib/presentationInsights.js";
import { presentationData } from "../src/data/mockData.js";

const executiveSummary = getExecutiveSummary(presentationData);
assert.equal(executiveSummary.topThemes.length, 3);
assert.equal(executiveSummary.topThemes[0].title, "Strategic Clarity");
assert.match(executiveSummary.headline, /most of the signal/i);
assert.match(executiveSummary.takeaways[0], /clearer strategic reasoning/i);
assert.match(executiveSummary.recommendation, /Start with Strategic Clarity/i);

const actionSummary = getActionSummary(presentationData);
assert.equal(actionSummary.rows.length, 3);
assert.deepEqual(
  actionSummary.rows.map((row) => row.themeTitle),
  ["Strategic Clarity", "Operational Focus", "Collaborative Culture"],
);
assert.match(actionSummary.rows[1].action, /Reduce active priorities/i);
assert.match(actionSummary.recommendation, /strategic narrative/i);

console.log("presentation insights tests passed");
