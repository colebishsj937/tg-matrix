---
name: tg-marketing-pipeline
description: >-
  Marketing pipeline: upsert product profile, collect speakers as leads,
  score/copy offline, then dry-run DM. Use for 营销流水线、产品线索、采集入池.
---

# TG Marketing Pipeline

先读 `tg-compliance-guard` + `tg-daemon-ops`。发信环节走 `tg-send-dm`（默认 dry-run）。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 1) 产品画像落库

```bash
tgmx marketing products upsert \
  --name "产品A" \
  --selling-points "卖点1;卖点2" \
  --audience "目标人群" \
  --avoid "避开人群" \
  --offer "优惠" \
  --url "https://..." \
  --tone "专业简洁" \
  --cta "了解详情" \
  --status active
```

`tgmx marketing products list` / `get <id>` / `rm <id>`

## 2) 从群发言者采集线索

```bash
tgmx marketing collect --product <productId> --account <id> --group @group
tgmx marketing leads <productId>
```

## 3) 离线打分 + 话术

- 用 Skill `tg-fit-scoring` 对 leads 打分
- 用 Skill `tg-marketing-copy` 生成私信文案
- 需要时可 PATCH 线索状态（MCP / HTTP）

## 4) 私信（必须 dry-run → 确认）

```bash
tgmx send dm --accounts id1,id2 --targets-file hot-leads.txt --text "..."
# 用户确认后
tgmx send dm --accounts id1,id2 --targets-file hot-leads.txt --text "..." --confirm
```

## 禁止

- 跳过 dry-run 直接群发
- 编造「已转化/已成交」
