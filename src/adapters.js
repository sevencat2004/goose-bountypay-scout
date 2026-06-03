import fs from "node:fs";
import path from "node:path";
import { reportMarkdown } from "./report.js";
import { rankOpportunities } from "./scoring.js";

function numberOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const number = Number(String(value).replace(/[$,]/g, ""));
  return Number.isFinite(number) ? number : undefined;
}

function bool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "yes", "1"].includes(value.toLowerCase());
  return Boolean(value);
}

export function fromAlgoraLike(input = {}) {
  const amountUsd = numberOrUndefined(input.amountUsd ?? input.amount ?? input.bountyUsd ?? input.rewardUsd);
  const comments = numberOrUndefined(input.comments ?? input.commentCount) ?? 0;
  const openPrs = numberOrUndefined(input.openPrs ?? input.prCount ?? input.attempts ?? input.claims) ?? 0;
  const status = input.status || (input.open === false ? "closed" : "open");
  const notes = [
    input.notes,
    input.claimUrl ? `claim: ${input.claimUrl}` : "",
    input.assignee ? `assignee: ${input.assignee}` : "",
    input.repo ? `repo: ${input.repo}` : ""
  ].filter(Boolean).join("; ");

  return {
    title: input.title || input.issueTitle || input.name || "Algora-style opportunity",
    source: input.source || "algora",
    url: input.url || input.issueUrl || "",
    amountUsd,
    status,
    labels: Array.isArray(input.labels) ? input.labels : ["bounty"],
    comments,
    openPrs,
    assigned: bool(input.assigned || input.assignee),
    requiresAssignment: bool(input.requiresAssignment || input.claimRequiresApproval),
    proposalGate: bool(input.proposalGate),
    aiAllowed: input.aiAllowed === undefined ? true : bool(input.aiAllowed),
    requiresUserAccount: bool(input.requiresUserAccount || input.claimUrl),
    notes
  };
}

export function fromGrantProgram(input = {}) {
  const amountUsd = numberOrUndefined(input.amountUsd ?? input.requestedBudgetUsd ?? input.maxGrantUsd);
  const status = input.status || "grant";
  const timeline = input.timelineMonths ? `${input.timelineMonths} month timeline` : "";
  const notes = [
    input.notes,
    input.milestoneBased ? "milestone-based" : "",
    input.rollingReview ? "rolling review" : "",
    timeline,
    input.requiresKyc ? "KYC/payment onboarding may be required" : ""
  ].filter(Boolean).join("; ");

  return {
    title: input.title || input.projectName || "Grant opportunity",
    source: input.source || "goose_grant",
    url: input.url || "",
    amountUsd,
    status,
    labels: Array.isArray(input.labels) ? input.labels : ["grant"],
    comments: 0,
    openPrs: 0,
    assigned: false,
    requiresAssignment: false,
    proposalGate: true,
    aiAllowed: input.aiAllowed === undefined ? true : bool(input.aiAllowed),
    requiresUserAccount: true,
    notes
  };
}

export function normalizeSourceItems(input = {}) {
  const algora = (input.algoraLike || []).map(fromAlgoraLike);
  const grants = (input.grants || []).map(fromGrantProgram);
  const opportunities = input.opportunities || [];
  return [...opportunities, ...algora, ...grants];
}

export function saveScoutReport(input = {}) {
  const opportunities = normalizeSourceItems(input);
  const report = reportMarkdown(opportunities, { title: input.title });
  const outputDir = path.resolve(input.outputDir || "reports");
  fs.mkdirSync(outputDir, { recursive: true });

  const stamp = report.generatedAt.replace(/[:.]/g, "-");
  const baseName = (input.fileBaseName || `scout-${stamp}`).replace(/[^a-zA-Z0-9._-]/g, "-");
  const mdPath = path.join(outputDir, `${baseName}.md`);
  const jsonPath = path.join(outputDir, `${baseName}.json`);

  fs.writeFileSync(mdPath, report.markdown, "utf8");
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: report.generatedAt, ranked: rankOpportunities(opportunities) }, null, 2), "utf8");

  return {
    generatedAt: report.generatedAt,
    markdownPath: mdPath,
    jsonPath,
    count: opportunities.length,
    top: report.ranked[0] || null
  };
}
