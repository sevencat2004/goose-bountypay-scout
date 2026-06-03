# Demo Prompt

Use this prompt in a Goose session launched with the extension:

```text
Use the goose-bountypay-scout extension to compare three opportunities:

1. Goose Bounty/Grant Scout MCP
   Source: goose_grant
   Amount: 48000 USD
   Notes: rolling review, milestone-based grant proposal for a Goose MCP extension

2. Crowded GitHub UI bounty
   Source: algora
   Amount: 440 USD
   Comments: 25
   Open PRs: 6
   Requires assignment: true
   Notes: many attempts and duplicate PRs already exist

3. AI-prohibited security bounty
   Source: bugcrowd
   Amount: 5000 USD
   AI allowed: false
   Notes: program rules prohibit AI tools during research

Return the ranking, decision, score, risk factors, and next action.
```

Expected result:

- Goose Bounty/Grant Scout MCP should rank first as `pursue_now`.
- The crowded GitHub bounty should be skipped.
- The AI-prohibited security bounty should be `do_not_pursue`.
