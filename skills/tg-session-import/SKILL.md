---
name: tg-session-import
description: >-
  Import Telegram user sessions (.json + Telethon .session / session_string)
  into TG Matrix Skills via tgmx CLI or HTTP. Supports single-pair and recursive
  --dir batch import into local SQLite. Use when the user asks to import protocol
  accounts, sessions, bulk load folders, or bind proxies.
---

# TG Session Import

先读 `tg-compliance-guard` + `tg-daemon-ops`。勿把 Session 内容贴进对话。

## 调用路径

```bash
export TGMX_ROOT="/path/to/tg-matrix"   # 改成你本机 git clone 根目录
"$TGMX_ROOT/.bin/tgmxd" &                    # 若未启动
"$TGMX_ROOT/.bin/tgmx" health                # 须 ok
# 下文 tgmx = "$TGMX_ROOT/.bin/tgmx"
```

## 支持格式

- 成对：`{id}.json` + `{id}.session`（同目录、同文件名主干）
- 仅 JSON：含 `session_string` + `api_id`/`api_hash`
- 仅 `.session`：可用，但需另配 `TG_APP_ID` / `TG_APP_HASH`

目录布局示例（可递归）：

```text
帐号/tg-哥伦比亚-12-xxx/
  573204562312/573204562312.json
  573204562312/573204562312.session
  ...
```

## CLI

```bash
# 批量：递归扫描目录，按主干配对导入本地库（不连 Telegram）
tgmx accounts import --dir "/path/to/帐号" --label-prefix colombia

# 单号成对
tgmx accounts import --json /path/5732.json --session /path/5732.session --label colombia-1

# 列表 / 检查 / 删除
tgmx accounts list
tgmx accounts check <accountId>
tgmx accounts rm <accountId>
```

批量结果字段：`created` 新建、`skipped` 同 ID 已存在、`failed` 失败。

## 成功判定

- 批量：`ok:true` 且 `failed=0`；重复导入记 `skipped`，不算失败
- 仅落盘本地库；授权检查请另跑 `tgmx accounts check`
