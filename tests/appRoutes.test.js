import assert from "node:assert/strict";

import {
  getParticipantPath,
  getPathForRoute,
  getSessionIdFromPresentationData,
  parseAppRoute,
} from "../src/lib/appRoutes.js";
import { presentationData } from "../src/data/mockData.js";

assert.equal(getSessionIdFromPresentationData(presentationData), "2026-sync");
assert.equal(getParticipantPath("session 1"), "/join/session%201");

assert.deepEqual(parseAppRoute("/canvas"), { kind: "canvas" });
assert.deepEqual(parseAppRoute("/report"), { kind: "report" });
assert.deepEqual(parseAppRoute("/join/2026-sync"), {
  kind: "participant",
  sessionId: "2026-sync",
});
assert.deepEqual(parseAppRoute("/"), { kind: "canvas" });

assert.equal(getPathForRoute({ kind: "canvas" }), "/canvas");
assert.equal(getPathForRoute({ kind: "report" }), "/report");
assert.equal(
  getPathForRoute({ kind: "participant", sessionId: "2026-sync" }),
  "/join/2026-sync",
);

console.log("app routes tests passed");
