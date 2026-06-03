# Goose Grant 提交清单

这个项目现在先按 Goose Grant 正式项目推进。Codex 负责技术方案、MVP、文档和申请材料；只有账号、身份、付款、税务、钱包、最终提交这些必须由本人完成的步骤需要用户处理。

## 当前项目

- 项目名：Goose Bounty/Grant Scout MCP
- 建议申请金额：48,000 USD
- 建议周期：4 个月
- 本地路径：`D:\coin\goose-bountypay-scout`
- 当前状态：MVP 已搭建为本地 STDIO MCP server，可给 Goose 接入

## 用户稍后需要做的事

- 用自己的账号打开 Goose Grant 申请入口。
- 粘贴 `docs/GRANT_APPLICATION.md` 里的英文申请内容。
- 如果表单要求，填写真实姓名、邮箱、国家/地区、收款/KYC/税务信息。
- 如果项目获批，按对方要求完成 milestone 验收和付款资料。

## 不要发给 Codex 的信息

- 身份证、护照完整照片
- 税号
- 银行卡完整信息
- 钱包私钥、助记词、恢复短语
- 任何一次性验证码

## 建议提交前再确认

- `npm.cmd test` 通过
- `npm.cmd run test:mcp` 通过
- `npm.cmd run preflight` 通过
- README 能说明如何用 Goose 连接 MCP server
- Grant 文档里金额、周期、里程碑和交付物一致
- 用户本人确认最终申请金额可以接受
