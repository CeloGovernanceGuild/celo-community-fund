"""Every fund grant executed by governance, with its exact effective amount in wei.

For approvals the effective amount is the allowance after the execution minus the allowance one
block before it, because `approve` replaces an allowance instead of adding to it.
"""
import datetime, json, re
from common import allowance

v = json.load(open("verified.json"))
cgps = json.load(open("cgps.json"))
spends = json.load(open("spends.json"))
titles = {x["cgp"]: x["meta"].get("title") for x in cgps}
meta = {int(p): (n, titles.get(n)) for p, n in v["cgp_of"].items()}
declared = {}  # (cgp, token, spender) -> (function, amount) from mainnet.json
for s in spends:
    if s["to"] and s["amount"]:
        declared[(s["cgp"], s["token"], s["to"].lower())] = (s["fn"], int(s["amount"]))

grants = []
for pid, events in sorted((int(k), e) for k, e in v["onchain"].items()):
    ex = v["execs"][str(pid)]
    cgp, title = meta.get(pid, (None, None))
    approved_here = {(e["token"], e["to"].lower()) for e in events if e["kind"] == "approval"}
    for e in events:
        # A transfer to a spender approved in the same execution is that spender pulling the
        # allowance (transferFrom) inside the transaction: a claim, not a second grant.
        if e["kind"] == "transfer" and (e["token"], e["to"].lower()) in approved_here:
            continue
        to = e["to"].lower()
        g = {"pid": pid, "cgp": cgp, "title": title, "tx": ex["tx"], "block": ex["block"],
             "date": datetime.datetime.fromtimestamp(ex["ts"], datetime.timezone.utc).strftime("%Y-%m-%d"),
             "token": e["token"], "kind": e["kind"], "to": to}
        fn, amount = declared.get((cgp, e["token"], to), (None, None))
        if e["kind"] == "approval":
            before = allowance(e["token"], to, hex(ex["block"] - 1))
            after = int(e["amount"])
            g.update(function=fn or "approve", before=str(before), after=str(after), effective=str(after - before),
                     requested=str(amount if amount is not None else after - before))
        else:
            g.update(function="transfer", effective=e["amount"], requested=e["amount"])
        grants.append(g)
json.dump(grants, open("grants.json", "w"), indent=1)
print("grants", len(grants))
