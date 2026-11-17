import json, re, datetime
cgps = {x["cgp"]: x for x in json.load(open("cgps.json"))}
spends = json.load(open("spends.json"))
v = json.load(open("verified.json"))
onchain = {int(k): e for k, e in v["onchain"].items()}
execs = {int(k): e for k, e in v["execs"].items()}
def pid_of(meta):
    m = re.search(r"(\d+)", str(meta.get("governance-proposal-id", "")))
    return int(m.group(1)) if m else None
day = lambda p: datetime.datetime.utcfromtimestamp(execs[p]["ts"]).strftime("%Y-%m-%d")

issues = []
# C. CGPs marked EXECUTED without an on-chain execution
for n, x in sorted(cgps.items()):
    st = x["meta"].get("status", "").upper(); p = pid_of(x["meta"])
    if st == "EXECUTED" and (p is None or p not in execs):
        issues.append(("CGP marked EXECUTED, no on-chain ProposalExecuted", n, p, x["meta"].get("title")))
    if st != "EXECUTED" and p in execs:
        issues.append((f"CGP status {st} but proposal executed on-chain {day(p)}", n, p, x["meta"].get("title")))
# D. executed proposals with fund events but no CGP
by_pid = {}
for n, x in cgps.items():
    p = pid_of(x["meta"])
    if p is not None: by_pid.setdefault(p, []).append(n)
for p, evs in sorted(onchain.items()):
    if evs and p not in by_pid:
        issues.append(("On-chain fund spend with no CGP", None, p, evs))
# A/B. compare per proposal
recon = []
for p, evs in sorted(onchain.items()):
    cg = by_pid.get(p, [])
    rows = [s for s in spends if s["cgp"] in cg and s["status"] == "EXECUTED"]
    matched = set()
    for s in rows:
        hit = None
        for i, e in enumerate(evs):
            if i in matched: continue
            if e["token"] == s["token"] and e["to"].lower() == str(s["to"]).lower():
                if s["fn"] == "transfer" and e["kind"] == "transfer" and int(e["amount"]) == int(s["amount"]): hit = i
                elif s["fn"] == "approve" and e["kind"] == "approval" and int(e["amount"]) == int(s["amount"]): hit = i
                elif s["fn"] == "increaseAllowance" and e["kind"] == "approval": hit = i
                if hit is not None: break
        if hit is None and s["fn"] == "transfer(address,uint256)":
            hit = -1
        if hit is None:
            issues.append(("CGP spend not found in execution receipt", s["cgp"], p, f'{s["fn"]} {s["token"]} {s["to"]} {s["amount"]}'))
        elif hit >= 0:
            matched.add(hit)
        recon.append({"pid": p, "cgp": s["cgp"], "date": day(p), "title": s["title"], "fn": s["fn"], "token": s["token"], "to": s["to"],
                      "amount": s["amount"], "allowance_after_exec": evs[hit]["amount"] if hit is not None and hit >= 0 and evs[hit]["kind"] == "approval" else None,
                      "tx": execs[p]["tx"], "verified": hit is not None})
    for i, e in enumerate(evs):
        if i not in matched and not any(r["pid"] == p and r["fn"].startswith("transfer(") for r in recon):
            issues.append(("Execution receipt has a fund event not in CGP mainnet.json", cg, p, e))
json.dump({"recon": recon, "issues": [list(map(str, i)) for i in issues]}, open("recon.json", "w"), indent=1)
print("verified rows:", sum(r["verified"] for r in recon), "/", len(recon))
for i in issues: print(" -", i)
