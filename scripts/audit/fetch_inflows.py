"""Audit CELO flows into and out of the Community Fund over the last year.

The Blockscout v2 token-transfer index includes CELO value calls inside Safe
executions as well as conventional ERC-20 transfers. Event logs alone omit the
former, so use that complete address index and reconcile it to balance change.
"""
import json, sys, time, urllib.parse, urllib.request

from common import GOV, TOKENS, balance_of
from inflows import blockscout_transfer, reconcile, unique_sorted

API = f"https://celo.blockscout.com/api/v2/addresses/{GOV}/token-transfers"


def request(params):
    url = API + "?" + urllib.parse.urlencode(params)
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "celo-community-fund-audit/1.0"})
            with urllib.request.urlopen(req, timeout=90) as response:
                body = json.load(response)
            if isinstance(body.get("items"), list):
                return body
            raise RuntimeError(body)
        except Exception as error:
            if attempt == 5:
                raise SystemExit(f"blockscout token-transfer request failed: {error}")
            time.sleep(3 * (attempt + 1))


def transfers_since(first_block):
    """Walk Blockscout's descending cursor until it reaches the audit window."""
    params = {"token": TOKENS["CELO"]}
    rows = []
    for page in range(1, 10_001):
        response = request(params)
        items = response["items"]
        rows.extend(item for item in items if int(item["block_number"]) >= first_block)
        if not items or min(int(item["block_number"]) for item in items) < first_block:
            return rows
        cursor = response.get("next_page_params")
        if not cursor:
            return rows
        params = {"token": TOKENS["CELO"], **cursor}
    raise SystemExit("blockscout token-transfer pagination exceeded 10,000 pages")


latest = json.load(open("chain.json"))["latest_block"]
first = latest - 365 * 86400
print("fetching CELO transfers from Blockscout", file=sys.stderr, flush=True)
flows = unique_sorted(blockscout_transfer(row) for row in transfers_since(first))

start_balance = balance_of("CELO", GOV, hex(first - 1))
end_balance = balance_of("CELO", GOV, hex(latest))
out = {
    "from_block": first,
    "to_block": latest,
    "flows": flows,
    "reconciliation": reconcile(flows, start_balance, end_balance),
}
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(f"flows {len(flows)}; unexplained CELO delta {out['reconciliation']['unexplained']}", file=sys.stderr)
