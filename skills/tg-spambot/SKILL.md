---
name: tg-spambot
description: >-
  Check Telegram account restriction status via @SpamBot. Use when user asks
  SpamBot、账号是否被限制、能否私信、解封状态.
---

# TG SpamBot

先读 `tg-compliance-guard` + `tg-daemon-ops`。会向 Telegram 发真实交互（问 SpamBot），告知用户后执行。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 用法

```bash
tgmx spambot <accountId>
# 可选等待秒数
tgmx spambot <accountId> --wait 8
```

## 解读

- 返回文案含 Free / no limits → 通常可正常私信
- Limited / restricted / spam → 勿再对该号做大规模发信/邀请
- 超时 / 无回复 → 记失败，换号或稍后重试，勿死循环

## 禁止

- 用 SpamBot 结果编造「已解封」
- 建议用户对受限号继续 `--confirm` 群发（发信命令仍由用户手跑，见 `tg-send-dm`）
