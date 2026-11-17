"""Cross-check CGP spend transactions against on-chain execution receipts and current allowances."""
import json, re, sys, time, urllib.request

RPC = "https://forno.celo.org"
GOV = "0xd533ca259b330c7a88f74e000a3faea2d63b7972"
TOK = {"0x471ece3750da237f93b8e339c536989b8978a438": "CELO",
       "0x765de816845861e75a25fca122bb6898b8b1282a": "USDm",
       "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73": "EURm"}
APPROVAL = "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
TRANSFER = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

def rpc(batch):
    body = json.dumps(batch).encode()
    for attempt in range(6):
        try:
            req = urllib.request.Request(RPC, data=body, headers={"Content-Type": "application/json", "User-Agent": "ccf-audit/1.0"})
            res = json.load(urllib.request.urlopen(req, timeout=120))
            return {r["id"]: r.get("result") for r in res}
        except Exception as e:
            err = e; time.sleep(3 * (attempt + 1))
    raise err

chain = json.load(open("chain.json"))
cgps = json.load(open("cgps.json"))
spends = json.load(open("spends.json"))

# 1. Receipts of every ProposalExecuted tx
execs = {}
for l in chain["executed"]:
    pid = int(l["topics"][1], 16)
    execs[pid] = {"tx": l["transactionHash"], "block": int(l["blockNumber"], 16), "ts": int(l["timeStamp"], 16)}
pids = sorted(execs)
onchain = {}
for i in range(0, len(pids), 20):
    chunk = pids[i:i + 20]
    res = rpc([{"jsonrpc": "2.0", "id": p, "method": "eth_getTransactionReceipt", "params": [execs[p]["tx"]]} for p in chunk])
    for p in chunk:
        tries = 0
        while not res.get(p) and tries < 8:
            time.sleep(1.5 * (tries + 1)); tries += 1
            res[p] = rpc([{"jsonrpc": "2.0", "id": p, "method": "eth_getTransactionReceipt", "params": [execs[p]["tx"]]}]).get(p)
        if not res.get(p):
            raise SystemExit(f"receipt missing for proposal {p}")
    for p in chunk:
        evs = []
        for lg in (res[p] or {}).get("logs", []):
            a = lg["address"].lower()
            if a in TOK and lg["topics"][0] in (APPROVAL, TRANSFER) and lg["topics"][1][-40:] == GOV[2:]:
                evs.append({"token": TOK[a], "kind": "approval" if lg["topics"][0] == APPROVAL else "transfer",
                            "to": "0x" + lg["topics"][2][-40:], "amount": int(lg["data"], 16) / 1e18})
        onchain[p] = evs

# 2. CGP id -> proposal id
def pid_of(meta):
    m = re.search(r"(\d+)", str(meta.get("governance-proposal-id", "")))
    return int(m.group(1)) if m else None
cgp_by_pid = {}
for x in cgps:
    p = pid_of(x["meta"])
    if p is not None:
        cgp_by_pid.setdefault(p, []).append(x["cgp"])

# 3. Current allowances for every spender seen anywhere
spenders = set()
for s in spends:
    if s["fn"] in ("approve", "increaseAllowance") and s["token"] in ("CELO", "USDm", "EURm"):
        spenders.add((s["token"], s["to"].lower()))
for evs in onchain.values():
    for e in evs:
        if e["kind"] == "approval":
            spenders.add((e["token"], e["to"].lower()))
inv = {v: k for k, v in TOK.items()}
sp = sorted(spenders)
calls = []
for i, (t, a) in enumerate(sp):
    data = "0xdd62ed3e" + GOV[2:].rjust(64, "0") + a[2:].rjust(64, "0")
    calls.append({"jsonrpc": "2.0", "id": i, "method": "eth_call", "params": [{"to": inv[t], "data": data}, "latest"]})
allow = {}
for i in range(0, len(calls), 25):
    res = rpc(calls[i:i + 25])
    for k in list(res):
        tries = 0
        while res[k] is None and tries < 8:
            time.sleep(1.5 * (tries + 1)); tries += 1
            res[k] = rpc([calls[k]])[k]
        if res[k] is None:
            raise SystemExit(f"allowance call failed for {sp[k]}")
    for k, v in res.items():
        allow[f"{sp[k][0]}:{sp[k][1]}"] = int(v, 16) / 1e18
bal = rpc([{"jsonrpc": "2.0", "id": i, "method": "eth_call", "params": [{"to": a, "data": "0x70a08231" + GOV[2:].rjust(64, "0")}, "latest"]} for i, a in enumerate(TOK)])
balances = {TOK[a]: int(bal[i], 16) / 1e18 for i, a in enumerate(TOK)}
blk = int(rpc([{"jsonrpc": "2.0", "id": 0, "method": "eth_blockNumber", "params": []}])[0], 16)

json.dump({"block": blk, "balances": balances, "execs": execs, "onchain": onchain, "cgp_by_pid": cgp_by_pid, "allowances": allow}, open("verified.json", "w"), indent=1)
print("block", blk, "balances", balances, "receipts", len(onchain), "allowances", len(allow))
