import { scoreOpportunity } from "./scoring.js";

export function parseGitHubIssueUrl(url) {
  const parsed = new URL(url);
  if (parsed.hostname !== "github.com") {
    throw new Error("Only github.com issue URLs are supported");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);
  if (parts.length < 4 || parts[2] !== "issues") {
    throw new Error("Expected URL shape: https://github.com/owner/repo/issues/123");
  }

  const number = Number(parts[3]);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error("Issue number must be a positive integer");
  }

  return {
    owner: parts[0],
    repo: parts[1],
    number
  };
}

function githubHeaders() {
  const headers = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "goose-bountypay-scout/0.1.0",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: githubHeaders() });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`GitHub request failed ${response.status}: ${body.slice(0, 200)}`);
  }
  return response.json();
}

function extractAmountUsd(issue) {
  const text = [
    issue.title,
    issue.body || "",
    ...(issue.labels || []).map((label) => label.name || "")
  ].join(" ");

  const matches = [...text.matchAll(/\$[\s]*([0-9][0-9,]*(?:\.[0-9]+)?)/g)];
  if (!matches.length) return undefined;

  const values = matches
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));

  return values.length ? Math.max(...values) : undefined;
}

function inferSource(owner, repo, labels, body) {
  const text = `${owner}/${repo} ${labels.join(" ")} ${body || ""}`.toLowerCase();
  if (text.includes("algora")) return "algora";
  if (text.includes("boss")) return "boss";
  if (owner.toLowerCase() === "expensify") return "expensify";
  if (text.includes("drips")) return "drips";
  return "github";
}

function inferBooleans(issue, labels) {
  const text = `${issue.title} ${issue.body || ""} ${labels.join(" ")}`.toLowerCase();
  const assigned = Array.isArray(issue.assignees) && issue.assignees.length > 0;
  const requiresAssignment = /assigned before|wait.*assign|do not start|must be assigned|claim.*confirm|\/start/.test(text);
  const proposalGate = /proposal|upwork|external|c\+|help wanted/.test(text);
  const aiAllowed = !/no ai|do not use ai|chatgpt|claude|deepseek|gemini|ai tools prohibited|prohibit.*ai/.test(text);
  const requiresUserAccount = /kyc|tax|wallet|upwork|account|identity|payment onboarding/.test(text);

  return { assigned, requiresAssignment, proposalGate, aiAllowed, requiresUserAccount };
}

async function countOpenCompetingPrs(owner, repo, issueNumber) {
  const query = encodeURIComponent(`repo:${owner}/${repo} type:pr is:open "${issueNumber}"`);
  const data = await fetchJson(`https://api.github.com/search/issues?q=${query}&per_page=20`);
  return Number(data.total_count || 0);
}

export async function analyzeGitHubIssue(url) {
  const { owner, repo, number } = parseGitHubIssueUrl(url);
  const issue = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`);

  if (issue.pull_request) {
    throw new Error("URL points to a pull request, not an issue");
  }

  const labels = (issue.labels || []).map((label) => label.name || String(label));
  let openPrs = 0;
  let prSearchError = "";

  try {
    openPrs = await countOpenCompetingPrs(owner, repo, number);
  } catch (error) {
    prSearchError = error.message;
  }

  const opportunity = {
    title: issue.title,
    source: inferSource(owner, repo, labels, issue.body),
    url: issue.html_url,
    amountUsd: extractAmountUsd(issue),
    status: issue.state,
    labels,
    comments: Number(issue.comments || 0),
    openPrs,
    notes: [
      `repo: ${owner}/${repo}`,
      prSearchError ? `open PR search failed: ${prSearchError}` : ""
    ].filter(Boolean).join("; "),
    ...inferBooleans(issue, labels)
  };

  return {
    owner,
    repo,
    number,
    fetchedAt: new Date().toISOString(),
    opportunity,
    recommendation: scoreOpportunity(opportunity)
  };
}
