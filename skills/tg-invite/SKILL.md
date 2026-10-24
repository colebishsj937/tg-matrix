---
name: tg-invite
description: >-
  Invite users into a Telegram group/channel using protocol account pool.
  Default dry-run; --confirm for real invites. Use for 邀请入群、拉人进群.
---

# TG Invite

先读 `tg-compliance-guard` + `tg-daemon-ops`。邀请默认 dry-run。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 流程

```bash
# 预览
tgmx invite --accounts id1,id2 --group @targetgroup \
  --members-file members.txt --mode username

# 用户确认后
tgmx invite --accounts id1,id2 --group @targetgroup \
  --members-file members.txt --mode username --confirm --interval-ms 2000
```

单人：`--member @user`

## mode

| mode | 说明 |
|---|---|
| username | 按 @username / userId 解析（常用） |
| contact | 走联系人/导入联系人路径 |

执行号须已在目标群且具备邀请权限；无权限会失败，勿重试死循环。

## 禁止

- 未确认 `--confirm`
- 把 Session / 成员隐私数据整表贴进对话
