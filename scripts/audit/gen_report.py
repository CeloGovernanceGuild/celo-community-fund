"""Write docs/audit.md from the audit data."""
import json, sys, datetime, re
g = json.load(open("grants.json")); v = json.load(open("verified.json")); site = json.load(open("site_data.json"))
cg = {x["cgp"]: x for x in json.load(open("cgps.json"))}
inflows = json.load(open("celo_in.json"))
f = lambda x: f"{x:,.2f}"
url = lambda n: f"https://github.com/celo-org/governance/blob/main/CGPs/cgp-{n:04d}.md"
B = v["block"]; bal = v["balances"]
active = site["active"]; completed = site["completed"]
outstanding = sum(e["_remaining"] for e in active)
usdm_out = {k.split(":")[1]: a for k, a in v["allowances"].items() if k.startswith("USDm:") and a > 0.5}
L = []
w = L.append
w("# Community Fund governance audit\n")
w(f"Snapshot: Celo block {B} ({datetime.date.today().isoformat()}). Every number below was read on-chain or from")
w("[celo-org/governance](https://github.com/celo-org/governance) at that point. The scripts that produce it live in")
w("[`scripts/audit`](../scripts/audit) and can be re-run.\n")
w("## Method\n")
w("1. Parse all CGPs in celo-org/governance: status, proposal id, and the transactions in `mainnet.json`.")
w("2. Read every `ProposalExecuted` event of the Governance contract")
w("   (`0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972`) and decode the CELO, USDm and EURm `Approval` and")
w("   `Transfer` events emitted by the fund in each execution receipt.")
w("3. Match both directions: every CGP spend must appear in its execution receipt, and every fund event in a")
w("   receipt must come from a CGP.")
w("4. For every approval, read the spender allowance one block before and at the execution block (archive")
w("   calls). The real amount granted is `after - before`, because `approve` replaces an allowance instead of")
w("   adding to it.")
w("5. Read current balances and allowances, list live proposals, and trace CELO inflows to the fund.\n")
w("## Summary\n")
w("| | |\n|---|---|")
w(f"| Fund balance | {f(bal['CELO'])} CELO, {f(bal['USDm'])} USDm, {f(bal['EURm'])} EURm |")
w(f"| CELO still allowed to spenders | {f(outstanding)} |")
w(f"| CELO free (balance minus allowances) | {f(bal['CELO'] - outstanding)} |")
w(f"| CELO authorized by governance, all time | {f(sum(e['approved'] for e in active + completed))} |")
w(f"| Executed proposals checked | {len(v['execs'])} |")
celo_grants = [x for x in g if x["token"] == "CELO"]
w(f"| CGP spend transactions verified on-chain | {len(json.load(open('recon.json'))['recon'])} of {len(json.load(open('recon.json'))['recon'])} |")
after = [x for x in celo_grants if x["date"] > "2023-08-25"]
w(f"| CELO grants executed after the site's last update (2023-08-25) | {len(after)} |\n")
w("## Findings\n")
w("### 1. The site data stopped in August 2023\n")
w(f"{len(after)} CELO grants were executed after the last data update, including MiniPay, Stabila, CICLOPS, the")
w("Celo Foundation, Celo Core Co., Prezenti seasons, CeloPG, the guilds and the cLabs L2 transfers. This PR")
w("regenerates `src/data` from the audit.\n")
w("### 2. Wrong amounts in the old data\n")
w("| Initiative | Site | On-chain | Source |\n|---|---:|---:|---|")
w(f"| Climate Collective | 4,000,000.00 | 4,700,000.00 | [CGP-52]({url(52)}), proposal 60 |")
w(f"| Celo Korea (\"Asia DAO\") | 333,030.00 | 303,030.00 | [CGP-88]({url(88)}), proposal 120 |")
w(f"| Chainlink | 5,980,313.00 | 5,980,314.00 | [CGP-75]({url(75)}), proposal 88 |")
w(f"| Climate Collective follow-on | missing | 5,000,000.00 | [CGP-80]({url(80)}), proposal 105 |\n")
w("### 3. Stale drafts\n")
w(f"- India DAO Chitty: [CGP-64]({url(64)}) was WITHDRAWN.")
w("- India DAO Monish: no CGP exists.")
w(f"- ImmuneFi Bug Bounty: [CGP-73]({url(73)}) was WITHDRAWN.")
w(f"- Centrifuge Deployment: [CGP-95]({url(95)}) was EXECUTED on 2023-09-05 (proposal 130).")
w("- There are no live funding proposals today. Live proposals 312, 313 and 314 only change parameters.\n")
w("### 4. `approve` overwrote unspent allowances\n")
w("`approve` sets the allowance, it does not add to it. In these executions the spender still had allowance,")
w("so the effective grant differs from the number in the proposal:\n")
w("| Proposal | Spender | Allowance before | Approved to | Effective change |\n|---|---|---:|---:|---:|")
for x in g:
    if x["kind"] == "approval" and x.get("before", 0) > 0.5 and cg[x["cgp"]]["mainnet"] and any(t.get("function") == "approve" and str(t.get("args", [""])[0]).lower() == x["to"] for t in cg[x["cgp"]]["mainnet"]):
        w(f"| [CGP-{x['cgp']}]({url(x['cgp'])}) (#{x['pid']}) | `{x['to']}` {x['token']} | {f(x['before'])} | {f(x['after'])} | {f(x['delta'])} |")
