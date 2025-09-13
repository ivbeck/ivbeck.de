#!/usr/bin/env bash
# Deploy Next.js app to a remote server using rsync and run as a Node.js server
#
# This script expects a .deployment.env file in the project root with variables:
#   DEPLOY_SSH_HOST=example.com
#   DEPLOY_SSH_USER=ubuntu
#   DEPLOY_SSH_PORT=22
#   DEPLOY_TARGET_DIR=/var/www/ivbeck
#   DEPLOY_APP_NAME=ivbeck
#   DEPLOY_NODE_ENV=production
#   DEPLOY_PORT=3000
#   SSH_KEY=~/.ssh/id_rsa   # optional; if not set, default SSH agent/keys are used
#
# It will:
# 1) Build Next.js with standalone output.
# 2) rsync the standalone bundle, static assets, and public/ to the server.
# 3) Restart the Node server on the target using nohup with a PID file.

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
ENV_FILE="$ROOT_DIR/.deployment.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Please create it (you can start from .deployment.env.example)." >&2
  exit 1
fi

# Load environment variables from .deployment.env
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# Defaults
: "${DEPLOY_SSH_PORT:=22}"
: "${DEPLOY_NODE_ENV:=production}"
: "${DEPLOY_PORT:=3000}"
: "${DEPLOY_APP_NAME:=next-app}"

if [[ -z "${DEPLOY_SSH_HOST:-}" || -z "${DEPLOY_SSH_USER:-}" || -z "${DEPLOY_TARGET_DIR:-}" ]]; then
  echo "ERROR: DEPLOY_SSH_HOST, DEPLOY_SSH_USER, and DEPLOY_TARGET_DIR must be set in .deployment.env" >&2
  exit 1
fi

SSH_OPTS=("-p" "$DEPLOY_SSH_PORT" "-o" "StrictHostKeyChecking=accept-new")
if [[ -n "${SSH_KEY:-}" ]]; then
  SSH_OPTS+=("-i" "$SSH_KEY")
fi

RSYNC_SSH="ssh ${SSH_OPTS[*]}"

echo "[1/4] Building Next.js app (standalone output)..."
# Ensure Node modules and build
if command -v pnpm >/dev/null 2>&1; then
  pnpm ci || pnpm install
  pnpm run build
else
  echo "ERROR: pnpm is not installed on this machine." >&2
  exit 1
fi

# Verify expected build output exists
if [[ ! -d "$ROOT_DIR/.next/standalone" ]]; then
  echo "ERROR: .next/standalone not found. Ensure next.config has output: 'standalone' and build succeeded." >&2
  exit 1
fi

echo "[2/4] Creating target directory on remote host..."
ssh "${SSH_OPTS[@]}" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" "mkdir -p '$DEPLOY_TARGET_DIR'"

echo "[3/4] Syncing files to remote host..."

# Detect rsync availability on local and remote
LOCAL_HAS_RSYNC="no"
REMOTE_HAS_RSYNC="no"
if command -v rsync >/dev/null 2>&1; then
  LOCAL_HAS_RSYNC="yes"
fi
if ssh "${SSH_OPTS[@]}" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" "command -v rsync >/dev/null 2>&1"; then
  REMOTE_HAS_RSYNC="yes"
fi

# Fallback sync using tar-over-SSH (does not delete extras on remote)
tar_sync() {
  local SRC_DIR="$1"
  local DEST_DIR="$2"
  echo " - [tar] $SRC_DIR -> $DEST_DIR"
  tar -C "$SRC_DIR" -cf - . | ssh "${SSH_OPTS[@]}" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" "mkdir -p '$DEST_DIR' && tar -C '$DEST_DIR' -xf -"
}

if [[ "$LOCAL_HAS_RSYNC" == "yes" && "$REMOTE_HAS_RSYNC" == "yes" ]]; then
  echo "Using rsync for file transfer."
  # Sync the standalone server
  rsync -az --delete -e "$RSYNC_SSH" "$ROOT_DIR/.next/standalone/" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST:$DEPLOY_TARGET_DIR/"
  # Sync static assets and public
  rsync -az --delete -e "$RSYNC_SSH" "$ROOT_DIR/.next/static" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST:$DEPLOY_TARGET_DIR/.next/"
  # Sync openrc files
  rsync -az --delete -e "$RSYNC_SSH" "$ROOT_DIR/openrc" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST:$DEPLOY_TARGET_DIR/"
  if [[ -d "$ROOT_DIR/public" ]]; then
    rsync -az --delete -e "$RSYNC_SSH" "$ROOT_DIR/public" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST:$DEPLOY_TARGET_DIR/"
  fi
else
  echo "rsync not available on $( [[ $LOCAL_HAS_RSYNC == yes ]] && echo local || echo no-local )/$( [[ $REMOTE_HAS_RSYNC == yes ]] && echo remote || echo no-remote ). Falling back to tar-over-SSH."
  # Sync using tar streaming (no delete)
  tar_sync "$ROOT_DIR/.next/standalone" "$DEPLOY_TARGET_DIR"
  tar_sync "$ROOT_DIR/.next/static" "$DEPLOY_TARGET_DIR/.next"
  if [[ -d "$ROOT_DIR/public" ]]; then
    tar_sync "$ROOT_DIR/public" "$DEPLOY_TARGET_DIR/public"
  fi
fi

REMOTE_CMD="service ivbeck-node restart"

echo "[4/4] Restarting remote Node server..."
# Pass variables inline to the remote shell
ssh "${SSH_OPTS[@]}" "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST" \
  DEPLOY_TARGET_DIR="${DEPLOY_TARGET_DIR}" \
  DEPLOY_APP_NAME="${DEPLOY_APP_NAME}" \
  DEPLOY_PORT="${DEPLOY_PORT}" \
  DEPLOY_NODE_ENV="${DEPLOY_NODE_ENV}" \
  DEPLOY_NODE_CMD="${DEPLOY_NODE_CMD:-}" \
  "bash -s" <<< "$REMOTE_CMD"

echo "Deployment completed successfully."
