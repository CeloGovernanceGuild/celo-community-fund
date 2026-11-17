#!/usr/bin/env bash
# Re-run the Community Fund governance audit.
# usage: scripts/audit/run.sh <path to a celo-org/governance checkout>
set -euo pipefail
GOVERNANCE_REPO="$(cd "$1" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$REPO/.audit"
S="$REPO/scripts/audit"
PY="python3 -E -s"
mkdir -p "$WORK" && cd "$WORK"

$PY "$S/parse_cgps.py" "$GOVERNANCE_REPO" > cgps.json
$PY "$S/extract_spends.py"
$PY "$S/fetch_logs.py" chain.json
$PY "$S/verify.py"
$PY "$S/reconcile.py" > reconcile.log
$PY "$S/grants.py"
$PY "$S/fetch_inflows.py" celo_in.json
# Celo governance app, used only as a cross-check in the report
curl -fsS -m 60 -A "celo-community-fund-audit/1.0" https://mondo.celo.org/api/governance/proposals -o mondo.json || echo "[]" > mondo.json
$PY "$S/gen_data.py" "$REPO/src/data"
$PY "$S/gen_report.py" "$REPO/docs/audit.md"
echo "Updated src/data/ledger.js, src/data/proposals.js and docs/audit.md. Intermediate files are in $WORK."