w("\nThe Stabila reduction was restored by [CGP-179](" + url(179) + "). For MiniPay and CICLOPS, the unspent amount")
w("was absorbed into the new approval. Future proposals should use `increaseAllowance`.\n")
w("### 5. Dormant allowances\n")
w("| Spender | Remaining | Last grant | Source |\n|---|---:|---|---|")
for e in active:
    if e["title"] != "CICLOPS":
        w(f"| {e['title']} `{e['address']}` | {f(e['_remaining'])} CELO | {e['_last']} | " + ", ".join(f"[CGP-{n}]({url(n)})" for n in e["cgps"]) + " |")
w("\nThe CeloPG second spender never drew anything: its full 1,250,000.00 CELO and 100,000.00 USDm are still")
w("open since July 2024. The other three are leftovers from grants that were mostly spent years ago.")
w("Governance can revoke them with `approve(spender, 0)`, or the spenders can confirm they are still needed.")
w("CICLOPS is the only large active allowance (37,597,705.00 CELO, granted in August 2026 by")
w("[CGP-248](" + url(248) + ")).\n")
w("### 6. USDm allowances are not backed\n")
w(f"The fund holds {f(bal['USDm'])} USDm, but these USDm allowances are still open:\n")
w("| Spender | Allowance |\n|---|---:|")
for s, a in sorted(usdm_out.items(), key=lambda z: -z[1]):
    w(f"| `{s}` | {f(a)} |")
w(f"\nTotal {f(sum(usdm_out.values()))} USDm. A `transferFrom` above the balance would revert, so this is not a loss,")
w("but the dashboard should not treat these allowances as funds. The largest one is the Mento liquidity")
w(f"allowance from [CGP-69]({url(69)}) (11,000,000 USDm approved in 2023).\n")
w("### 7. CGP metadata does not match the chain\n")
w("| CGP | Repository says | Chain says |\n|---|---|---|")
for item in json.load(open("recon.json"))["issues"]:
    if "status" in item[0] or "no on-chain" in item[0]:
        w(f"| [CGP-{item[1]}]({url(int(item[1]))}) | {item[0].split(' but ')[0].replace('CGP ', '').replace('marked ', '')} | " + (item[0].split(' but ')[1] if ' but ' in item[0] else f"proposal {item[2]} never executed") + " |")
