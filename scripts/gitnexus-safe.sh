#!/usr/bin/env bash
set -euo pipefail

NODE_OPTIONS="--require /root/bright-smile/.gitnexus/lbug-patch.cjs" gitnexus "$@"
