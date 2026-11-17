"""Write docs/audit.md from the audit data. Every amount is exact (wei precision, no rounding)."""
import datetime, json, re, sys
from common import fmt

OUT = sys.argv[1]
g = json.load(open("grants.json")); v = json.load(open("verified.json"))
cg = {x["cgp"]: x for x in json.load(open("cgps.json"))}
recon = json.load(open("recon.json")); inflows = json.load(open("celo_in.json"))
ledger = json.load(open("ledger.json")); pending = json.load(open("proposals.json"))
url = lambda n: f"https://github.com/celo-org/governance/blob/main/CGPs/cgp-{n:04d}.md"
cgp_link = lambda n: f"[CGP-{n}]({url(n)})"
B = v["block"]; bal = {k: int(x) for k, x in v["balances"].items()}
remaining = lambda e: int(v["allowances"].get(f"{e['token']}:{e['address']}", "0")) if e["kind"] == "allowance" else 0
ASCII = {"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u2013": "-", "\u2014": "-", "\u20ae": "T"}


def clean(text):
    """ASCII-only title for the report: map common symbols, drop anything else."""
    text = "".join(ASCII.get(c, c) for c in (text or "")).replace("|", "/").replace("\\$", "$")
    return text.encode("ascii", "ignore").decode()

L = []; w = L.append
w("# Community Fund governance audit\n")
w(f"Snapshot: Celo block {B} ({datetime.date.today().isoformat()}). Every number was read on-chain or from")
w("[celo-org/governance](https://github.com/celo-org/governance) at that block. Amounts are exact to the wei:")
w("nothing is rounded. The scripts that produce this report and `src/data` live in [`scripts/audit`](../scripts/audit).\n")
w("## Method\n")
w("1. Parse all CGPs in celo-org/governance: status, proposal id, and the transactions in `mainnet.json`.")
w("2. Read every `ProposalExecuted` event of the Governance contract")
w("   (`0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972`) and decode the CELO, USDm and EURm `Approval` and")
w("   `Transfer` events emitted by the fund in each execution receipt.")
w("3. Match both directions: every CGP spend must appear in its execution receipt, and every fund event in a")
w("   receipt must come from a CGP.")
w("4. For every approval, read the spender allowance one block before and at the execution block (archive")
w("   calls). The effective amount is `after - before`, because `approve` replaces an allowance instead of")
w("   adding to it.")
w("5. For each spender: approved = sum of effective amounts, remaining = current allowance,")
w("   claimed = approved - remaining. Allowances only go down through `transferFrom`, so this is exact.")
w("6. Read current balances, the on-chain stage of pending proposals, and trace CELO inflows to the fund.\n")

out = {t: sum(remaining(e) for e in ledger if e["token"] == t) for t in ("CELO", "USDm", "EURm")}
w("## Summary\n")
w("| Token | Fund balance | Open allowances | Balance minus open allowances |\n|---|---:|---:|---:|")
for t in ("CELO", "USDm", "EURm"):
    w(f"| {t} | {fmt(bal[t])} | {fmt(out[t])} | {fmt(bal[t] - out[t])} |")
n_recon = len(recon["recon"])
after = [x for x in g if x["token"] == "CELO" and x["date"] > "2023-08-25"]
w(f"\n- Executed proposals checked: {len(v['execs'])}")
w(f"- CGP spend transactions verified against execution receipts: {sum(r['verified'] for r in recon['recon'])} of {n_recon}")
w(f"- CELO grants executed after the site's previous data update (2023-08-25): {len(after)}")
w(f"- Pending CGPs with an on-chain proposal that can still execute: {sum(1 for p in pending if p['stage'] not in (None, 'Expiration'))}\n")

w("## Ledger\n")
w("One line per spender and token. `Claimed` is what the spender already pulled from the fund.")
w("Entries with a remaining allowance, however small, are listed as open.\n")
w("| Initiative | Token | Approved | Claimed | Remaining | Status | CGPs |\n|---|---|---:|---:|---:|---|---|")
for e in ledger:
    a = int(e["approved"]); r = remaining(e)
    w(f"| {e['title']} | {e['token']} | {fmt(a)} | {fmt(a - r)} | {fmt(r)} | {'open' if r > 0 else ('transfer' if e['kind'] == 'transfer' else 'fully claimed')} | " + ", ".join(cgp_link(n) for n in e["cgps"]) + " |")

w("\n## Findings\n")
w("### 1. The site data stopped in August 2023\n")
w(f"{len(after)} CELO grants were executed after the last manual data update. `src/data/ledger.js` is now generated from this audit.\n")
w("### 2. Wrong amounts in the old data\n")
w("| Initiative | Old site | On-chain | Source |\n|---|---:|---:|---|")
w(f"| Climate Collective | 4,000,000 | 4,700,000 | {cgp_link(52)}, proposal 60 |")
w(f"| Celo Korea (\"Asia DAO\") | 333,030 | 303,030 | {cgp_link(88)}, proposal 120 |")
w(f"| Chainlink | 5,980,313 | 5,980,314 | {cgp_link(75)}, proposal 88 |")
w(f"| Climate Collective follow-on | missing | 5,000,000 | {cgp_link(80)}, proposal 105 |\n")
w("### 3. Stale drafts\n")
w(f"- India DAO Chitty: {cgp_link(64)} was WITHDRAWN.")
w("- India DAO Monish: no CGP exists.")
w(f"- ImmuneFi Bug Bounty: {cgp_link(73)} was WITHDRAWN.")
w(f"- Centrifuge Deployment: {cgp_link(95)} was EXECUTED on 2023-09-05 (proposal 130).\n")
w("### 4. `approve` overwrote unspent allowances\n")
w("| Proposal | Spender | Token | Allowance before | Approved to | Effective change |\n|---|---|---|---:|---:|---:|")
for x in g:
    if x["kind"] == "approval" and x["function"] == "approve" and int(x["before"]) > 0:
        w(f"| {cgp_link(x['cgp'])} (#{x['pid']}) | `{x['to']}` | {x['token']} | {fmt(int(x['before']))} | {fmt(int(x['after']))} | {fmt(int(x['effective']))} |")
