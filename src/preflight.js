import fs from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const required = [
  "package.json",
  "src/server.js",
  "src/scoring.js",
  "src/grant.js",
  "README.md",
  "docs/GOOSE_EXTENSION.md",
  "docs/GRANT_APPLICATION.md",
  "docs/USER_SUBMISSION_CHECKLIST.zh-CN.md"
];

for (const file of required) {
  assert.ok(fs.existsSync(file), `missing ${file}`);
}

execFileSync(process.execPath, ["src/selftest.js"], { stdio: "inherit" });
execFileSync(process.execPath, ["src/mcp-smoke.js"], { stdio: "inherit" });
console.log("preflight passed");
