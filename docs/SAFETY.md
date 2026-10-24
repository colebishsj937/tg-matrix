# 安全说明

## 默认安全姿态

1. **发信默认 dry-run**：CLI 无 `--confirm`、HTTP/MCP 无 `confirm:true` 时只返回 preview，不调用 Telegram 发送接口。
2. **仅本机监听**：`tgmxd` 拒绝非 `127.0.0.1` / `localhost` / `::1` 绑定。
3. **数据隔离**：默认目录 `~/.tg-matrix-skills/`，与桌面 App（`~/.tg-matrix` / Application Support）分离。
4. **实体隔离**：`access_hash` 按协议号缓存，禁止跨号复用。
5. **密钥**：Session 文件权限建议 `0600`；勿提交 git、勿贴入聊天。

## 滥用风险

本工具可操作真实 Telegram 用户会话。仅用于你有权管理的账号。违反 Telegram ToS 或当地法律的风险由使用者自行承担。

## 与桌面 App

| | Skills 项目 | 桌面 tg-matrix |
|---|---|---|
| 端口 | 17999 | 17888 |
| 数据 | ~/.tg-matrix-skills | App Support / ~/.tg-matrix |
| UI | 无（CLI/MCP/Skills） | Tauri |
