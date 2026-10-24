---
name: tg-send-dm
description: >-
  Prepare Telegram DM commands for the user to run manually. Never execute
  tgmx send or MCP send tools. Use when user asks to send DMs, 私信, 群发;
  output ready-to-copy shell commands only.
---

# TG Send DM

**必须先**：`tg-compliance-guard` + `tg-daemon-ops`。

## 硬性规则（Agent）

1. **禁止执行**任何发信命令或 MCP：`tgmx send …`、`tgmx_send_dm`、`POST /v1/messages/send`（含 dry-run 与 `--confirm`）一律**不要在终端/工具里跑**。
2. Agent **只生成**可复制的命令，交给**用户本机手动执行**。
3. 可代为执行只读辅助（如 `tgmx accounts list`、`tgmx health`），用于拼命令；**不得**发信。
4. 禁止编造「已发送 / 已送达 / 已读」。

## 调用路径（写给用户复制）

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 用户本机 clone 根目录
# 须已启动: "$TGMX_ROOT/.bin/tgmxd"
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## Agent 输出流程

1. 用只读命令弄清协议号（可执行：`tgmx accounts list`）。
2. 与用户确认：账号、目标、文案、mode；每协议号间隔 ≥ 5 分钟。
3. **在对话中贴出完整命令**（绝对路径优先），明确写：「请你在本机终端手动执行，我不会代发。」
4. 用户执行后，如需解读结果，再根据用户粘贴的输出说明（仍不代跑发信）。

### 预览命令（无 --confirm，仍由用户手动跑）

```bash
"$TGMX_ROOT/.bin/tgmx" send dm --account <id> --to @username --text "你好" --mode username
```

### 真实发送（带 --confirm，仅用户手动）

```bash
"$TGMX_ROOT/.bin/tgmx" send dm --account <id> --to @username --text "你好" --mode username --confirm
```

### 批量

```bash
"$TGMX_ROOT/.bin/tgmx" send dm --account <id> --targets-file targets.txt --text "..." --confirm \
  --interval-ms 300000 --fail-stop 5
```

服务端强制：同一协议号发完一条后至少再等 **5 分钟**。多号轮询时不同号可交错。

### 查任务（只读，Agent 可执行）

```bash
"$TGMX_ROOT/.bin/tgmx" tasks list
"$TGMX_ROOT/.bin/tgmx" tasks items <taskId>
```

## mode

| mode | 目标示例 | 注意 |
|---|---|---|
| username | `@foo` / `foo` | 最常用 |
| phone | `86138...` | 隐私限制可能导致 unmatched |
| userId | `123456` | 需本协议号已有 entity 缓存 |

## 失败解读（用户贴日志后）

- `FLOOD_WAIT`：等待后单次再试；勿建议死循环
- `PEER_FLOOD` / 拉黑 / 隐私：该目标停发
- 连续失败达 `fail-stop`：整批熔断

## 禁止

- Agent 自己跑 `send` / MCP 发信（含 dry-run）
- 未经用户知情输出带 `--confirm` 却暗示「我已帮你发」
- 编造发送结果
