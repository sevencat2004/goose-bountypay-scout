# Goose Bounty/Grant Scout MCP

Goose Bounty/Grant Scout MCP is a local MCP extension for ranking developer funding opportunities by practical payment likelihood, agent autonomy, and delivery risk.

Public repo: https://github.com/sevencat2004/goose-bountypay-scout

The first MVP is deliberately compact:

- `score_opportunity` scores one bounty or grant.
- `rank_opportunities` ranks a list and explains the top recommendation.
- `analyze_github_issue` fetches a public GitHub issue URL and scores it.
- `draft_grant_package` drafts the Goose grant package for this project.

The project is built as a Goose-connectable MCP server rather than a standalone-only script, so Goose can use it inside normal agent sessions.

## Why This Exists

Most bounty boards reward speed, but payout collectability is not obvious from the headline amount. The real questions are usually:

- Is the task actually claimable by the current user?
- Are there already duplicate PRs or accepted proposals?
- Does the platform allow AI-assisted work?
- Will the fix require private backend access, identity steps, KYC, or payment onboarding?
- Can Goose complete most of the work locally and independently?

This extension encodes those questions into a repeatable triage workflow.

## Install

```powershell
npm.cmd install
```

## Run The Demo

```powershell
npm.cmd run demo
```

## Test

```powershell
npm.cmd test
npm.cmd run test:mcp
npm.cmd run preflight
```

## Use With Goose

From this directory:

```powershell
goose session --with-extension "node D:\coin\goose-bountypay-scout\src\server.js"
```

Then ask Goose to rank a list of bounty or grant opportunities. See [docs/GOOSE_EXTENSION.md](docs/GOOSE_EXTENSION.md).

## Grant Materials

- [Grant application draft](docs/GRANT_APPLICATION.md)
- [Submission copy packet](docs/SUBMISSION_COPY_PACKET.md)
- [Roadmap](docs/ROADMAP.md)
- [Demo prompt](docs/DEMO_PROMPT.md)
- [Chinese user checklist](docs/USER_SUBMISSION_CHECKLIST.zh-CN.md)

## Current Scope

This MVP uses structured manual inputs and deterministic scoring. Later grant milestones add live-source adapters for GitHub, Algora-style boards, grant pages, and local follow-up records.

## Safety

The extension should never submit claims, applications, comments, vulnerability reports, or payment information on its own. It can prepare materials and identify user-owned steps, but final account, identity, KYC, tax, wallet, and public-submission actions remain with the project owner.
