---
name: tg-compliance-guard
description: >-
  TG Matrix Skills safety guardrails for Telegram multi-account operations.
  Use before any Session import, DM send, scrape, or bulk action. Enforces
  dry-run-first, explicit --confirm, no cross-account access_hash reuse, and
  local-only daemon binding.
---

# TG Compliance Guard

在执行任何 `tgmx` / MCP 写操作前，先完成本检查清单。

## 调用路径

先读 `tg-daemon-ops`（二进制与启动）。本仓库默认：

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
# 守护进程（须先启动）: "$TGMX_ROOT/.bin/tgmxd"  →  http://127.0.0.1:17999
# CLI（调 tgmxd）:     "$TGMX_ROOT/.bin/tgmx" …
```

文中 `tgmx` 均指 `"$TGMX_ROOT/.bin/tgmx"`，勿假设已在 PATH。

## 硬性红线

1. **默认不得真实写操作**：`send dm` / `groups join|leave` / `invite` 无 `--confirm` 只预览；HTTP 需 `confirm:true`。
2. **禁止跨协议号复用 access_hash**：userId 发信只能用**同一协议号**缓存的实体。
3. **守护进程仅本机**：`127.0.0.1:17999`；拒绝改绑公网。
4. **禁止把 Session / api_hash / 代理密码写入聊天、Skill、git、日志摘要**。
5. **不自动群发/拉群/邀请**：批量目标必须用户明确确认名单后再 `--confirm`。
6. **Flood / PEER_FLOOD**：停止该号硬重试；提示降频或换号，不循环轰炸。
7. **采集/SpamBot**：仅对用户指定目标执行；勿把完整成员表、手机号贴进对话。

## 执行前清单（Agent 必须逐项确认）

- [ ] 用户意图是本人授权的账号操作（非第三方未授权）
- [ ] 目标列表来源清楚，已去重
- [ ] 已展示 dry-run 预览（账号、mode、目标、文案摘要）
- [ ] 用户明确同意真实发送（口头/文字确认）后才加 `--confirm`
- [ ] 间隔与熔断：`interval-ms` ≥ 1500，`fail-stop` 默认 5

## 与其它 Skill 的关系

- `tg-session-import` / `tg-send-dm` / `tg-daemon-ops` / `tg-groups-join-leave` / `tg-invite` / `tg-scrape` / `tg-marketing-pipeline` / `tg-spambot` 均依赖本 Skill。
- 纯文案类（`tg-marketing-copy` / `tg-fit-scoring`）不触网，但仍禁止编造「已发送」结果。
