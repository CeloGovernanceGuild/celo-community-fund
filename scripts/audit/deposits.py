"""Account for every proposal deposit held by the Governance contract.

`propose` sends a deposit to the contract, which is also the fund. When the proposal is
dequeued the deposit becomes withdrawable by the proposer (`refundedDeposits`); if it expires
in the queue the deposit is forfeited and stays in the fund. Writes deposits.json.
"""
import collections, datetime, json, sys, time, urllib.parse, urllib.request

from common import GOV, UA, rpc, word

API = "https://celo.blockscout.com/api"
DEQUEUED = "0x3e069fb74dcf5fbc07740b0d40d7f7fc48e9c0ca5dc3d19eb34d2e05d74c5543"


def logs(topic, lo, hi):
    url = API + "?" + urllib.parse.urlencode({"module": "logs", "action": "getLogs", "fromBlock": lo, "toBlock": hi, "address": GOV, "topic0": topic})
    for attempt in range(6):
        try:
            res = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90)).get("result") or []
            if len(res) >= 1000 and hi > lo:
                mid = (lo + hi) // 2
                return logs(topic, lo, mid) + logs(topic, mid + 1, hi)
            return res
        except Exception:
            time.sleep(3 * (attempt + 1))
    raise SystemExit("blockscout request failed")


chain = json.load(open("chain.json")); block = hex(chain["latest_block"])
call = lambda data: rpc("eth_call", [{"to": GOV, "data": data}, block])
now = int(rpc("eth_getBlockByNumber", [block, False])["timestamp"], 16)
queue_expiry = 2419200  # queueExpiry on the Governance contract: 4 weeks

executed = {int(l["topics"][1], 16) for l in chain["executed"]}
dequeued = {int(l["topics"][1], 16) for l in logs(DEQUEUED, 0, chain["latest_block"])}
# The explorer index can miss a log. A proposal that executed, or that the governance app saw past
# the queue, was dequeued whether or not its event was indexed.
try:
    seen_by_app = {x["id"] for x in json.load(open("mondo.json")) if x.get("id") and x.get("stage", 0) >= 2}
except FileNotFoundError:
    seen_by_app = set()

rows = []
for l in chain["queued"]:
    pid = int(l["topics"][1], 16); proposer = "0x" + l["topics"][2][-40:]
    data = l["data"][2:]; deposit = int(data[64:128], 16); ts = int(data[128:192], 16)
    if pid in dequeued or pid in executed or pid in seen_by_app:
        outcome = "dequeued"
    elif now - ts <= queue_expiry and int(call("0xc73a6d78" + hex(pid)[2:].rjust(64, "0")), 16):
        outcome = "in queue"
    else:
        outcome = "expired in queue"
    rows.append({"proposal": pid, "proposer": proposer, "deposit": str(deposit), "date": datetime.datetime.fromtimestamp(ts, datetime.timezone.utc).strftime("%Y-%m-%d"),
                 "tx": l["transactionHash"], "outcome": outcome,
                 "evidence": "event" if pid in dequeued else "executed" if pid in executed else "governance app" if pid in seen_by_app else "chain"})

proposers = sorted({r["proposer"] for r in rows})
claimable = {p: int(call("0x60b4d34d" + word(p)), 16) for p in proposers}
total = lambda outcome: sum(int(r["deposit"]) for r in rows if r["outcome"] == outcome)
out = {
    "block": chain["latest_block"],
    "deposits": rows,
    "claimable": {p: str(v) for p, v in claimable.items() if v},
    "totals": {
        "deposited": str(sum(int(r["deposit"]) for r in rows)),
        "refundable_not_withdrawn": str(sum(claimable.values())),
        "in_queue": str(total("in queue")),
        "forfeited": str(total("expired in queue")),
    },
}
out["totals"]["withdrawn"] = str(int(out["totals"]["deposited"]) - sum(int(out["totals"][k]) for k in ("refundable_not_withdrawn", "in_queue", "forfeited")))
json.dump(out, open("deposits.json", "w"), indent=1)
print({k: int(v) / 1e18 for k, v in out["totals"].items()}, "proposals", len(rows), collections.Counter(r["outcome"] for r in rows), collections.Counter(r["evidence"] for r in rows), file=sys.stderr)
