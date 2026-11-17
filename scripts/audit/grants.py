"""Every fund grant executed by governance with its real allowance delta (allowance after - before)."""
import json, re, time, urllib.request, datetime
RPC = "https://forno.celo.org"
GOV = "d533ca259b330c7a88f74e000a3faea2d63b7972"
TOKADDR = {"CELO": "0x471EcE3750Da237f93B8E339c536989b8978a438", "USDm": "0x765DE816845861e75A25fCA122bb6898B8B1282a", "EURm": "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73"}
def rpc1(method, params):
    b = json.dumps({"jsonrpc": "2.0", "id": 1, "method": method, "params": params}).encode()
    for t in range(8):
        try:
            r = urllib.request.Request(RPC, data=b, headers={"Content-Type": "application/json", "User-Agent": "ccf-audit/1.0"})
            res = json.load(urllib.request.urlopen(r, timeout=60)).get("result")
            if res is not None: return res
        except Exception: pass
        time.sleep(1.5 * (t + 1))
    raise SystemExit(f"rpc failed {method} {params}")
def allowance(tok, sp, block):
    data = "0xdd62ed3e" + GOV.rjust(64, "0") + sp[2:].lower().rjust(64, "0")
    return int(rpc1("eth_call", [{"to": TOKADDR[tok], "data": data}, hex(block)]), 16) / 1e18
v = json.load(open("verified.json")); cgps = json.load(open("cgps.json"))
title = {}
for x in cgps:
    m = re.search(r"(\d+)", str(x["meta"].get("governance-proposal-id", "")))
    if m: title[int(m.group(1))] = (x["cgp"], x["meta"].get("title"))
grants = []
for p, evs in sorted(((int(k), e) for k, e in v["onchain"].items())):
    ex = v["execs"][str(p)]
    for e in evs:
        g = {"pid": p, "cgp": title.get(p, (None,))[0], "title": title.get(p, (None, None))[1],
             "date": datetime.datetime.utcfromtimestamp(ex["ts"]).strftime("%Y-%m-%d"), "tx": ex["tx"], "block": ex["block"],
             "token": e["token"], "kind": e["kind"], "to": e["to"]}
        if e["kind"] == "approval":
            before = allowance(e["token"], e["to"], ex["block"] - 1)
            g.update(before=before, after=e["amount"], delta=e["amount"] - before)
        else:
            g.update(delta=e["amount"])
        grants.append(g)
json.dump(grants, open("grants.json", "w"), indent=1)
for g in grants:
    print(g["date"], f'pid={g["pid"]:<4}', f'cgp={g["cgp"]}', g["token"], g["kind"][:5], g["to"], f'{g["delta"]:>16,.2f}', (f'(before {g["before"]:,.2f})' if g.get("before") else ""), (g["title"] or "")[:40])
