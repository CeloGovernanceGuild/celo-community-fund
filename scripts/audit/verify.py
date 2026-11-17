"""Execution receipts of every governance proposal, plus current fund balances and allowances.

Receipts are cached in receipts.json because they never change; a re-run only fetches new ones.
"""
import json, os, re
from common import APPROVAL, BY_ADDRESS, GOV, TOKENS, TRANSFER, allowance, balance_of, rpc

chain = json.load(open("chain.json"))
cgps = json.load(open("cgps.json"))
spends = json.load(open("spends.json"))

# 1. Fund token events in the receipt of every ProposalExecuted transaction
execs = {}
for l in chain["executed"]:
    pid = int(l["topics"][1], 16)
    execs[pid] = {"tx": l["transactionHash"], "block": int(l["blockNumber"], 16), "ts": int(l["timeStamp"], 16)}
cache = json.load(open("receipts.json")) if os.path.exists("receipts.json") else {}
onchain = {}
for pid in sorted(execs):
    tx = execs[pid]["tx"]
    if tx not in cache:
        receipt = rpc("eth_getTransactionReceipt", [tx], retries=12)
        cache[tx] = [lg for lg in receipt["logs"] if lg["address"].lower() in BY_ADDRESS]
        json.dump(cache, open("receipts.json", "w"))
    onchain[pid] = [
        {"token": BY_ADDRESS[lg["address"].lower()], "kind": "approval" if lg["topics"][0] == APPROVAL else "transfer",
         "to": "0x" + lg["topics"][2][-40:], "amount": str(int(lg["data"], 16))}
        for lg in cache[tx]
        if lg["topics"][0] in (APPROVAL, TRANSFER) and lg["topics"][1][-40:] == GOV[2:]
    ]

# 2. Proposal id -> CGP. A proposal id written in a CGP file wins. Proposals no CGP claims are
# matched by the description URL they were queued with on-chain: a CGP that expires is re-submitted
# under a new proposal id and the id in the CGP file is often left pointing at the first attempt.
# (The on-chain URL alone is not reliable either: a few proposals were queued with a wrong CGP number.)
known = {x["cgp"] for x in cgps}
declared = {}  # CGP -> proposal id written in the CGP file
for x in cgps:
    m = re.search(r"(\d+)", str(x["meta"].get("governance-proposal-id", "")))
    if m:
        declared[x["cgp"]] = int(m.group(1))
cgp_of = {p: n for n, p in declared.items()}
url_cache = json.load(open("proposal_cgp.json")) if os.path.exists("proposal_cgp.json") else {}
for l in chain["queued"]:
    pid = str(int(l["topics"][1], 16))
    if pid not in url_cache:
        tx = rpc("eth_getTransactionByHash", [l["transactionHash"]], retries=12)
        m = re.search(rb"cgp-0*(\d+)", bytes.fromhex(tx["input"][2:]), re.I)
        url_cache[pid] = int(m.group(1)) if m else None
        json.dump(url_cache, open("proposal_cgp.json", "w"))
for pid, n in url_cache.items():
    if n in known:
        cgp_of.setdefault(int(pid), n)
pids_of = {}
for p, n in sorted(cgp_of.items()):
    pids_of.setdefault(n, []).append(p)

# 3. Current allowance of every spender seen in a CGP or an execution receipt
spenders = {(s["token"], s["to"].lower()) for s in spends
            if s["fn"] in ("approve", "increaseAllowance") and s["token"] in TOKENS}
spenders |= {(e["token"], e["to"].lower()) for evs in onchain.values() for e in evs if e["kind"] == "approval"}
# Pin every read to one block so balances and allowances are a consistent snapshot.
block = int(rpc("eth_blockNumber", []), 16)
allowances = {f"{t}:{a}": str(allowance(t, a, hex(block))) for t, a in sorted(spenders)}
balances = {t: str(balance_of(t, GOV, hex(block))) for t in TOKENS}

json.dump({"block": block, "balances": balances, "execs": execs, "onchain": onchain, "cgp_of": cgp_of, "pids_of": pids_of, "declared": declared,
           "allowances": allowances}, open("verified.json", "w"), indent=1)
print("block", block, "receipts", len(onchain), "allowances", len(allowances))
