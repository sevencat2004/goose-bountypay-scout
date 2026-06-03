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
  assert.deepEqual(names, ["analyze_github_issue", "draft_grant_package", "rank_opportunities", "score_opportunity"]);

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
  console.log("mcp smoke passed");
} finally {
  await client.close();
}
