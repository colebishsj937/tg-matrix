---
name: tg-marketing-pipeline
description: >-
  Marketing pipeline: upsert product profile, collect speakers as leads,
  score/copy offline, then dry-run DM. Use for 营销流水线、产品线索、采集入池.
---

# TG Marketing Pipeline

先读 `tg-compliance-guard` + `tg-daemon-ops`。  
发信环节走 `tg-send-dm`：**只生成命令，由用户手动执行，Agent 不代发**。

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

## 4) 私信（只贴命令，用户手跑）

在对话中给出完整命令并注明「请手动执行」：

```bash
"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2 --targets-file hot-leads.txt --text "..." --interval-ms 300000
# 用户确认后自行执行：
"$TGMX_ROOT/.bin/tgmx" send dm --accounts id1,id2 --targets-file hot-leads.txt --text "..." --confirm --interval-ms 300000
```

## 禁止

- Agent 执行任何 `tgmx send` / MCP 发信
- 编造「已发送 / 已转化 / 已成交」
