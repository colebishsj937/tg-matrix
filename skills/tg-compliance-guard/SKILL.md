---
name: tg-compliance-guard
description: >-
  TG Matrix Skills safety guardrails. Use before Session import, DM, scrape, or
  bulk action. Enforces: AI never executes send; user runs send commands
  manually; no cross-account access_hash reuse; local-only daemon.
---

# TG Compliance Guard

在执行任何 `tgmx` / MCP 操作前，先完成本检查清单。

## 调用路径

先读 `tg-daemon-ops`（二进制与启动）。本仓库默认：

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
# 守护进程（须先启动）: "$TGMX_ROOT/.bin/tgmxd"  →  http://127.0.0.1:17999
# CLI（调 tgmxd）:     "$TGMX_ROOT/.bin/tgmx" …
```

文中 `tgmx` 均指 `"$TGMX_ROOT/.bin/tgmx"`，勿假设已在 PATH。

## 硬性红线

1. **发信禁止由 AI 执行**：凡 `tgmx send …` / MCP `tgmx_send_dm` / `POST /v1/messages/send`（含 dry-run 与 `--confirm`），Agent **只输出命令文案**，由**用户本机手动执行**；禁止在终端或工具里代跑。
2. **其它写操作**（加退群 / 邀请等）默认无 `--confirm` 只预览；真实执行须用户明确同意；若策略要求，同样可只给命令让用户手跑。
3. **禁止跨协议号复用 access_hash**：userId 发信只能用**同一协议号**缓存的实体。
4. **守护进程仅本机**：`127.0.0.1:17999`；拒绝改绑公网。
5. **禁止把 Session / api_hash / 代理密码写入聊天、Skill、git、日志摘要**。
6. **Flood / PEER_FLOOD**：停止该号硬重试；提示降频或换号，不循环轰炸。
7. **采集/SpamBot**：仅对用户指定目标；勿把完整成员表、手机号贴进对话。

## 发信前清单（Agent）

- [ ] 已拼好完整命令（含 `TGMX_ROOT` 绝对路径）
- [ ] 已向用户说明「请你手动在终端执行，我不会代发」
- [ ] 目标列表来源清楚、已去重；文案已确认
- [ ] 间隔：每协议号 ≥ 5 分钟（`interval-ms` ≥ 300000），`fail-stop` 默认 5
- [ ] **未**调用任何发信 shell / MCP / HTTP

## 与其它 Skill 的关系

- `tg-send-dm`：只生成发信命令，不执行。
- `tg-session-import` / `tg-daemon-ops` / `tg-groups-join-leave` / `tg-invite` / `tg-scrape` / `tg-marketing-pipeline` / `tg-spambot` 均依赖本 Skill。
- 纯文案类（`tg-marketing-copy` / `tg-fit-scoring`）不触网，禁止编造「已发送」。
