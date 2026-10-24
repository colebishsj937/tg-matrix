---
name: tg-multi-account-ops
description: >-
  Multi-account Telegram Matrix workflow for AI chat: list all protocol
  accounts, refresh/list joined groups per account, and pool-send DMs to a
  target batch using all or selected accounts. Use when user asks for 所有协议号,
  所有群, 多号群发, 号池发送.
---

# TG Multi-Account Ops

先读 `tg-compliance-guard` + `tg-daemon-ops`。发信默认 dry-run，须用户确认后再 `--confirm`。

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

### 3) 多号号池私信一批目标

```bash
# 预览（不发送）
tgmx send dm --accounts id1,id2,id3 --targets-file targets.txt --text "你好" --mode username

# 用户确认后
tgmx send dm --accounts id1,id2,id3 --targets-file targets.txt --text "你好" --confirm
```

目标按 `accountIds` **轮询分配**（第 i 个目标用 `accounts[i % len]`）。

也可先 `tgmx accounts list` 取出全部 id，拼成 `--accounts`。

## Agent 约束

1. 刷新全号群前告知将连接 Telegram，可能较慢 / 触发限流
2. 发信前展示 dry-run preview（账号池、目标数、文案）
3. 未确认不加 `--confirm`
4. 勿把 Session 内容贴进对话
