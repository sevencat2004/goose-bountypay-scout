import { rankOpportunities, summarizeRanking } from "./scoring.js";
import { buildGrantPackage, grantMarkdown } from "./grant.js";

const sample = [
  {
    title: "Goose Bounty/Grant Scout MCP",
    source: "goose_grant",
    amountUsd: 48000,
    status: "rolling grant",
    comments: 0,
    openPrs: 0,
    notes: "milestone-based grant proposal for a Goose MCP extension"
  },
  {
    title: "Crowded GitHub UI bounty",
    source: "algora",
    amountUsd: 440,
    comments: 25,
    openPrs: 6,
    requiresAssignment: true,
    notes: "many attempts and duplicate PRs already exist"
  },
  {
    title: "AI-prohibited security bounty",
    source: "bugcrowd",
    amountUsd: 5000,
    aiAllowed: false,
    notes: "program rules prohibit AI tools during research"
  }
];

const ranked = rankOpportunities(sample);
console.log(summarizeRanking(ranked));
console.log("");
console.log(JSON.stringify(ranked, null, 2));
console.log("");
console.log(grantMarkdown(buildGrantPackage({ budgetUsd: 48000 })));
console.log("");
console.log("For live GitHub analysis through Goose/MCP, call analyze_github_issue with a public GitHub issue URL.");
