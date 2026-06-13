#!/usr/bin/env bash
# Dev workflow: ensure local Ghost is running, then start the gulp watcher.
# Ghost lives in a separate directory and requires Node 22.

set -e

GHOST_DIR="$HOME/Documents/Personal/projects/ghost-local"
GHOST_URL="http://localhost:2368"
GHOST_NODE="22"

# Load nvm so we can switch Node versions in subshells
export NVM_DIR="$HOME/.nvm"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

is_ghost_up() {
  curl -sS -o /dev/null -w "%{http_code}" --max-time 2 "$GHOST_URL" 2>/dev/null | grep -q "^[23]"
}

if is_ghost_up; then
  echo "✓ Ghost already running at $GHOST_URL"
else
  if [ ! -d "$GHOST_DIR" ]; then
    echo "✗ Ghost directory not found at $GHOST_DIR"
    echo "  Update GHOST_DIR in scripts/dev.sh or start Ghost manually."
    exit 1
  fi

  echo "→ Starting Ghost in $GHOST_DIR (Node $GHOST_NODE)..."
  (
    cd "$GHOST_DIR"
    nvm use "$GHOST_NODE" > /dev/null
    ghost start
  )

  echo "→ Waiting for Ghost to respond..."
  for _ in $(seq 1 30); do
    if is_ghost_up; then
      echo "✓ Ghost ready at $GHOST_URL"
      break
    fi
    sleep 1
  done

  if ! is_ghost_up; then
    echo "✗ Ghost did not start within 30s. Check $GHOST_DIR for issues."
    exit 1
  fi
fi

echo ""
echo "─────────────────────────────────────────────"
echo " Theme dev:  $GHOST_URL"
echo " Ghost admin: $GHOST_URL/ghost/"
echo " Gulp watching CSS, JS, .hbs (livereload on)"
echo "─────────────────────────────────────────────"
echo ""

exec npx gulp