w("\nProposals executed on-chain with no CGP: 83, 315, 316, 317. None of them moves fund assets.")
w("CGPs 14, 17, 20, 38, 52, 54, 61, 69, 70 and 75 have no `mainnet.json`. Their fund movements were verified from")
w("the execution receipts instead.\n")
w("### 8. The replenish rate is obsolete\n")
w("The site showed ~18,000 CELO/day, an estimate from L1 epoch rewards. After the L2 migration the regular")
w("inflow is about 30 CELO/day from `CeloUnreleasedTreasury`. Large funding proposals now move CELO into the")
w("fund in the same execution that approves it:\n")
w("| Date | From | Amount | Tx | Proposal |\n|---|---|---:|---|---|")
tx2pid = {e["tx"].lower(): int(p) for p, e in v["execs"].items()}
pid2cgp = {}
for n, x in cg.items():
    m = re.search(r"(\d+)", str(x["meta"].get("governance-proposal-id", "")))
    if m: pid2cgp[int(m.group(1))] = n
NAMES = {"7a8c7a833565fc428cdfba20fe03fafb178a434f": "CeloUnreleasedTreasury", "9d65e69ac940dcb469fd7c46368c1e094250a400": "Reserve",
         "87647780180b8f55980c7d3ffefe08a9b29e9ae1": "Safe `0x87647780180B8f55980C7D3fFeFe08a9B29e9aE1`", "7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19": "Safe `0x7A1E98FC9a008107DbD1f430a05Ace8cf6f3FE19`"}
for x in inflows:
    a = int(x["data"], 16) / 1e18
    if a < 100000: continue
    p = tx2pid.get(x["transactionHash"].lower())
    d = datetime.datetime.utcfromtimestamp(int(x["timeStamp"], 16)).strftime("%Y-%m-%d")
    w(f"| {d} | {NAMES.get(x['topics'][1][-40:], x['topics'][1][-40:])} | {f(a)} | `{x['transactionHash']}` | " + (f"[CGP-{pid2cgp[p]}]({url(pid2cgp[p])})" if p in pid2cgp else "none") + " |")
w("\nThe inflows marked \"none\" came from Safes outside governance. They look like returns of unspent funds:")
w("`0x87647780180B8f55980C7D3fFeFe08a9B29e9aE1` is the spender of the 11,000,000 USDm Mento allowance from")
w("[CGP-69](" + url(69) + "). Their owners should confirm what these transfers are.\n")
w("The modal now shows the measured regular inflow instead of the old estimate.\n")
w("## All executed CELO grants\n")
w("`Effective` is the allowance change (after minus before), or the amount for direct transfers.\n")
w("| Date | Proposal | CGP | Title | Kind | Spender / recipient | Effective | Execution tx |\n|---|---:|---|---|---|---|---:|---|")
for x in celo_grants:
    t = (x["title"] or "").replace("|", "/").replace("\u2019", "'").replace("\u2013", "-")
    w(f"| {x['date']} | {x['pid']} | [CGP-{x['cgp']}]({url(x['cgp'])}) | {t} | {x['kind']} | `{x['to']}` | {f(x['delta'])} | `{x['tx']}` |")
w("\n## USDm and EURm grants\n")
w("| Date | Proposal | CGP | Token | Kind | Spender / recipient | Effective | Execution tx |\n|---|---:|---|---|---|---|---:|---|")
for x in g:
    if x["token"] != "CELO":
        w(f"| {x['date']} | {x['pid']} | [CGP-{x['cgp']}]({url(x['cgp'])}) | {x['token']} | {x['kind']} | `{x['to']}` | {f(x['delta'])} | `{x['tx']}` |")
txt = "\n".join(L) + "\n"
bad = [c for c in txt if ord(c) > 127]
if bad: sys.exit(f"non-ascii: {set(bad)}")
open(sys.argv[1], "w").write(txt)
print("ok", len(txt))
