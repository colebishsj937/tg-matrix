---
name: tg-scrape
description: >-
  Scrape Telegram group members and recent speakers, or check phone numbers
  on Telegram. Use for 采集成员、发言者、查手机号是否注册 TG.
---

# TG Scrape

先读 `tg-compliance-guard` + `tg-daemon-ops`。采集会连网，告知用户后再执行。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 群成员 / 发言者

```bash
tgmx scrape --account <id> --group @groupname \
  --sources members,speakers --member-limit 200 --history-limit 100
```

- `members`：成员列表（需可见权限）
- `speakers`：近期消息发言者

结果写入任务；可用 `tgmx tasks items <taskId>` 查看。

## 手机号检查

```bash
tgmx phones --accounts id1,id2 --phones-file phones.txt --interval-ms 1500
```

## Agent 约束

1. 仅采集用户明确指定的群/号码文件
2. 勿把完整成员表、手机号列表原样贴进对话；摘要统计即可
3. 限流 / 隐私失败记失败，勿死循环
