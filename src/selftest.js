import assert from "node:assert/strict";
import fs from "node:fs";
import { rankOpportunities, scoreOpportunity } from "./scoring.js";
import { buildGrantPackage, grantMarkdown } from "./grant.js";
import { reportMarkdown } from "./report.js";
import { fromAlgoraLike, fromGrantProgram, normalizeSourceItems, saveScoutReport } from "./adapters.js";

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

const algora = fromAlgoraLike({
  issueTitle: "Crowded bounty",
  bountyUsd: "$440",
  attempts: 6,
  commentCount: 25,
  claimRequiresApproval: true
});
assert.equal(algora.source, "algora");
assert.equal(algora.amountUsd, 440);
assert.equal(algora.openPrs, 6);

const grant = fromGrantProgram({
  projectName: "Goose Scout",
  requestedBudgetUsd: "48000",
  milestoneBased: true,
  rollingReview: true,
  timelineMonths: 4
});
assert.equal(grant.source, "goose_grant");
assert.ok(grant.notes.includes("rolling review"));

const saved = saveScoutReport({
  title: "Selftest Report",
  fileBaseName: "selftest-report",
  outputDir: "reports/selftest",
  algoraLike: [algora],
  grants: [grant]
});
assert.ok(saved.markdownPath.endsWith("selftest-report.md"));
assert.ok(saved.jsonPath.endsWith("selftest-report.json"));

const sampleInput = JSON.parse(fs.readFileSync("examples/opportunities.sample.json", "utf8"));
const sampleItems = normalizeSourceItems(sampleInput);
assert.equal(sampleItems.length, 3);
const sampleReport = reportMarkdown(sampleItems);
assert.ok(sampleReport.markdown.includes("Goose Bounty/Grant Scout MCP"));
assert.equal(sampleReport.ranked[0].decision, "pursue_now");

console.log("selftest passed");
