---
name: tg-send-dm
description: >-
  Prepare Telegram DM commands for the user to run manually. Never execute
  tgmx send or MCP send tools. Use when user asks to send DMs, 私信, 群发;
  output ready-to-copy shell commands only. After user sends, read recorded
  results via tasks/send log.
---

# TG Send DM

**必须先**：`tg-compliance-guard` + `tg-daemon-ops`。

## 硬性规则（Agent）

1. **禁止执行**任何发信命令或 MCP：`tgmx send dm …`（含 dry-run / `--confirm`）不要在终端代跑。
2. Agent **只生成**可复制命令，由**用户本机手动执行**。
3. 可代为执行只读：`health` / `accounts list` / **`send log`** / **`tasks …`**（查发送结果）。
4. 禁止编造「已发送 / 已送达 / 已读」；结果以任务明细与 send-log 为准。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"
# 须已启动: "$TGMX_ROOT/.bin/tgmxd"
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## Agent 输出流程

1. 只读确认协议号：`tgmx accounts list`。
2. 与用户确认账号、目标、文案；间隔 ≥ 5 分钟/号。
3. 贴出完整命令，写明：「请手动执行，我不会代发。」
4. **用户执行后**：Agent 用只读命令拉取并汇总**每条发送结果**（见下方「结果记录」）。

### 预览 / 真实发送（仅用户手跑）

```bash
"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2 --targets-file targets.txt \
  --text "..." --mode username --interval-ms 300000

"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2 --targets-file targets.txt \
  --text "..." --mode username --interval-ms 300000 --confirm
```

长批次请设：`export TGMX_HTTP_TIMEOUT_SEC=14400`（或 0 不超时）。

## 结果记录（必查）

服务端**每发出一条**立刻写入：

1. SQLite 任务明细：`task_items`（`tgmx tasks items <taskId>`）
2. JSONL 日志：`~/.tg-matrix-skills/logs/send_results.jsonl`

用户跑完（或中途超时）后，Agent **应主动**只读查询并汇报：

```bash
# 最近发信日志（每条一行：accountId/target/ok/error…）
"$TGMX_ROOT/.bin/tgmx" send log --limit 50

# 任务列表 → 取最新 messages 任务
"$TGMX_ROOT/.bin/tgmx" tasks list
"$TGMX_ROOT/.bin/tgmx" tasks items <taskId>
```

汇报时按条列出：协议号、目标、成功/失败、`errorCode`（如 `PEER_FLOOD`），不要概括成「已全部发送」。

## mode

| mode | 目标示例 | 注意 |
|---|---|---|
| username | `@foo` | 最常用 |
| phone | `86138...` | 可能 unmatched |
| userId | `123456` | 需同号 entity 缓存 |

## 失败解读

- `FLOOD_WAIT`：等待后单次再试
- `PEER_FLOOD` / 拉黑 / 隐私：该目标停，换号勿死循环
- `fail-stop`：连续失败熔断；已成功条目仍在 log/tasks 中

## 禁止

- Agent 代跑 `send dm`
- 编造发送结果；不查 log/tasks 就宣称成功
