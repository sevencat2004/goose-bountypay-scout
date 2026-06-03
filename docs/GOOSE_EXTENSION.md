# Goose Extension Setup

This project exposes a STDIO MCP server for Goose.

## Local Command

```powershell
node D:\coin\goose-bountypay-scout\src\server.js
```

## Goose Session

```powershell
goose session --with-extension "node D:\coin\goose-bountypay-scout\src\server.js"
```

## Example Prompt

```text
Use the goose-bountypay-scout tools to rank these opportunities:
1. Goose grant for a bounty scouting MCP extension, $48,000 requested, rolling review, milestone payments.
2. Crowded GitHub UI bounty, $440, 6 open PRs, requires assignment.
3. Security bounty, $5,000 max, rules prohibit AI tools.

Return the decision, score, risk factors, and next action.
```

## Exposed Tools

- `score_opportunity`: score one opportunity.
- `rank_opportunities`: rank multiple opportunities.
- `analyze_github_issue`: fetch and score one public GitHub issue URL.
- `draft_grant_package`: create a grant proposal package for this project.

## Design Notes

The first version is intentionally deterministic and local. It is meant to make the opportunity decision auditable before live-source adapters are added.

Future adapters should report fetch failures explicitly. If a source blocks access, rate-limits, or returns ambiguous data, the extension should say so instead of inventing status.
