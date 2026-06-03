# Goose Grant Application Draft

## Project Name

Goose Bounty/Grant Scout MCP

## Requested Funding

$48,000 USD

## Timeline

4 months

## Summary

Goose Bounty/Grant Scout MCP gives Goose users a local extension for finding, ranking, and preparing developer funding opportunities. It focuses on whether a bounty or grant can actually be collected, whether Goose can help complete the work independently, and which user-owned account or payment steps remain.

## Problem

Developer funding is fragmented across GitHub issues, bounty boards, grants, hackathons, and security programs. A large headline reward can hide assignment gates, duplicate pull requests, stale tasks, unclear payout paths, or program rules that prohibit AI assistance. This wastes engineering time and can push contributors toward low-quality duplicate submissions.

Goose users need an agent-native way to ask: should we work on this, monitor it, or reject it?

## Solution

Build a Goose MCP extension that:

- Ingests structured opportunity data from bounty and grant sources.
- Scores collectability, Goose/Codex autonomy, and delivery risk.
- Explains why an opportunity should be pursued, monitored, skipped, or rejected.
- Generates project plans and grant/bounty submission packages.
- Maintains a follow-up queue for submitted work, payout status, and user-required account actions.

## Why Goose

Goose can coordinate local files, repositories, command-line tools, browsing, and durable project context. This project turns those capabilities into a practical funding workflow for open-source contributors and small teams.

The extension also strengthens the Goose ecosystem by showing a concrete MCP-based agent workflow with real economic utility.

## Milestones

### M1 - Working MCP Extension MVP

Duration: 2 weeks  
Budget: $9,600

- STDIO MCP server exposing opportunity triage tools to Goose.
- Deterministic scoring engine for collectability, autonomy, and risk.
- Local demo data pack and self-test suite.

### M2 - Live Source Adapters And Report Workflow

Duration: 4 weeks  
Budget: $14,400

- GitHub issue adapter.
- Algora-style board adapter.
- Grant program/manual-source adapter.
- Goose-ready daily scout report with source failures surfaced clearly.

### M3 - Submission Assistant And Payment-Risk Tracker

Duration: 4 weeks  
Budget: $14,400

- Grant and bounty submission package generator.
- Payout, KYC, wallet, tax, and account-action checklist.
- Follow-up queue for submitted PRs, grants, and unpaid claims.

### M4 - Documentation, Examples, And Community Handoff

Duration: 2 weeks  
Budget: $9,600

- Goose extension installation guide.
- Example Goose sessions.
- Public docs and issue templates.
- Maintenance plan.

## Success Metrics

- A Goose user can install and run the MCP extension locally in under 10 minutes.
- The extension returns ranked opportunities with explicit collectability, autonomy, and risk scores.
- Reports clearly distinguish pursue-now, monitor, skip, and do-not-pursue decisions.
- At least three source types are supported by the end of M2.
- Submitted-work follow-up tracks payout status and user-required actions.

## Maintenance

The project will be maintained as a small open-source Goose extension. Source adapters will be kept modular so broken or rate-limited sources do not break the whole workflow. The extension will prefer explicit uncertainty over guessed data.

## User-Owned Steps

The project owner must handle final grant submission, account ownership, identity, KYC, tax, wallet, and payment onboarding steps. The extension can prepare copy and checklists, but it should not submit claims or payment information automatically.
