export const KNOWN_SOURCES = [
  "github",
  "algora",
  "boss",
  "drips",
  "expensify",
  "stellar_scf",
  "goose_grant",
  "code4rena",
  "bugcrowd"
];

const SOURCE_BASE = {
  github: { collectability: 35, autonomy: 65, risk: 55 },
  algora: { collectability: 76, autonomy: 72, risk: 38 },
  boss: { collectability: 58, autonomy: 70, risk: 45 },
  drips: { collectability: 42, autonomy: 50, risk: 62 },
  expensify: { collectability: 62, autonomy: 35, risk: 64 },
  stellar_scf: { collectability: 76, autonomy: 80, risk: 40 },
  goose_grant: { collectability: 82, autonomy: 86, risk: 34 },
  code4rena: { collectability: 66, autonomy: 38, risk: 78 },
  bugcrowd: { collectability: 30, autonomy: 10, risk: 95 }
};

const DEFAULT_BASE = { collectability: 40, autonomy: 50, risk: 60 };

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function textOf(value) {
  return String(value ?? "").toLowerCase();
}

function amountBonus(amountUsd) {
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) return -8;
  if (amountUsd < 50) return -12;
  if (amountUsd < 200) return -4;
  if (amountUsd <= 2000) return 8;
  if (amountUsd <= 30000) return 5;
  return -2;
}

function hasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function normalizeOpportunity(input) {
  const source = textOf(input.source || "github").replace(/[^a-z0-9_]/g, "_");
  const amountUsd = input.amountUsd === undefined ? undefined : Number(input.amountUsd);
  return {
    title: String(input.title || "Untitled opportunity"),
    source: KNOWN_SOURCES.includes(source) ? source : "github",
    url: String(input.url || ""),
    amountUsd: Number.isFinite(amountUsd) ? amountUsd : undefined,
    status: String(input.status || "unknown"),
    labels: Array.isArray(input.labels) ? input.labels.map(String) : [],
    comments: Number.isFinite(Number(input.comments)) ? Number(input.comments) : 0,
    openPrs: Number.isFinite(Number(input.openPrs)) ? Number(input.openPrs) : 0,
    assigned: Boolean(input.assigned),
    requiresAssignment: Boolean(input.requiresAssignment),
    proposalGate: Boolean(input.proposalGate),
    aiAllowed: input.aiAllowed !== false,
    requiresUserAccount: Boolean(input.requiresUserAccount),
    notes: String(input.notes || "")
  };
}

export function scoreOpportunity(raw) {
  const item = normalizeOpportunity(raw);
  const base = SOURCE_BASE[item.source] || DEFAULT_BASE;
  const text = `${item.title} ${item.labels.join(" ")} ${item.notes} ${item.status}`.toLowerCase();
  const grantLike = item.source.includes("grant") || item.labels.some((label) => textOf(label).includes("grant"));

  let collectability = base.collectability + amountBonus(item.amountUsd);
  let autonomy = base.autonomy;
  let risk = base.risk;
  const reasons = [];

  if (item.aiAllowed === false) {
    collectability -= 35;
    autonomy -= 65;
    risk += 40;
    reasons.push("rules prohibit AI-assisted work");
  }

  if (item.assigned) {
    collectability -= 30;
    autonomy -= 20;
    risk += 25;
    reasons.push("already assigned");
  }

  if (item.requiresAssignment) {
    collectability -= 14;
    autonomy -= 18;
    risk += 16;
    reasons.push("requires assignment before work");
  }

  if (item.proposalGate) {
    if (grantLike) {
      collectability -= 3;
      autonomy -= 4;
      risk += 4;
      reasons.push("grant proposal review required");
    } else {
      collectability -= 10;
      autonomy -= 22;
      risk += 18;
      reasons.push("proposal or reviewer gate before PR");
    }
  }

  if (item.openPrs > 0) {
    const penalty = Math.min(38, item.openPrs * 7);
    collectability -= penalty;
    autonomy -= Math.min(20, item.openPrs * 3);
    risk += Math.min(36, item.openPrs * 7);
    reasons.push(`${item.openPrs} open competing PR(s)`);
  }

  if (item.comments > 12) {
    collectability -= Math.min(30, Math.floor(item.comments / 4));
    risk += Math.min(30, Math.floor(item.comments / 3));
    reasons.push("crowded comment history");
  }

  if (hasAny(text, ["grant", "milestone", "proposal", "rolling review"])) {
    collectability += 7;
    autonomy += 5;
    risk += 5;
    reasons.push("milestone or proposal-based project path");
  }

  if (hasAny(text, ["duplicate", "many attempts", "spam", "crowded", "already has pr"])) {
    collectability -= 18;
    risk += 18;
    reasons.push("visible duplicate-work risk");
  }

  if (hasAny(text, ["kyc", "tax", "wallet", "account", "upwork"])) {
    collectability -= grantLike ? 2 : 4;
    risk += grantLike ? 3 : 8;
    reasons.push("user-side payout or account step likely");
  }

  if (item.requiresUserAccount) {
    autonomy -= grantLike ? 6 : 15;
    risk += grantLike ? 3 : 10;
    reasons.push("requires user-owned account action");
  }

  const finalCollectability = clamp(collectability);
  const finalAutonomy = clamp(autonomy);
  const finalRisk = clamp(risk);
  const score = clamp(finalCollectability * 0.45 + finalAutonomy * 0.35 + (100 - finalRisk) * 0.2);

  let decision = "skip";
  if (item.aiAllowed === false) decision = "do_not_pursue";
  else if (score >= 72 && finalRisk <= 55) decision = "pursue_now";
  else if (score >= 58) decision = "monitor_or_prepare";

  return {
    ...item,
    score,
    decision,
    collectability: finalCollectability,
    autonomy: finalAutonomy,
    risk: finalRisk,
    reasons
  };
}

export function rankOpportunities(opportunities) {
  return opportunities
    .map(scoreOpportunity)
    .sort((a, b) => b.score - a.score || a.risk - b.risk);
}

export function summarizeRanking(ranked) {
  const top = ranked[0];
  if (!top) return "No opportunities were provided.";
  return [
    `Top candidate: ${top.title}`,
    `Decision: ${top.decision}`,
    `Score: ${top.score}/100`,
    `Collectability/autonomy/risk: ${top.collectability}/${top.autonomy}/${top.risk}`,
    top.reasons.length ? `Main factors: ${top.reasons.join("; ")}` : "Main factors: clean initial signal"
  ].join("\n");
}
