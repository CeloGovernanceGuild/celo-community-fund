#!/usr/bin/env bash
# Re-run the Community Fund governance audit.
# usage: scripts/audit/run.sh <path to a celo-org/governance checkout>
set -euo pipefail
GOVERNANCE_REPO="$(cd "$1" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="$REPO/.audit"
mkdir -p "$WORK" && cd "$WORK"
S="$REPO/scripts/audit"

python3 -I "$S/parse_cgps.py" "$GOVERNANCE_REPO" > cgps.json
python3 -I - <<'PY'
import json
TOK = {"GoldToken": "CELO", "StableToken": "USDm", "StableTokenEUR": "EURm"}
rows = []
for x in json.load(open("cgps.json")):
    if not isinstance(x["mainnet"], list):
        continue
    for i, t in enumerate(x["mainnet"]):
        c, f = t.get("contract"), t.get("function") or ""
        if (c in TOK and f in ("transfer", "approve", "increaseAllowance")) or f.startswith("transfer(address"):
            a = t.get("args", [])
            try:
                amt = int(str(a[1])) / 1e18
            except Exception:
                amt = None
            m = x["meta"]
            rows.append(dict(cgp=x["cgp"], status=m.get("status", "").upper(), pid=m.get("governance-proposal-id"),
                             executed=m.get("date-executed"), title=m.get("title"), idx=i,
                             token=TOK.get(c, c or t.get("address")), fn=f, to=a[0] if a else None, amount=amt, raw=t))
json.dump(rows, open("spends.json", "w"), indent=1)
PY
python3 -I "$S/fetch_logs.py" chain.json
python3 -I "$S/verify.py"
python3 -I "$S/reconcile.py"
python3 -I "$S/grants.py" > /dev/null
python3 -I "$S/fetch_inflows.py" celo_in.json
python3 -I "$S/gen_data.py" "$REPO/src/data"
(cd "$REPO" && node --input-type=module -e "
import { getAddress } from 'viem'; import fs from 'node:fs';
for (const f of ['src/data/active_initiatives.js', 'src/data/completed_initiatives.js'])
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/address: \"(0x[0-9a-fA-F]{40})\"/g, (_, a) => 'address: \"' + getAddress(a) + '\"'));
")
python3 -I "$S/gen_report.py" "$REPO/docs/audit.md"
echo "Updated src/data and docs/audit.md. Intermediate files are in $WORK."
