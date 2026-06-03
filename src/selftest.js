import assert from "node:assert/strict";
import { rankOpportunities, scoreOpportunity } from "./scoring.js";
import { buildGrantPackage, grantMarkdown } from "./grant.js";
import { reportMarkdown } from "./report.js";

const goose = scoreOpportunity({
  title: "Goose Bounty/Grant Scout MCP",
  source: "goose_grant",
  amountUsd: 48000,
  notes: "rolling review milestone grant"
});

assert.equal(goose.decision, "pursue_now");
assert.ok(goose.score >= 72, `expected strong Goose grant score, got ${goose.score}`);

const prohibited = scoreOpportunity({
  title: "Security bounty with AI ban",
  source: "bugcrowd",
  amountUsd: 5000,
  aiAllowed: false
});

assert.equal(prohibited.decision, "do_not_pursue");
assert.ok(prohibited.autonomy <= 10, "AI-prohibited work should have very low autonomy");

const ranked = rankOpportunities([
  { title: "Crowded PR bounty", source: "algora", amountUsd: 500, openPrs: 8, comments: 40 },
  { title: "Clean grant project", source: "goose_grant", amountUsd: 48000, notes: "grant milestone" }
]);

assert.equal(ranked[0].title, "Clean grant project");

const pkg = buildGrantPackage({ budgetUsd: 48000, maintainer: "Caiqian Lai" });
const md = grantMarkdown(pkg);
assert.ok(md.includes("Goose Bounty/Grant Scout MCP"));
assert.ok(md.includes("M1 - Working MCP extension MVP"));
assert.equal(pkg.milestones.reduce((sum, m) => sum + m.budgetUsd, 0), 48000);

const report = reportMarkdown([
  { title: "Clean grant project", source: "goose_grant", amountUsd: 48000, notes: "grant milestone" }
]);
assert.ok(report.markdown.includes("Top recommendation"));
assert.ok(report.markdown.includes("User-Owned Actions"));

console.log("selftest passed");
