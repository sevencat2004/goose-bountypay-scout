export function buildGrantPackage(input = {}) {
  const name = input.projectName || "Goose Bounty/Grant Scout MCP";
  const budgetUsd = Number(input.budgetUsd || 48000);
  const timelineMonths = Number(input.timelineMonths || 4);
  const maintainer = input.maintainer || "Caiqian Lai";

  const milestones = [
    {
      name: "M1 - Working MCP extension MVP",
      duration: "2 weeks",
      budgetUsd: Math.round(budgetUsd * 0.2),
      deliverables: [
        "STDIO MCP server exposing opportunity triage tools to Goose",
        "Local deterministic scoring engine for collectability, autonomy, and delivery risk",
        "Demo data pack and self-test suite"
      ]
    },
    {
      name: "M2 - Live-source adapters and report workflow",
      duration: "4 weeks",
      budgetUsd: Math.round(budgetUsd * 0.3),
      deliverables: [
        "GitHub, Algora-style, grant-program, and curated manual-source adapters",
        "Goose-ready daily scout prompt and markdown report output",
        "Failure reporting that avoids inventing results when a source blocks access"
      ]
    },
    {
      name: "M3 - Submission assistant and payment-risk tracker",
      duration: "4 weeks",
      budgetUsd: Math.round(budgetUsd * 0.3),
      deliverables: [
        "Grant/bounty submission package generator",
        "Payout/KYC/account-action checklist for project owners",
        "Follow-up queue for submitted PRs, grants, and unpaid claims"
      ]
    },
    {
      name: "M4 - Documentation, examples, and community handoff",
      duration: "2 weeks",
      budgetUsd: budgetUsd - Math.round(budgetUsd * 0.2) - Math.round(budgetUsd * 0.3) - Math.round(budgetUsd * 0.3),
      deliverables: [
        "Goose extension installation guide",
        "Example Goose sessions for bounty scouting and grant planning",
        "Maintenance plan and issue templates"
      ]
    }
  ];

  return {
    projectName: name,
    maintainer,
    requestedBudgetUsd: budgetUsd,
    timelineMonths,
    summary: `${name} gives Goose users a practical extension for finding, ranking, and preparing developer funding opportunities. It prioritizes whether money can actually be collected, whether Goose can help complete the work independently, and what user-owned payout or account steps remain.`,
    problem: "Developer funding is fragmented across GitHub issues, bounty boards, grants, hackathons, and security programs. A large headline reward often hides assignment gates, duplicate PRs, unclear payout paths, or rules that prohibit AI assistance. Goose users need an agent-native way to triage opportunities before spending engineering time.",
    solution: "Build a Goose MCP extension that gathers opportunity metadata, scores collectability and autonomy, explains risk, generates work plans, and maintains a follow-up queue for submitted work and payout status.",
    whyGoose: "Goose is most valuable when it can coordinate local tools, repositories, browsing, and durable project context. A funding scout extension turns that capability into an economically useful workflow for open-source contributors and small teams.",
    milestones,
    successMetrics: [
      "A Goose user can install and run the MCP extension locally in under 10 minutes",
      "The extension returns ranked opportunities with explicit collectability, autonomy, and risk scores",
      "Reports clearly distinguish pursue-now, monitor, skip, and do-not-pursue decisions",
      "At least three source types are supported by the end of M2",
      "Submitted-work follow-up tracks payout status and user-required actions"
    ],
    userActionsNeeded: [
      "Final grant application submission from the user's account",
      "Any requested identity, tax, KYC, wallet, or payment onboarding",
      "Approval before public claims using the user's identity"
    ]
  };
}

export function grantMarkdown(pkg) {
  const milestoneText = pkg.milestones
    .map((m) => [
      `### ${m.name}`,
      `Duration: ${m.duration}`,
      `Budget: $${m.budgetUsd.toLocaleString("en-US")}`,
      "",
      ...m.deliverables.map((item) => `- ${item}`)
    ].join("\n"))
    .join("\n\n");

  return [
    `# ${pkg.projectName}`,
    "",
    `Maintainer: ${pkg.maintainer}`,
    `Requested budget: $${pkg.requestedBudgetUsd.toLocaleString("en-US")}`,
    `Timeline: ${pkg.timelineMonths} months`,
    "",
    "## Summary",
    pkg.summary,
    "",
    "## Problem",
    pkg.problem,
    "",
    "## Solution",
    pkg.solution,
    "",
    "## Why Goose",
    pkg.whyGoose,
    "",
    "## Milestones",
    milestoneText,
    "",
    "## Success Metrics",
    ...pkg.successMetrics.map((item) => `- ${item}`),
    "",
    "## User-Owned Steps",
    ...pkg.userActionsNeeded.map((item) => `- ${item}`)
  ].join("\n");
}
