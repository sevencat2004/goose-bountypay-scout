import { rankOpportunities } from "./scoring.js";

export function reportMarkdown(opportunities, options = {}) {
  const title = options.title || "Goose Bounty/Grant Scout Report";
  const ranked = rankOpportunities(opportunities);
  const generatedAt = options.generatedAt || new Date().toISOString();

  const lines = [
    `# ${title}`,
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Summary",
    "",
    ranked.length
      ? `Top recommendation: **${ranked[0].title}** (${ranked[0].decision}, score ${ranked[0].score}/100).`
      : "No opportunities were provided.",
    "",
    "## Ranked Opportunities",
    ""
  ];

  ranked.forEach((item, index) => {
    lines.push(`### ${index + 1}. ${item.title}`);
    lines.push("");
    lines.push(`- Decision: ${item.decision}`);
    lines.push(`- Score: ${item.score}/100`);
    lines.push(`- Collectability: ${item.collectability}/100`);
    lines.push(`- Autonomy: ${item.autonomy}/100`);
    lines.push(`- Risk: ${item.risk}/100`);
    lines.push(`- Source: ${item.source}`);
    if (item.amountUsd !== undefined) lines.push(`- Amount: $${item.amountUsd.toLocaleString("en-US")}`);
    if (item.url) lines.push(`- URL: ${item.url}`);
    if (item.reasons.length) lines.push(`- Main factors: ${item.reasons.join("; ")}`);
    lines.push("");
  });

  lines.push("## User-Owned Actions");
  lines.push("");
  lines.push("- Submit applications or public claims from the user's own account.");
  lines.push("- Complete identity, KYC, tax, wallet, or payout onboarding only on official sites.");
  lines.push("- Do not share private keys, seed phrases, tax IDs, full bank details, or one-time codes with the tool.");

  return {
    generatedAt,
    ranked,
    markdown: lines.join("\n")
  };
}
