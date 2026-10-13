#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Install Node.js 20+ to use the developer edition, or open COSMOS_OFFLINE.html."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing npm packages (internet required)..."
  npm install
fi
npm run dev
