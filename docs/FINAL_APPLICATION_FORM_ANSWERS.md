# Final Application Form Answers

Use these answers for the official Goose grant application form. Adjust only personal/account fields that must be filled by the applicant.

## Project Title

Goose Bounty/Grant Scout MCP

## Public Repository

https://github.com/sevencat2004/goose-bountypay-scout

## Short Summary

Goose Bounty/Grant Scout MCP is a Goose extension that helps developers rank bounty and grant opportunities by payout collectability, Goose-assisted autonomy, and delivery risk, then generate scout reports and grant/bounty submission materials.

## Full Project Description

Developer funding is fragmented across GitHub issues, bounty boards, grants, hackathons, and security programs. A large headline reward often hides assignment gates, duplicate pull requests, stale tasks, unclear payout paths, or program rules that prohibit AI assistance. Goose users need an agent-native way to decide whether an opportunity should be pursued, monitored, skipped, or rejected before investing engineering time.

This project builds a Goose-compatible MCP extension that normalizes opportunity metadata, scores collectability and autonomy, explains risk, generates Markdown/JSON scout reports, and prepares grant or bounty submission packages. The current MVP already includes a STDIO MCP server, GitHub issue analysis, GitHub issue search, Algora-style metadata normalization, grant-program metadata normalization, persisted scout reports, a grant package generator, docs, tests, and a public repository.

## Why This Is A Good Fit For Goose

Goose can coordinate local files, command-line tools, repositories, MCP extensions, and durable project context. This project turns those strengths into a practical funding workflow for open-source developers and small teams. It also demonstrates how Goose extensions can support real economic decision-making while staying safe around user-owned actions such as account login, KYC, tax, wallet, and payment onboarding.

## Requested Funding

$48,000 USD.

## Project Duration

4 months.

## Milestones

### Milestone 1 - Working MCP Extension MVP

Budget: $9,600  
Duration: 2 weeks

Deliverables:

- STDIO MCP server exposing opportunity triage tools to Goose.
- Deterministic scoring for collectability, autonomy, and delivery risk.
- Public GitHub issue analyzer.
- Grant package generator.
- Self-test, MCP smoke test, and preflight.

Status: MVP is already implemented and published in the public repository.

### Milestone 2 - Live Source Adapters And Report Workflow

Budget: $14,400  
Duration: 4 weeks

Deliverables:

- GitHub issue search and analysis workflow.
- Algora-style bounty metadata adapter.
- Grant-program metadata adapter.
- Markdown/JSON scout report generation.
- Source failure reporting.

Status: Initial version is implemented; grant funding would support deeper source coverage, stronger parsing, and repeated report workflows.

### Milestone 3 - Submission Assistant And Payment-Risk Tracker

Budget: $14,400  
Duration: 4 weeks

Deliverables:

- Grant and bounty submission package generator.
- Payout, KYC, wallet, tax, and account-action checklist.
- Follow-up queue for submitted PRs, grants, and unpaid claims.
- Project-record import/export helpers.

### Milestone 4 - Documentation, Examples, And Community Handoff

Budget: $9,600  
Duration: 2 weeks

Deliverables:

- Goose extension installation guide.
- Demo prompts and example reports.
- Issue templates and maintenance docs.
- Community-ready README and source notes.

## Current MVP Evidence

- Public repo: https://github.com/sevencat2004/goose-bountypay-scout
- Latest verified commit: b439df1 Add source adapters and persisted scout reports
- Local preflight passes with self-test and MCP smoke test.
- GitHub live issue analysis works against public GitHub API.
- GitHub live search works against public GitHub API.
- Sample report generation ranks the Goose project as `pursue_now`.

## Success Metrics

- A Goose user can install and run the extension locally in under 10 minutes.
- The extension can rank opportunities with explicit collectability, autonomy, and risk scores.
- Reports clearly distinguish pursue-now, monitor, skip, and do-not-pursue decisions.
- At least three source/input types are supported.
- The tool tracks user-owned steps for application, KYC, tax, wallet, and payout workflows without collecting sensitive information.

## Maintenance Plan

The project will remain open-source under the MIT license. Source adapters will stay modular so a blocked, rate-limited, or broken source does not break the whole extension. The tool will prefer explicit uncertainty over guessed results and will avoid automating user-owned submission, identity, or payment steps.

## Risks And Mitigations

- Source pages and APIs can change. Mitigation: keep adapters modular and surface source failures clearly.
- Bounty programs vary in rules and payout paths. Mitigation: score collectability, autonomy, and risk separately instead of relying on headline reward size.
- Some programs prohibit AI tools. Mitigation: hard-reject AI-prohibited opportunities.
- Final submission and payment steps require applicant control. Mitigation: generate checklists and copy packets, but leave account, identity, KYC, tax, wallet, and payment actions to the user.

## Applicant-Owned Fields

The applicant should fill these directly in the official form:

- Legal name
- Email
- Country or region
- Any organization/team information
- Payment/KYC/tax information if requested
- Any required account login or signature

Do not share private keys, seed phrases, tax IDs, full bank details, or one-time codes with the tool.
