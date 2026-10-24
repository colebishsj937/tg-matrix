#!/usr/bin/env bash
# 将 skills 符号链接到 Cursor / Claude Code / Codex 个人 skills 目录。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILLS_SRC="$ROOT/skills"

link_skill() {
  local dest_root="$1"
  mkdir -p "$dest_root"
  for d in "$SKILLS_SRC"/tg-*; do
    [ -d "$d" ] || continue
    name="$(basename "$d")"
    target="$dest_root/$name"
    if [ -L "$target" ] || [ -e "$target" ]; then
      rm -rf "$target"
    fi
    ln -s "$d" "$target"
    echo "linked $target -> $d"
  done
}

echo "==> Cursor (~/.cursor/skills)"
link_skill "$HOME/.cursor/skills"

if [ -d "$HOME/.claude" ] || mkdir -p "$HOME/.claude/skills" 2>/dev/null; then
  echo "==> Claude Code (~/.claude/skills)"
  link_skill "$HOME/.claude/skills"
fi

echo "==> Agents fallback (~/.agents/skills)"
link_skill "$HOME/.agents/skills"

echo "==> Codex (~/.codex/skills)"
mkdir -p "$HOME/.codex/skills"
link_skill "$HOME/.codex/skills"

echo ""
echo "Done."
echo "请将预编译 tgmxd / tgmx 放到: $ROOT/.bin/"
echo "启动: $ROOT/.bin/tgmxd"
echo "检查: $ROOT/.bin/tgmx health"
echo "MCP: 见 README.md"
