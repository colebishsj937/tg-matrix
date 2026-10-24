---
name: tg-send-dm
description: >-
  Send Telegram DMs via tgmx with dry-run by default and --confirm for real
  sends. Supports username, phone, and userId modes. Use for private messaging
  tasks after compliance and daemon health checks.
---

# TG Send DM

**必须先**：`tg-compliance-guard` + `tg-daemon-ops` + health。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 流程

1. 确认执行协议号：`tgmx accounts list`
2. **dry-run 预览**（默认）：

```bash
tgmx send dm --account <id> --to @username --text "你好" --mode username
```

3. 向用户展示 preview（账号、目标、文案），获得明确同意后：

```bash
tgmx send dm --account <id> --to @username --text "你好" --mode username --confirm
```

4. 批量：

```bash
tgmx send dm --account <id> --targets-file targets.txt --text "..." --confirm \
  --interval-ms 2000 --fail-stop 5
```

5. 查看任务：`tgmx tasks list` / `tgmx tasks items <taskId>`

## mode

| mode | 目标示例 | 注意 |
|---|---|---|
| username | `@foo` / `foo` | 最常用 |
| phone | `86138...` | 隐私限制可能导致 unmatched |
| userId | `123456` | 需本协议号已有 entity 缓存 |

## 失败处理

- `FLOOD_WAIT`：等待后单次续试；勿死循环
- `PEER_FLOOD` / 拉黑 / 隐私：记失败，停该目标
- 连续失败达 `fail-stop`：熔断整批

## 禁止

- 未经用户确认加 `--confirm`
- 编造「已送达/已读」
