# TG Matrix Skills

Telegram 多协议号 **Agent Skills**（Cursor / Claude Code / Codex）公开包。  
通过本机守护进程 `tgmxd` + CLI `tgmx` 执行导入、私信、加退群、邀请、采集、营销流水线、SpamBot 等（默认 dry-run，`--confirm` 才真实写操作）。

> **本仓库不包含** `daemon/`（`tgmxd`/`tgmx` 源码）与 `scripts/`（编译脚本）。  
> 请向维护者获取对应平台的预编译二进制，放到仓库根目录 `.bin/`。

默认监听：`http://127.0.0.1:17999`  
数据目录：`~/.tg-matrix-skills/`（Windows：`%USERPROFILE%\.tg-matrix-skills\`）

## 快速开始

```bash
git clone https://github.com/colebishsj937/tg-matrix.git
cd tg-matrix

# 1. 放入预编译二进制（向维护者索取）
mkdir -p .bin
# macOS/Linux:  .bin/tgmxd   .bin/tgmx
# Windows:      .bin/tgmxd.exe  .bin/tgmx.exe
chmod +x .bin/tgmxd .bin/tgmx   # Unix

# 2. 安装 Skills 到各 AI 工具
./install.sh

# 3. 启动 daemon（另开终端；可选 TG_APP_ID / TG_APP_HASH）
./.bin/tgmxd

# 4. 健康检查
./.bin/tgmx health
```

### 调用路径（Agent 必读）

```bash
export TGMX_ROOT="$(pwd)"   # 或本机 clone 绝对路径
export TGMX_URL="http://127.0.0.1:17999"
"$TGMX_ROOT/.bin/tgmxd" &                 # 守护进程
"$TGMX_ROOT/.bin/tgmx" health             # CLI → HTTP → tgmxd
```

文中 `tgmx` 均指 `"$TGMX_ROOT/.bin/tgmx"`，勿假设已在 PATH。详见 Skill `tg-daemon-ops`。

## Skills 列表

| Skill | 用途 |
|---|---|
| `tg-compliance-guard` | 发信/导入前合规检查 |
| `tg-daemon-ops` | 启停与排障、二进制路径 |
| `tg-session-import` | Session 导入 / 代理 |
| `tg-send-dm` | 私信 dry-run → confirm |
| `tg-multi-account-ops` | 多号列表 / 拉群 / 号池发信 |
| `tg-groups-join-leave` | 批量加群 / 退群 |
| `tg-invite` | 邀请入群 |
| `tg-scrape` | 成员/发言者采集、手机号检查 |
| `tg-marketing-pipeline` | 产品 → 采集线索 → 话术 → 发信 |
| `tg-marketing-copy` | 营销话术（离线） |
| `tg-fit-scoring` | 线索适配打分（离线） |
| `tg-spambot` | @SpamBot 限制状态检查 |

## CLI 示例

```bash
./.bin/tgmx accounts import --dir /path/to/帐号 --label-prefix colombia
./.bin/tgmx send dm --account <id> --to @user --text "hi"              # dry-run
./.bin/tgmx send dm --account <id> --to @user --text "hi" --confirm    # 真实发送
./.bin/tgmx groups join --accounts <id> --to @group                    # dry-run
./.bin/tgmx invite --accounts <id> --group @g --member @u
./.bin/tgmx scrape --account <id> --group @g
./.bin/tgmx spambot <id>
./.bin/tgmx marketing products upsert --name "产品A"
```

## MCP（Cursor）

```bash
cd mcp && npm install
```

```json
{
  "mcpServers": {
    "tg-matrix-skills": {
      "command": "node",
      "args": ["/绝对路径/tg-matrix/mcp/src/index.js"],
      "env": { "TGMX_URL": "http://127.0.0.1:17999" }
    }
  }
}
```

## 环境变量

| 变量 | 说明 | 默认 |
|---|---|---|
| `TGMX_ADDR` | daemon 监听 | `127.0.0.1:17999` |
| `TGMX_DATA` | 数据目录 | `~/.tg-matrix-skills` |
| `TGMX_URL` | CLI/MCP 基址 | `http://127.0.0.1:17999` |
| `TG_APP_ID` / `TG_APP_HASH` | Telegram API（账号 JSON 也可自带） | 空 |

## 安全

详见 [docs/SAFETY.md](docs/SAFETY.md)。冒烟：[examples/SMOKE.md](examples/SMOKE.md)。

## 目录（公开部分）

```text
skills/     Agent Skills（SKILL.md）
mcp/        Node MCP（调用本机 tgmxd HTTP）
docs/       SAFETY + changelog
examples/   样例与冒烟
install.sh  软链 Skills 到 Cursor / Claude / Codex
```

## License

MIT（Skills / MCP / 文档）。`tgmxd`/`tgmx` 二进制另行分发，不含在本仓库。
