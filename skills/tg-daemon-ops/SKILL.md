---
name: tg-daemon-ops
description: >-
  Start, health-check, and troubleshoot the TG Matrix Skills local daemon
  (tgmxd) and CLI (tgmx). Use when the user mentions tgmxd, TGMX_URL, port
  17999, ~/.tg-matrix-skills, daemon not running, or binary path.
---

# TG Daemon Ops

其它 Skill 执行任何 `tgmx …` 前，必须按本文定位二进制并确认 `tgmxd` 已启动。

## 1. 仓库与二进制路径（必读）

公开仓库 **不含** `daemon/` 源码与 `scripts/` 编译脚本。二进制由维护者另行提供。

| 项 | 路径 |
|---|---|
| 仓库根 `TGMX_ROOT` | 本机 `git clone` 后的目录（例：`…/tg-matrix`） |
| 守护进程 | `$TGMX_ROOT/.bin/tgmxd`（Windows：`.bin\tgmxd.exe`） |
| CLI | `$TGMX_ROOT/.bin/tgmx`（Windows：`.bin\tgmx.exe`） |
| 默认 HTTP | `http://127.0.0.1:17999` |
| 数据目录 | `~/.tg-matrix-skills/`（Windows：`%USERPROFILE%\.tg-matrix-skills\`） |

Agent 调用时**优先用绝对路径**，不要假设 `tgmx`/`tgmxd` 已在 `PATH`：

```bash
export TGMX_ROOT="/path/to/tg-matrix"    # 改成用户本机 clone 路径
export TGMX_URL="http://127.0.0.1:17999"
TGMXD="$TGMX_ROOT/.bin/tgmxd"
TGMX="$TGMX_ROOT/.bin/tgmx"
```

若 `.bin/tgmxd` 或 `.bin/tgmx` 不存在：提示用户向维护者获取预编译包并放入 `.bin/`，**不要尝试在本公开仓库编译**（无源码）。

## 2. 调用 tgmxd 的三种方式

### 方式 A：直接启动守护进程（必须先做）

```bash
"$TGMX_ROOT/.bin/tgmxd"
# 后台: nohup "$TGMX_ROOT/.bin/tgmxd" > /tmp/tgmxd.log 2>&1 &
# 可选: TGMX_ADDR / TGMX_DATA / TG_APP_ID / TG_APP_HASH
```

Windows：`& "$env:TGMX_ROOT\.bin\tgmxd.exe"`

日志应出现：`tgmxd listening on http://127.0.0.1:17999`。

### 方式 B：CLI `tgmx`（推荐给 Agent）

CLI **只 HTTP 调本机 tgmxd**，本身不连 Telegram。

```bash
"$TGMX_ROOT/.bin/tgmx" health
"$TGMX_ROOT/.bin/tgmx" accounts list
```

发信命令见 `tg-send-dm`：**Agent 只生成命令文案，禁止代执行 `send`**。  
其它 Skill 里的 `tgmx …` 均等价于 `"$TGMX_ROOT/.bin/tgmx" …`。

### 方式 C：HTTP / MCP

```bash
curl -s http://127.0.0.1:17999/health
```

MCP：`mcp/src/index.js`，`TGMX_URL=http://127.0.0.1:17999`。

## 3. 健康检查（写操作前必跑）

```bash
"$TGMX_ROOT/.bin/tgmx" health
```

期望：`ok=true`。

## 4. 与桌面 App 隔离

| | Skills daemon | 桌面 sidecar |
|---|---|---|
| 进程 | `tgmxd` | 桌面内嵌 |
| 端口 | **17999** | **17888** |
| 数据 | `~/.tg-matrix-skills` | 桌面自有目录 |

## 5. 常见故障

| 现象 | 处理 |
|---|---|
| connection refused | 启动 `$TGMX_ROOT/.bin/tgmxd` |
| No such file / 找不到 tgmx | 向维护者取预编译包放入 `.bin/` |
| gotd_not_configured | 设 `TG_APP_ID`/`TG_APP_HASH` 或导入含凭证 JSON |
| refusing non-loopback | `TGMX_ADDR` 只能是 `127.0.0.1:17999` |

## 6. Agent 约定

1. 确认 `.bin/tgmxd` 与 `.bin/tgmx` 存在；缺失则停并告知用户取二进制。
2. 只读/运维可先 `tgmx health`；失败则引导启动 daemon。
3. 命令里的 `tgmx` 写成 `"$TGMX_ROOT/.bin/tgmx"`。
4. **发信禁止代跑**：只把 `send` 命令交给用户手动执行（见 `tg-send-dm`）。
