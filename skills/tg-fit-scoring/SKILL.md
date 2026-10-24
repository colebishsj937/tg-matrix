---
name: tg-fit-scoring
description: >-
  Score Telegram speaker digests against a product profile (fitScore 0-100,
  labels, risks). Offline analysis skill for lead qualification before outreach.
---

# TG Fit Scoring

对「产品画像 × 发言摘要」做适配打分。离线分析，**不调用** `tgmxd` / `tgmx`。采集/发信路径见 `tg-daemon-ops`。

## 输入

```yaml
product: { name, selling_points, audience, avoid_audience, banned_words }
speakers:
  - userId: 1
    username: ...
    digest: ...
```

## 输出（每条 speaker 一项）

```json
{
  "results": [
    {
      "userId": 1,
      "fitScore": 0,
      "fitLabel": "高|中|低|不适合",
      "reasons": ["引用摘要要点"],
      "riskFlags": ["投诉风险|竞品已用|无关闲聊|..."],
      "recommendedAction": "可推|谨慎|跳过"
    }
  ]
}
```

## 规则

- `fitScore` 0–100；低于 40 默认「跳过」
- 「不适合」须用户强制覆写才可进入发送队列
- 摘要不足时降分并注明 `证据不足`，禁止脑补用户意图