w(f"\nThe Stabila reduction was restored by {cgp_link(179)}. Future proposals should use `increaseAllowance`.\n")
w("### 5. Open allowances\n")
w("| Initiative | Token | Remaining | Last grant | Spender |\n|---|---|---:|---|---|")
for e in ledger:
    r = remaining(e)
    if r > 0:
        w(f"| {e['title']} | {e['token']} | {fmt(r)} | {e['grants'][-1]['date']} | `{e['address']}` |")
w("\nThe CeloPG H2 2024 second spender never claimed anything since July 2024. Old leftovers can be revoked")
w("by governance with `approve(spender, 0)` or confirmed by their spenders.\n")
w("### 6. USDm allowances are not backed\n")
w(f"The fund holds {fmt(bal['USDm'])} USDm against {fmt(out['USDm'])} USDm of open allowances. A `transferFrom`")
w("above the balance reverts, so this is not a loss, but those allowances are not funds.\n")
w("### 7. CGP metadata does not match the chain\n")
w("| CGP | Repository | Chain |\n|---|---|---|")
for item in recon["issues"]:
    if "status" in item[0] or "no on-chain" in item[0]:
        chain = item[0].split(" but ")[1] if " but " in item[0] else f"proposal {item[2]} never executed"
        w(f"| {cgp_link(int(item[1]))} | {item[0].split(' but ')[0].replace('CGP ', '').replace('marked ', '')} | {chain} |")
for p in pending:
    if p["stage"] == "Expiration":
        w(f"| {cgp_link(p['cgp'])} | status {p['status']} | proposal {p['proposalId']} expired |")
w("\nProposals executed on-chain with no CGP: 83, 315, 316, 317. None of them moves fund assets.")
w("CGPs 14, 17, 20, 38, 52, 54, 61, 69, 70 and 75 have no `mainnet.json`; their fund movements were taken from the")
w("execution receipts.\n")
w("### 8. Inflows and replenish rate\n")
w("After the L2 migration the regular inflow is about 30 CELO/day from `CeloUnreleasedTreasury`. Large grants are")
w("funded in the same execution that approves them. Inflows of 100,000 CELO or more in the last year:\n")
w("| Date | From | Amount | Tx | Proposal |\n|---|---|---:|---|---|")
tx2pid = {e["tx"].lower(): int(p) for p, e in v["execs"].items()}
pid2cgp = {}
for n, x in cg.items():
    m = re.search(r"(\d+)", str(x["meta"].get("governance-proposal-id", "")))
    if m: pid2cgp[int(m.group(1))] = n
SRC = {"7a8c7a833565fc428cdfba20fe03fafb178a434f": "CeloUnreleasedTreasury", "9d65e69ac940dcb469fd7c46368c1e094250a400": "Reserve"}
for x in inflows:
    a = int(x["data"], 16)
    if a < 100000 * 10**18: continue
    p = tx2pid.get(x["transactionHash"].lower()); frm = x["topics"][1][-40:]
    d = datetime.datetime.fromtimestamp(int(x["timeStamp"], 16), datetime.timezone.utc).strftime("%Y-%m-%d")
    w(f"| {d} | {SRC.get(frm, '`0x' + frm + '`')} | {fmt(a)} | `{x['transactionHash']}` | " + (cgp_link(pid2cgp[p]) if p in pid2cgp else "none") + " |")
w("\nInflows with no proposal came from Safes outside governance. `0x87647780180b8f55980c7d3ffefe08a9b29e9ae1` is the")
w(f"spender of the Mento USDm/USDC liquidity allowance from {cgp_link(69)}. Their owners should confirm what these transfers are.\n")
w("## Pending proposals\n")
if pending:
    w("| CGP | Status | Proposal | On-chain stage | Fund requests |\n|---|---|---:|---|---|")
    for p in pending:
        req = "; ".join(f"{r['function']} {fmt(int(r['amount']))} {r['token']} to `{r['to']}`" for r in p["requests"]) or "none"
        w(f"| {cgp_link(p['cgp'])} {clean(p['title'])} | {p['status']} | {p['proposalId'] or '-'} | {p['stage'] or 'not submitted'} | {req} |")
w("\n## Every grant\n")
w("`Replaced` is the allowance an `approve` overwrote. `Effective` is what changed on-chain.\n")
w("| Date | Proposal | CGP | Title | Token | Function | To | Requested | Replaced | Effective | Execution tx |\n|---|---:|---|---|---|---|---|---:|---:|---:|---|")
for x in g:
    rep = x.get("before", "0") if x["function"] == "approve" else "0"
    w(f"| {x['date']} | {x['pid']} | {cgp_link(x['cgp'])} | {clean(x['title'])} | {x['token']} | {x['function']} | `{x['to']}` | {fmt(int(x['requested']))} | {fmt(int(rep))} | {fmt(int(x['effective']))} | `{x['tx']}` |")
txt = "\n".join(L) + "\n"
bad = {c for c in txt if ord(c) > 127}
if bad: sys.exit(f"non-ascii characters in report: {bad}")
open(OUT, "w").write(txt)
print("report ok", len(txt))
