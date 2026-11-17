"""Audit CELO flows into and out of the Community Fund over the last year.

The Blockscout v2 token-transfer index includes CELO value calls inside Safe
executions as well as conventional ERC-20 transfers. Event logs alone omit the
former, so use that address index and reconcile it to the balance change. The
index is not complete either: where the balance moved without an indexed flow,
the block is located by bisection and its `Transfer` logs are read from the node.
"""
import json, sys, time, urllib.parse, urllib.request

from common import GOV, TOKENS, TRANSFER, balance_of, rpc, word
from inflows import blockscout_transfer, gap_blocks, net_until, reconcile, rpc_log_transfer, unique_sorted

MAX_GAPS = 200

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
    """Walk Blockscout's descending cursor until it reaches the audit window.

    The endpoint's `token` filter does not answer for this address, so every token is
    read and CELO is kept here.
    """
    celo = TOKENS["CELO"].lower()
    token_of = lambda item: (item["token"].get("address_hash") or item["token"].get("address") or "").lower()
    params = {}
    rows = []
    for page in range(1, 10_001):
        response = request(params)
        items = response["items"]
        rows.extend(item for item in items if int(item["block_number"]) >= first_block and token_of(item) == celo)
        if not items or min(int(item["block_number"]) for item in items) < first_block:
            return rows
        cursor = response.get("next_page_params")
        if not cursor:
            return rows
        params = dict(cursor)
    raise SystemExit("blockscout token-transfer pagination exceeded 10,000 pages")


latest = json.load(open("chain.json"))["latest_block"]
first = latest - 365 * 86400
print("fetching CELO transfers from Blockscout", file=sys.stderr, flush=True)
# The index runs to the chain head; the audit is pinned to `latest`.
flows = [x for x in unique_sorted(blockscout_transfer(row) for row in transfers_since(first)) if x["block"] <= latest]

start_balance = balance_of("CELO", GOV, hex(first - 1))
end_balance = balance_of("CELO", GOV, hex(latest))


def logs_at(block):
    """CELO `Transfer` logs to and from the fund in one block, read from the node."""
    me, found = "0x" + word(GOV), []
    for topics in ([TRANSFER, None, me], [TRANSFER, me]):
        found += rpc("eth_getLogs", [{"fromBlock": hex(block), "toBlock": hex(block), "address": TOKENS["CELO"], "topics": topics}])
    timestamp = int(rpc("eth_getBlockByNumber", [hex(block), False])["timestamp"], 16)
    return [rpc_log_transfer(log, timestamp) for log in found]


balances = {first - 1: start_balance, latest: end_balance}


def drift(block):
    if block not in balances:
        balances[block] = balance_of("CELO", GOV, hex(block))
    return balances[block] - start_balance - net_until(flows, block)


gaps = gap_blocks(first - 1, latest, drift) if drift(latest) else []
if len(gaps) > MAX_GAPS:
    raise SystemExit(f"{len(gaps)} blocks with unindexed CELO flows; the transfer index is not usable")
recovered = 0
for block in gaps:
    before = len(flows)
    flows = unique_sorted(flows + logs_at(block))
    recovered += len(flows) - before

out = {
    "from_block": first,
    "to_block": latest,
    "flows": flows,
    "recovered_from_rpc": recovered,
    "reconciliation": reconcile(flows, start_balance, end_balance),
}
json.dump(out, open(sys.argv[1], "w"), indent=1)
print(f"flows {len(flows)} ({recovered} recovered from RPC logs); unexplained CELO delta {out['reconciliation']['unexplained']}", file=sys.stderr)
