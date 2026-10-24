# 冒烟步骤（不含真实 Session）

```bash
# 1. 确认预编译二进制已放入 .bin/
ls .bin/tgmxd .bin/tgmx

# 2. 启动 daemon（另开终端）
./.bin/tgmxd

# 3. 健康检查
./.bin/tgmx health

# 4. 导入（替换为你本机真实路径，勿提交到仓库）
./.bin/tgmx accounts import --json /path/to/xx.json --session /path/to/xx.session

# 5. dry-run 发信
./.bin/tgmx send dm --account <id> --to @someone --text "ping"

# 6. 用户确认后再真实发送
./.bin/tgmx send dm --account <id> --to @someone --text "ping" --confirm

# 7. 加退群 / 邀请（默认 dry-run）
./.bin/tgmx groups join --accounts <id> --to @group
./.bin/tgmx invite --accounts <id> --group @g --member @u

# 8. 采集 / SpamBot / 营销
./.bin/tgmx scrape --account <id> --group @g --sources speakers --history-limit 20
./.bin/tgmx spambot <id>
./.bin/tgmx marketing products upsert --name "demo"
```

公开仓库不含 `daemon/` 与 `scripts/`。勿提交真实 `.session` / 含 auth_key 的文件。
