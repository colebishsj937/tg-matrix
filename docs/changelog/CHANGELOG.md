## 2026-10-24 (send-result-log)

### 模块：发信结果落库

**变动类型：** 新增 / 优化

**变动描述：**
- 每条私信结果立即写入 `task_items` + `~/.tg-matrix-skills/logs/send_results.jsonl`
- 发信与 HTTP 客户端断开解耦（`WithoutCancel`），避免超时丢记录
- CLI：`tgmx send log`；Skill 要求发信后只读核对结果

**影响范围：**
- daemon messages/send_log/store；CLI；skills

**变动人：** Auto

## 2026-10-24 (send-user-manual-only)

### 模块：skills 发信策略

**变动类型：** 优化

**变动描述：**
- `tg-send-dm` / `tg-compliance-guard` 等：Agent **禁止执行**发信（含 dry-run / MCP），只输出命令由用户手动执行
- 同步 multi-account / marketing-pipeline / daemon-ops / marketing-copy

**影响范围：**
- skills/*

**变动人：** Auto

## 2026-10-24 (send-rate-5min)

### 模块：私信发送限速

**变动类型：** 优化

**变动描述：**
- 每协议号发信后至少等待 5 分钟（进程内跨请求生效）；`intervalMs` 只能调大
- CLI/MCP 默认 `intervalMs=300000`

**影响范围：**
- daemon `api/messages.go`、`api/send_rate.go`、CLI、MCP、skills

**变动人：** Auto

## 2026-10-24 (public-skills-github)

### 模块：公开仓库发布

**变动类型：** 发布

**变动描述：**
- 发布 Skills / MCP / docs / install 到 GitHub `colebishsj937/tg-matrix`
- **不发布** `daemon/`（tgmxd/tgmx 源码）与 `scripts/`（编译脚本）；二进制另行分发至 `.bin/`
- README / tg-daemon-ops / install.sh 改为「预编译二进制」用法

**影响范围：**
- 公开仓库内容边界

**变动人：** Auto

## 2026-10-24 (skills-tgmxd-paths)

### 模块：skills 调用路径

**变动类型：** 优化

**变动描述：**
- `tg-daemon-ops` 写明 `TGMX_ROOT`、`.bin/tgmxd|tgmx`、三种调用方式（进程 / CLI / HTTP·MCP）
- 各触网 Skill 增加「调用路径」：绝对路径 + 先 health；离线 Skill 标明不调 tgmxd

**影响范围：**
- skills/*

**变动人：** Auto

## 2026-10-24 (multi-platform-build)

### 模块：scripts 多平台编译

**变动类型：** 新增

**变动描述：**
- `scripts/build-release.sh`：交叉编译 darwin/linux/windows（amd64+arm64），本机产物装到 `.bin/`
- `scripts/build-windows.ps1` / `build-windows.bat`：Windows 本机编译备用
- 使用 `CGO_ENABLED=0` + modernc sqlite，Mac 上可直接出 Windows `.exe`

**影响范围：**
- scripts / README / dist

**变动人：** Auto

## 2026-10-24 (ops-pipeline)

### 模块：加退群 / 邀请 / 采集 / 营销流水线 / SpamBot

**变动类型：** 新增

**变动描述：**
- API：`POST /v1/groups/batch|invite`、`/v1/scrape/group|phones`、`/v1/accounts/{id}/spambot`、`/v1/marketing/*`
- tgclient：Join/Leave、Invite、Scrape、Phones、SpamBot
- store：`marketing_products` / `marketing_leads`
- CLI：`groups join|leave`、`invite`、`scrape`、`phones`、`spambot`、`marketing`
- Skills：`tg-groups-join-leave`、`tg-invite`、`tg-scrape`、`tg-marketing-pipeline`、`tg-spambot`
- MCP：对应工具（加退群/邀请默认 dry-run，需 confirm）

**影响范围：**
- daemon / CLI / MCP / skills / README

**变动人：** Auto

## 2026-10-24 (multi-account)

### 模块：groups + 多号号池发信

**变动类型：** 新增

**变动描述：**
- `GET/POST /v1/groups/joined`：本地缓存列表与从 TG 刷新（支持 all）
- CLI：`tgmx groups list|refresh`；`send dm --accounts id1,id2`
- Skill：`tg-multi-account-ops`；MCP 增加 groups 工具

**影响范围：**
- daemon / CLI / MCP / skills

**变动人：** Auto

## 2026-10-24 (batch-import)

### 模块：tgmx accounts import

**变动类型：** 新增

**变动描述：**
- 支持 `tgmx accounts import --dir <folder>` 递归批量导入
- 按文件名主干配对 `.json` + `.session`，汇总 created/skipped/failed

**影响范围：**
- CLI `tgmx`；Skill `tg-session-import`

**变动人：** Auto

## 2026-10-24

### 模块：tg-matrix-skills（独立仓库 v0.1）

**变动类型：** 新增

**变动描述：**
- 新建独立项目：Go daemon（tgmxd）+ CLI（tgmx）+ MCP + 6 个 Agent Skills
- 能力：Session 导入、代理绑定、授权检查、私信发送（dry-run / confirm）、任务落库
- Skills：compliance-guard、daemon-ops、session-import、send-dm、marketing-copy、fit-scoring
- install.sh 软链到 Cursor / Claude / Codex skills 目录

**影响范围：**
- 新仓库；与桌面 App 无运行时依赖

**变动人：** Auto
