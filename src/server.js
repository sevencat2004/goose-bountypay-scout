#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { rankOpportunities, scoreOpportunity, summarizeRanking } from "./scoring.js";
import { buildGrantPackage, grantMarkdown } from "./grant.js";
import { analyzeGitHubIssue, searchGitHubOpportunities } from "./github.js";
import { reportMarkdown } from "./report.js";
import { fromAlgoraLike, fromGrantProgram, saveScoutReport } from "./adapters.js";

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

const AlgoraLikeSchema = z.object({
  title: z.string().optional(),
  issueTitle: z.string().optional(),
  name: z.string().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
  issueUrl: z.string().optional(),
  repo: z.string().optional(),
  amountUsd: z.union([z.number(), z.string()]).optional(),
  amount: z.union([z.number(), z.string()]).optional(),
  bountyUsd: z.union([z.number(), z.string()]).optional(),
  rewardUsd: z.union([z.number(), z.string()]).optional(),
  comments: z.union([z.number(), z.string()]).optional(),
  commentCount: z.union([z.number(), z.string()]).optional(),
  openPrs: z.union([z.number(), z.string()]).optional(),
  prCount: z.union([z.number(), z.string()]).optional(),
  attempts: z.union([z.number(), z.string()]).optional(),
  claims: z.union([z.number(), z.string()]).optional(),
  labels: z.array(z.string()).optional(),
  status: z.string().optional(),
  open: z.boolean().optional(),
  assigned: z.boolean().optional(),
  assignee: z.string().optional(),
  requiresAssignment: z.boolean().optional(),
  claimRequiresApproval: z.boolean().optional(),
  proposalGate: z.boolean().optional(),
  aiAllowed: z.boolean().optional(),
  requiresUserAccount: z.boolean().optional(),
  claimUrl: z.string().optional(),
  notes: z.string().optional()
});

const GrantSchema = z.object({
  title: z.string().optional(),
  projectName: z.string().optional(),
  source: z.string().optional(),
  url: z.string().optional(),
  amountUsd: z.union([z.number(), z.string()]).optional(),
  requestedBudgetUsd: z.union([z.number(), z.string()]).optional(),
  maxGrantUsd: z.union([z.number(), z.string()]).optional(),
  status: z.string().optional(),
  labels: z.array(z.string()).optional(),
  timelineMonths: z.union([z.number(), z.string()]).optional(),
  milestoneBased: z.boolean().optional(),
  rollingReview: z.boolean().optional(),
  requiresKyc: z.boolean().optional(),
  aiAllowed: z.boolean().optional(),
  notes: z.string().optional()
});

server.tool(
  "normalize_algora_like",
  "Convert Algora-style bounty metadata into the standard opportunity format used by the scout.",
  { item: AlgoraLikeSchema },
  async ({ item }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(fromAlgoraLike(item), null, 2)
      }
    ]
  })
);

server.tool(
  "normalize_grant_program",
  "Convert grant program metadata into the standard opportunity format used by the scout.",
  { item: GrantSchema },
  async ({ item }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(fromGrantProgram(item), null, 2)
      }
    ]
  })
);

server.tool(
  "search_github_opportunities",
  "Search public GitHub issues, analyze returned issue URLs, and score likely bounty/grant opportunities.",
  {
    query: z.string().optional(),
    limit: z.number().min(1).max(20).optional()
  },
  async (input) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(await searchGitHubOpportunities(input), null, 2)
      }
    ]
  })
);

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
  "save_scout_report",
  "Generate and save Markdown plus JSON scout reports from structured opportunities, Algora-style items, and grant program items.",
  {
    title: z.string().optional(),
    fileBaseName: z.string().optional(),
    outputDir: z.string().optional(),
    opportunities: z.array(OpportunitySchema).optional(),
    algoraLike: z.array(AlgoraLikeSchema).optional(),
    grants: z.array(GrantSchema).optional()
  },
  async (input) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(saveScoutReport(input), null, 2)
      }
    ]
  })
);

server.tool(
  "generate_scout_report",
  "Generate a Markdown report from structured bounty or grant opportunities.",
  {
    opportunities: z.array(OpportunitySchema).min(1),
    title: z.string().optional()
  },
  async ({ opportunities, title }) => {
    const report = reportMarkdown(opportunities, { title });
    return {
      content: [
        {
          type: "text",
          text: report.markdown
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
