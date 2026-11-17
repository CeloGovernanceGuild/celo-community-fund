"""Fund spend transactions (approve / increaseAllowance / transfer) declared in CGP mainnet.json files."""
import json
from common import CGP_CONTRACTS

rows = []
for x in json.load(open("cgps.json")):
    if not isinstance(x["mainnet"], list):
        continue
    m = x["meta"]
    for i, t in enumerate(x["mainnet"]):
        c, f = t.get("contract"), t.get("function") or ""
        if (c in CGP_CONTRACTS and f in ("transfer", "approve", "increaseAllowance")) or f.startswith("transfer(address"):
            args = t.get("args", [])
            rows.append({"cgp": x["cgp"], "status": m.get("status", "").upper(), "pid": m.get("governance-proposal-id"),
                         "title": m.get("title"), "idx": i, "token": CGP_CONTRACTS.get(c, c or t.get("address")),
                         "fn": f, "to": args[0] if args else None, "amount": str(int(str(args[1]))) if len(args) > 1 else None})
json.dump(rows, open("spends.json", "w"), indent=1)
print("spends", len(rows))
