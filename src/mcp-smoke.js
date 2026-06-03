import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["src/server.js"]
});

const client = new Client({
  name: "goose-bountypay-scout-smoke",
  version: "0.1.0"
});

try {
  await client.connect(transport);

  const tools = await client.listTools();
  const names = tools.tools.map((tool) => tool.name).sort();
  assert.deepEqual(names, [
    "analyze_github_issue",
    "draft_grant_package",
    "generate_scout_report",
    "normalize_algora_like",
    "normalize_grant_program",
    "rank_opportunities",
    "save_scout_report",
    "score_opportunity",
    "search_github_opportunities"
  ]);

  const ranked = await client.callTool({
    name: "rank_opportunities",
    arguments: {
      opportunities: [
        {
          title: "Goose Bounty/Grant Scout MCP",
          source: "goose_grant",
          amountUsd: 48000,
          notes: "rolling review milestone grant"
        },
        {
          title: "AI-prohibited bounty",
          source: "bugcrowd",
          amountUsd: 5000,
          aiAllowed: false
        }
      ]
    }
  });

  assert.ok(ranked.content[0].text.includes("Top candidate: Goose Bounty/Grant Scout MCP"));

  const grant = await client.callTool({
    name: "draft_grant_package",
    arguments: { format: "markdown", budgetUsd: 48000 }
  });

  assert.ok(grant.content[0].text.includes("Requested budget: $48,000"));

  const report = await client.callTool({
    name: "generate_scout_report",
    arguments: {
      opportunities: [
        {
          title: "Goose Bounty/Grant Scout MCP",
          source: "goose_grant",
          amountUsd: 48000,
          notes: "rolling review milestone grant"
        }
      ]
    }
  });

  assert.ok(report.content[0].text.includes("Top recommendation"));

  const normalized = await client.callTool({
    name: "normalize_grant_program",
    arguments: {
      item: {
        projectName: "Goose Scout",
        requestedBudgetUsd: 48000,
        milestoneBased: true,
        rollingReview: true
      }
    }
  });

  assert.ok(normalized.content[0].text.includes("goose_grant"));
  console.log("mcp smoke passed");
} finally {
  await client.close();
}
