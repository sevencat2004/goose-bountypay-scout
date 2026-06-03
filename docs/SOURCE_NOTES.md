# Source Notes

Checked on 2026-06-04 Asia/Shanghai.

## Goose Grant Program

Official page: https://block.github.io/goose/grants/

Key facts used in this proposal:

- Goose grants are intended to accelerate Goose in the open-source community.
- Good proposals should align with openness, modularity, and user empowerment.
- Grant details list project length as 12 months.
- Grant details list funding amount as 100,000 USD per grant.
- Grants are milestone-based, with periodic check-ins, deliverables, and payouts.
- Proposals are reviewed on a rolling basis.
- Payouts are milestone-based and made quarterly, pending satisfactory progress updates.
- The program accepts individuals and teams globally, subject to applicable law.

## Goose Extensions

Official docs: https://goose-docs.ai/docs/getting-started/using-extensions/

Key implementation facts used in this MVP:

- Goose extensions are based on MCP.
- Goose can install any MCP server as an extension.
- The CLI can start a session with an external extension command using `goose session --with-extension "{extension command}"`.
- Command-line extensions can run local commands such as Node-based MCP servers.

## Design Implication

This project is built as a local STDIO MCP server so it can be connected to Goose through the documented extension path, while remaining simple to test locally and safe to run without user credentials.
