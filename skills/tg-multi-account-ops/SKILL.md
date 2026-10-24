---
name: tg-multi-account-ops
description: >-
  Multi-account Telegram Matrix workflow for AI chat: list all protocol
  accounts, refresh/list joined groups per account, and pool-send DMs to a
  target batch using all or selected accounts. Use when user asks for 所有协议号,
  所有群, 多号群发, 号池发送.
---

# TG Multi-Account Ops

先读 `tg-compliance-guard` + `tg-daemon-ops`。  
**发信**：Agent **不执行** `tgmx send`，只给出命令，由用户手动跑（见 `tg-send-dm`）。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 典型对话流程

用户：「列出所有协议号 → 拉每个号的群 → 用全部号给这批人发消息」

### 1) 所有协议号

```bash
tgmx accounts list
```

### 2) 刷新并列出所有号下的群

```bash
# 从 Telegram 拉取并写入本地缓存（会连网，号间有间隔）
tgmx groups refresh --all --limit 100

# 读缓存汇总
tgmx groups list --all
```

单号：`tgmx groups refresh --account <id>` / `tgmx groups list --account <id>`

### 3) 多号号池私信（只给命令，用户手跑）

Agent 在对话中贴出下列命令，并写明「请手动执行」——**禁止代跑**：

```bash
# 预览
"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2,id3 --targets-file targets.txt --text "你好" --mode username

# 真实发送（用户确认后再自己加 --confirm 执行）
"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2,id3 --targets-file targets.txt --text "你好" --confirm --interval-ms 300000
```

目标按 `accountIds` **轮询分配**（第 i 个目标用 `accounts[i % len]`）。

也可先执行只读 `tgmx accounts list` 取出全部 id，再拼进命令文案。

## Agent 约束

1. 刷新全号群前告知将连接 Telegram，可能较慢 / 触发限流
2. 发信：**只输出命令**，不执行 `send` / MCP 发信
3. 勿把 Session 内容贴进对话
4. 勿编造「已发送」
