---
name: tg-marketing-copy
description: >-
  Generate Telegram marketing DM copy from a product profile and speaker
  digest. Offline prompt skill; does not send messages. Use when writing
  outreach scripts, CTA lines, or A/B variants for TG marketing.
---

# TG Marketing Copy

纯文案 Skill：输出候选话术，**不调用** `tgmxd` / `tgmx`。发送走 `tg-send-dm`（其调用路径见 `tg-daemon-ops`）。

## 输入（向用户收集或从文件读）

```yaml
product:
  name: ...
  selling_points: ...
  audience: ...
  avoid_audience: ...
  offer: ...
  landing_url: ...
  tone: 口语|专业|短句
  banned_words: []
  cta: ...
speaker:
  display_name: ...
  digest: |   # 发言摘要，勿编造
    ...
  language: zh|en|es|...
```

## 输出格式（严格）

```json
{
  "scripts": [
    {"id": "A", "text": "...", "why": "一句依据"},
    {"id": "B", "text": "...", "why": "..."},
    {"id": "C", "text": "...", "why": "..."}
  ],
  "warnings": []
}
```

## 约束

- 2～3 条候选；长度适合 TG 私信（建议 ≤ 400 字）
- 引用 digest 中真实兴趣点；禁止硬广堆砌与禁用词
- 不承诺收益；不冒充官方
- 群语境下避免 @全体、刷屏口吻
