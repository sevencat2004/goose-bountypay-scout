#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { rankOpportunities, scoreOpportunity, summarizeRanking } from "./scoring.js";
import { buildGrantPackage, grantMarkdown } from "./grant.js";
import { analyzeGitHubIssue } from "./github.js";

const server = new McpServer({
  name: "goose-bountypay-scout",
  version: "0.1.0"
});

const OpportunitySchema = z.object({
  title: z.string(),
  source: z.string().optional(),
  url: z.string().optional(),
  amountUsd: z.number().optional(),
  status: z.string().optional(),
  labels: z.array(z.string()).optional(),
  comments: z.number().optional(),
  openPrs: z.number().optional(),
  assigned: z.boolean().optional(),
  requiresAssignment: z.boolean().optional(),
  proposalGate: z.boolean().optional(),
  aiAllowed: z.boolean().optional(),
  requiresUserAccount: z.boolean().optional(),
  notes: z.string().optional()
});

server.tool(
  "analyze_github_issue",
  "Fetch a public GitHub issue URL, infer bounty/grant metadata, count likely open competing PRs, and score the opportunity.",
  { url: z.string().url() },
  async ({ url }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(await analyzeGitHubIssue(url), null, 2)
      }
    ]
  })
);

server.tool(
  "score_opportunity",
  "Score a single bounty or grant opportunity by payout collectability, Goose/Codex autonomy, and delivery risk.",
  { opportunity: OpportunitySchema },
  async ({ opportunity }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(scoreOpportunity(opportunity), null, 2)
      }
    ]
  })
);

server.tool(
  "rank_opportunities",
  "Rank multiple bounty or grant opportunities and return a concise recommendation.",
  { opportunities: z.array(OpportunitySchema).min(1) },
  async ({ opportunities }) => {
    const ranked = rankOpportunities(opportunities);
    return {
      content: [
        {
          type: "text",
          text: `${summarizeRanking(ranked)}\n\n${JSON.stringify(ranked, null, 2)}`
        }
      ]
    };
  }
);

server.tool(
  "draft_grant_package",
  "Draft a Goose grant package for the bounty/grant scout MCP project.",
  {
    projectName: z.string().optional(),
    maintainer: z.string().optional(),
    budgetUsd: z.number().optional(),
    timelineMonths: z.number().optional(),
    format: z.enum(["json", "markdown"]).optional()
  },
  async (input) => {
    const pkg = buildGrantPackage(input);
    const text = input.format === "json" ? JSON.stringify(pkg, null, 2) : grantMarkdown(pkg);
    return {
      content: [
        {
          type: "text",
          text
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
