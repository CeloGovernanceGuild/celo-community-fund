"""Fetch event logs from Celo Blockscout (etherscan-compatible API), splitting ranges past 1000 results."""
import json, sys, time, urllib.request

API = "https://celo.blockscout.com/api"
GOV = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972"
GOVT = "0x" + GOV[2:].lower().rjust(64, "0")
APPROVAL = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
EXECUTED = "0x712ae1383f79ac853f8d882153778e0260ef8f03b504e2866e0593e04d2b291f"
TOKENS = {"CELO": "0x471EcE3750Da237f93B8E339c536989b8978a438",
          "USDm": "0x765DE816845861e75A25fCA122bb6898B8B1282a",
          "EURm": "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73"}

def get(params):
    url = API + "?" + "&".join(f"{k}={v}" for k, v in params.items())
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "celo-community-fund-audit/1.0"})
            with urllib.request.urlopen(req, timeout=90) as r:
                d = json.load(r)
            if d.get("status") == "1":
                return d["result"]
            if "No logs found" in str(d.get("message")) or d.get("result") == []:
                return []
            raise RuntimeError(d)
        except Exception as e:
            err = e
            time.sleep(2 * (attempt + 1))
    raise err

def logs(address, topics, lo, hi):
    p = {"module": "logs", "action": "getLogs", "fromBlock": lo, "toBlock": hi, "address": address}
    for i, t in enumerate(topics):
        if t:
            p[f"topic{i}"] = t
    if len([t for t in topics if t]) > 1:
        idx = [i for i, t in enumerate(topics) if t]
        for a, b in zip(idx, idx[1:]):
            p[f"topic{a}_{b}_opr"] = "and"
        if 0 in idx and len(idx) > 1:
            p[f"topic0_{idx[1]}_opr"] = "and"
    res = get(p)
    if len(res) >= 1000 and hi - lo > 1:
        mid = (lo + hi) // 2
        return logs(address, topics, lo, mid) + logs(address, topics, mid + 1, hi)
    return res

rpc = urllib.request.Request("https://forno.celo.org", data=b'{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}', headers={"Content-Type": "application/json", "User-Agent": "celo-community-fund-audit/1.0"})
latest = int(json.load(urllib.request.urlopen(rpc, timeout=60))["result"], 16)
out = {"latest_block": latest}
out["executed"] = logs(GOV, [EXECUTED], 0, latest)
for sym, addr in TOKENS.items():
    out[f"{sym}_approval"] = logs(addr, [APPROVAL, GOVT], 0, latest)
    out[f"{sym}_transfer_out"] = logs(addr, [TRANSFER, GOVT], 0, latest)
    print(sym, len(out[f"{sym}_approval"]), len(out[f"{sym}_transfer_out"]), file=sys.stderr)
print("executed", len(out["executed"]), file=sys.stderr)
json.dump(out, open(sys.argv[1], "w"))
