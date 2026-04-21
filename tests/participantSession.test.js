import assert from "node:assert/strict";

import { presentationData } from "../src/data/mockData.js";
import { createParticipantSessionModel } from "../src/lib/participantSession.js";

const participantSession = createParticipantSessionModel(presentationData);

assert.equal(participantSession.sessionId, "2026-sync");
assert.equal(
  participantSession.question,
  presentationData.voting.question,
);
assert.equal(
  participantSession.votesPerPerson,
  presentationData.voting.votesPerPerson,
);
assert.equal(participantSession.themes.length, presentationData.themes.length);
assert.equal(participantSession.themes[0].quotes.length, 3);
assert.deepEqual(
  participantSession.themes[0].subthemes,
  presentationData.themes[0].subthemes,
);

console.log("participant session tests passed");
