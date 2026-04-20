import assert from "node:assert/strict";

import {
  getActionSummary,
  getExecutiveSummary,
  getResultsSnapshotSummary,
} from "../src/lib/presentationInsights.js";
import { presentationData } from "../src/data/mockData.js";

const executiveSummary = getExecutiveSummary(presentationData);
assert.equal(executiveSummary.topThemes.length, 3);
assert.equal(executiveSummary.topThemes[0].title, "Strategic Clarity");
assert.match(executiveSummary.takeaways[0], /clearer strategic reasoning/i);
assert.match(executiveSummary.recommendation, /strategic narrative/i);

const defaultSnapshot = getResultsSnapshotSummary(presentationData);
assert.equal(defaultSnapshot.title, "Top themes");
assert.equal(defaultSnapshot.topThemes.length, 6);
assert.equal(defaultSnapshot.showTakeaways, false);

const votingSnapshot = getResultsSnapshotSummary(presentationData, {
  isComplete: true,
  participantsCompleted: 42,
  voteCounts: {
    t1: 18,
    t2: 26,
    t3: 11,
    t4: 8,
    t5: 4,
    t6: 2,
  },
});
assert.equal(votingSnapshot.topThemes.length, 3);
assert.equal(votingSnapshot.topThemes[0].title, "Operational Focus");
assert.equal(votingSnapshot.showTakeaways, true);
assert.match(votingSnapshot.takeaways[0], /Operational Focus/);
assert.match(votingSnapshot.takeaways[1], /42 participants/);

const actionSummary = getActionSummary(presentationData);
assert.equal(actionSummary.rows.length, 3);
assert.deepEqual(
  actionSummary.rows.map((row) => row.themeTitle),
  ["Strategic Clarity", "Operational Focus", "Collaborative Culture"],
);
assert.match(actionSummary.rows[1].action, /Reduce active priorities/i);
assert.match(actionSummary.recommendation, /strategic narrative/i);

console.log("presentation insights tests passed");
