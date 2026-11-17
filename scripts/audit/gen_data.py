"""Generate src/data/ledger.js and src/data/proposals.js from the audit. Amounts are exact wei strings."""
import json, re, sys
from common import rpc, GOV

OUT = sys.argv[1]
g = json.load(open("grants.json")); v = json.load(open("verified.json"))
cgps = json.load(open("cgps.json")); spends = json.load(open("spends.json"))
url = lambda n: f"https://github.com/celo-org/governance/blob/main/CGPs/cgp-{n:04d}.md"

# Display names. Keyed by "TOKEN:address" first, then by address.
NAMES = {
 "0x7bdee323f5227f214edfc3ae4bd4ebc032b59c82": "Celo Airdrop",
 "0x2f90bb1caf4079192481b1a7f3088220d291456d": "CCF1",
 "0x5374cf78f82e3610f9678bd7af617785ff6c578a": "Community Appreciation Gifts",
 "0x0d8b5f1cd567656b6ad4c88e8f082f1f694e5bb5": "Ocelot (Celo Ecosystem Treasury)",
 "0x275d5828bf7e5aaf51bf8ef2f0668ac4a98f0d23": "Climate Collective",
 "0x9cf769bcce5e750534d88b251fb5b58da9776190": "Climate Collective Follow-on",
 "0xda2069f47d252121c2288301d6ef50b87220a693": "Prezenti (Community Fund stewardship)",
 "0xfa3df877f98ac5ecd87456a7accaa948462412f0": "Governance-Owned USDm/USDC Liquidity (Mobius)",
 "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1": "Mento-Owned USDm/USDC Liquidity (Curve)",
 "0xc59533fd060e38230100f3577ef5ad9467ae2594": "Africa DAO",
 "0x46421b8ef42b67ae4e24be599bd78144e5e12088": "Chainlink SCALE",
 "0x38dbab5c651f352c8f5f765fda292e9b92d850ff": "Latam DAO",
 "0x81bc5b8f34cf959105c793f776971fa8a7bb2a25": "Celo Tribe",
 "0x4763a32d5256eda615fd5c07b0e333c7baa4d628": "Europe DAO",
 "0x5f411351e6566409f9b0b8d03873846e0c7201b3": "Credit Collective",
 "0xf737369f79291d8e4ab273bbe5a4669381cb4715": "Celo Korea",
 "0xa7af94d898fc31a43d163201ce44b4fa944a79ee": "Mobile First Community",
 "0x34cbb11f19d9b6f1fc54d20b5e248db4a9b9afa2": "Centrifuge Deployment",
 "0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce": "MiniPay Strategic Grant",
 "0x71f433514957d00287a9d33da759f1e0c1732381": "CeloPG H1 2024",
 "0x9138ad934d63a81a3bd10e5e6a2511db13c1c1ca": "Outlier Ventures RWA Accelerator",
 "0x083ab4a0c5d6cc899008bd5e8e1312379d629320": "Red Beard Ventures Accelerator",
 "0x9c257bdc314dc516e673728d70f45444f6e22412": "Stabila",
 "0x1b98202492bd78bb042523674eec19cd0ac50f96": "CeloPG H2 2024",
 "0xdd817a3d583bb0b97579c5959b4c929504f688d7": "CeloPG x Optimism matching (PG <> OP)",
 "0xd1a06a4477b9e4633e6e56d8f9eb9ccd39ce36bc": "Stablecoin & dApp Public Goods Dashboard",
 "0x6c6dc3d4869d9812d80600b9f7f291e13ee73d49": "CeloColombia DAO",
 "0xd71efa410b6eaab0bac3b515b393c886be70f09e": "CICLOPS",
 "0x90860c778a8a69380376baab6ac7fec5daff4ab5": "Celo Regional Council",
 "0x85910be70d7ebf149918ed96ef8be175a0639c33": "CeloPG Seasons 0-1",
 "0x0b6a6666027d90fd56f4a2e1827296db4d590f4d": "Celo Communities Guild",
 "0x91606ba0b9a5527bf384001b94ab908c9054c677": "Celo Camp 2025",
 "0xa5c9389a0ce1bfe24ff883e761ff313225c77d44": "Prezenti Grants (Seasons 0-2)",
 "0x9d7bc0ed7e53c9d8bddac8ce7dff77aba54022d5": "FX Market Liquidity Strategy",
 "0x0f293b1548a55a7ba9541d4c27442e1591b068c9": "Celo Foundation",
 "0x35ff861a0b6215cec71ea282b0d32afefa661795": "Celo SHIELD",
 "0xc733285e8e4db433d4cd641f99c46bf108dcb54f": "Celo Governance Guild",
 "0xb0d0780eddc2fa35906c0b37b9b4dc7583c3dbb0": "Celo Core Co.",
 "CELO:0x68ce71d4ceca3003701ca6844d9a345925407455": "Score Management Committee (incl. Challenger Operator funding)",
 "USDm:0x68ce71d4ceca3003701ca6844d9a345925407455": "Score Management Committee (incl. Challenger Operator funding)",
}
# Direct transfers are grouped by purpose; each recipient stays visible in the grant lines.
TRANSFER_GROUPS = [
 ("Oracle Funding", [23, 46, 67, 85, 114]),
 ("Governance Approvers Gas", [101]),
 ("cLabs L2 Project", [106, 154]),
 ("L2 Development Next Phase", [201]),
 ("cLabs Core Protocol Season 2", [220]),
]

