---
name: tg-groups-join-leave
description: >-
  Join or leave Telegram groups/channels via tgmx for one or many protocol
  accounts. Default dry-run; --confirm required for real join/leave. Use when
  user asks 加群、退群、批量进群、批量退群.
---

# TG Groups Join / Leave

先读 `tg-compliance-guard` + `tg-daemon-ops`，确认 health。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 流程

1. `tgmx accounts list` 选号
2. **dry-run 预览**（默认）：

```bash
tgmx groups join --accounts id1,id2 --to @groupname
# 或文件
tgmx groups join --accounts id1,id2 --targets-file groups.txt
```

3. 展示 preview（账号 × 目标），用户明确同意后：

```bash
tgmx groups join --accounts id1,id2 --targets-file groups.txt --confirm --interval-ms 2000
tgmx groups leave --accounts id1 --to @groupname --confirm
```

4. 结果：`tgmx tasks list` / `tgmx tasks items <taskId>`

## 目标格式

| 格式 | 示例 |
|---|---|
| @username / username | `@mychannel` |
| 邀请链接 | `https://t.me/+xxxx` / `t.me/joinchat/xxxx` |
| peer | `peer:<id>:<accessHash>` |

## 禁止

- 未经确认加 `--confirm`
- 高频无间隔刷群（默认 interval ≥ 2s）