def name(token, addr):
    n = NAMES.get(f"{token}:{addr}") or NAMES.get(addr)
    if not n:
        sys.exit(f"missing display name for {token}:{addr}")
    return n

def grant_line(x):
    return {"cgp": x["cgp"], "proposalId": x["pid"], "date": x["date"], "tx": x["tx"], "function": x["function"],
            "to": x["to"], "requested": x["requested"], "replaced": x.get("before", "0") if x["function"] == "approve" else "0",
            "effective": x["effective"]}

entries = {}
for x in g:
    if x["kind"] == "approval":
        key = ("allowance", x["token"], x["to"])
        e = entries.setdefault(key, {"title": name(x["token"], x["to"]), "token": x["token"], "kind": "allowance", "address": x["to"], "grants": []})
    else:
        group = next((t for t, nums in TRANSFER_GROUPS if x["cgp"] in nums), None)
        if not group:
            sys.exit(f"transfer without group: CGP-{x['cgp']} {x['to']}")
        key = ("transfer", x["token"], group)
        e = entries.setdefault(key, {"title": group, "token": x["token"], "kind": "transfer", "grants": []})
    e["grants"].append(grant_line(x))
ledger = []
for e in entries.values():
    e["approved"] = str(sum(int(l["effective"]) for l in e["grants"]))
    e["cgps"] = sorted({l["cgp"] for l in e["grants"]})
    e["proposal"] = url(e["grants"][-1]["cgp"])
    e["firstGrant"] = e["grants"][0]["date"]
    ledger.append(e)
ledger.sort(key=lambda e: (e["firstGrant"], e["title"]))

# Pending proposals: CGPs not executed on-chain and not rejected, withdrawn or expired.
STAGES = ["None", "Queued", "Approval", "Referendum", "Execution", "Expiration"]
executed = {int(p) for p in v["execs"]}
pids_of = {int(n): ps for n, ps in v["pids_of"].items()}
pending = []
for x in cgps:
    st = x["meta"].get("status", "").upper()
    attempts = pids_of.get(x["cgp"], [])
    if st not in ("DRAFT", "PROPOSED", "VOTING") or any(p in executed for p in attempts):
        continue
    pid = max(attempts) if attempts else None  # latest on-chain attempt
    stage = None
    if pid is not None:
        stage = STAGES[int(rpc("eth_call", [{"to": GOV, "data": "0x582ae53b" + hex(pid)[2:].rjust(64, "0")}, "latest"]), 16)]
    requests = [{"token": s["token"], "function": s["fn"], "to": s["to"], "amount": s["amount"]}
                for s in spends if s["cgp"] == x["cgp"] and s["amount"]]
    pending.append({"cgp": x["cgp"], "title": (x["meta"].get("title") or "").replace("\\$", "$"), "status": st, "proposalId": pid,
                    "stage": stage, "created": x["meta"].get("date-created"), "url": url(x["cgp"]), "requests": requests})
pending.sort(key=lambda p: -p["cgp"])

block = v["block"]
head = f"""// Generated by scripts/audit (see docs/audit.md). Do not edit by hand.
// Snapshot: Celo block {block}. All amounts are exact integers in wei (18 decimals), as strings."""
open(f"{OUT}/ledger.js", "w").write(head + f"""
//
// One entry per spender and token (allowances) or per purpose (direct transfers).
// grants[].requested  amount in the proposal transaction
// grants[].replaced   allowance that an `approve` overwrote (0 for increaseAllowance and transfers)
// grants[].effective  change actually applied on-chain (allowance after - before, or the transfer)
// approved            sum of effective amounts. Claimed = approved - live allowance.

export const AUDIT_BLOCK = {block};

export const ledger = {json.dumps(ledger, indent=2)};
""")
open(f"{OUT}/proposals.js", "w").write(head + f"""
//
// CGPs that are not executed on-chain and not rejected, withdrawn or expired in the repository.
// `stage` is the on-chain stage of the governance proposal (Expiration means it can no longer execute).

export const proposals = {json.dumps(pending, indent=2)};
""")
json.dump(ledger, open("ledger.json", "w")); json.dump(pending, open("proposals.json", "w"))
print("ledger", len(ledger), "pending", [(p["cgp"], p["stage"], len(p["requests"])) for p in pending])
