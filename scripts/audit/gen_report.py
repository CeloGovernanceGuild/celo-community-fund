"""Write docs/audit.md from the audit data. Every amount is exact (wei precision, no rounding)."""
import datetime, json, os, re, sys
from common import fmt, rpc

OUT = sys.argv[1]
g = json.load(open("grants.json")); v = json.load(open("verified.json"))
cg = {x["cgp"]: x for x in json.load(open("cgps.json"))}
recon = json.load(open("recon.json")); flow_audit = json.load(open("celo_in.json"))
flows = flow_audit["flows"]
ledger = json.load(open("ledger.json")); pending = json.load(open("proposals.json"))
# The report must describe the ledger that is published. gen_data.py writes both copies; if they
# differ, this directory holds a stale run (for example after NAMES changed) and the report would
# silently revert it.
_published = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "data", "ledger.js")).read()
_published = json.loads(_published[_published.index("export const ledger = ") + len("export const ledger = "):].rsplit(";", 1)[0])
if _published != ledger:
    raise SystemExit("ledger.json does not match src/data/ledger.js: run gen_data.py before gen_report.py")
pid2cgp = {int(p): n for p, n in v["cgp_of"].items()}
mondo = {x["id"]: x for x in (json.load(open("mondo.json")) if os.path.exists("mondo.json") else []) if x.get("id")}
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
def _signers(address, threshold_selector):
    """Owners and required confirmations of a multisig at the audit block."""
    call = lambda data: rpc("eth_call", [{"to": address, "data": data}, hex(B)])
    owners = call("0xa0e67e2b")  # getOwners()
    return int(call(threshold_selector), 16), int(owners[66:130], 16)


approver_needed, approver_owners = _signers("0x41822d8A191fcfB1cfcA5F7048818aCd8eE933d3", "0xdc8452cd")  # required()
safe_needed, safe_owners = _signers("0x7A1E98FC9a008107DbD1f430a05Ace8cf6f3FE19", "0xe75235b8")  # getThreshold()
w("## Who moves the money\n")
w("- **The fund** is the Governance contract (`0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972`). It only pays out when a")
w("  proposal executes: an `approve` or `increaseAllowance` that the recipient later draws down, or a direct `transfer`.")
w("- **Governance approver multisig** (`0x41822d8A191fcfB1cfcA5F7048818aCd8eE933d3`, read from `Governance.approver()`): it has to")
w(f"  approve a proposal before it can execute. {approver_needed} confirmations of {approver_owners} owners at block {B}.")
w(f"- **Celo Operations Safe** (`0x7A1E98FC9a008107DbD1f430a05Ace8cf6f3FE19`, {safe_needed} of {safe_owners} owners at block {B}): the only extra")
w("  beneficiary registered in the FeeHandler (`0xcD437749E43A154C07F3553504c68fBfD56B8778`), under the name `cLabs`. It also")
w("  receives the sequencer fee vault (`0x4200000000000000000000000000000000000011`) and sends the net revenue to the fund.")
w("  It is not part of governance and its payments have no proposal; see finding 8.\n")
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
w("6. Read current balances, the on-chain stage of pending proposals, and trace CELO flows to and from the fund. "
  "The trace includes both CELO `Transfer` logs and native-value calls, then reconciles their net amount to the "
  "fund's CELO balance change.\n")

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
w("\nThe CeloPG x Optimism matching budget (PG <> OP multisig) was never claimed: it was only to be used if Optimism approved a joint grant program. Old leftovers can be revoked")
w("by governance with `approve(spender, 0)` or confirmed by their spenders.\n")
w("### 6. USDm allowances are not backed\n")
w(f"The fund holds {fmt(bal['USDm'])} USDm against {fmt(out['USDm'])} USDm of open allowances. A `transferFrom`")
w("above the balance reverts, so this is not a loss, but those allowances are not funds.\n")
w("### 7. CGP metadata does not match the chain\n")
w("| CGP | Repository | Chain |\n|---|---|---|")
for item in recon["issues"]:
    if "status" in item[0] or "no on-chain" in item[0] or "governance-proposal-id" in item[0]:
        adopted = mondo.get(int(item[2]) if item[2].isdigit() else -1, {}).get("stage") == 9
        chain = item[0].split(" but ")[1] if " but " in item[0] else (
            f"proposal {item[2]} was not executed" + (" (Mondo: adopted, a vote with nothing to execute)" if adopted else ""))
        w(f"| {cgp_link(int(item[1]))} | {item[0].split(' but ')[0].replace('CGP ', '').replace('marked ', '')} | {chain} |")
for p in pending:
    if p["stage"] == "Expiration":
        w(f"| {cgp_link(p['cgp'])} | status {p['status']} | proposal {p['proposalId']} expired |")
no_cgp = sorted(int(p) for p in v["execs"] if int(p) not in pid2cgp)
moving = [p for p in no_cgp if v["onchain"][str(p)]]
w(f"\nProposals executed on-chain with no CGP: {', '.join(map(str, no_cgp)) or 'none'}."
  + (" None of them moves fund assets." if not moving else f" Moving fund assets: {moving}."))
w("A proposal is matched to the CGP that declares its id; proposals no CGP declares are matched by the description")
w("URL they were queued with on-chain, so a CGP that expired and was re-submitted under a new proposal id is")
w("followed to the attempt that executed.")
w("CGPs 14, 17, 20, 38, 52, 54, 61, 69, 70 and 75 have no `mainnet.json`; their fund movements were taken from the")
w("execution receipts.\n")
w("### 8. CELO flow reconciliation\n")
w("Inflows of 100,000 CELO or more in the last year. Blockscout's CELO transfer index includes both")
w("ERC-20 transfers and CELO value calls inside transactions (for example, a Safe execution), even where")
w("the latter has no canonical ERC-20 `Transfer` log.\n")
w("| Date | From | Amount | Tx | Proposal |\n|---|---|---:|---|---|")
tx2pid = {e["tx"].lower(): int(p) for p, e in v["execs"].items()}
SRC = {
    "0x7a8c7a833565fc428cdfba20fe03fafb178a434f": "CeloUnreleasedTreasury",
    "0x9d65e69ac940dcb469fd7c46368c1e094250a400": "Celo Governance Reserve",
    "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1": "Mento Reserve Safe",
    "0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19": "Celo Operations Safe (L2 sequencer revenue)",
}
# Inflows that follow from a proposal without being part of its on-chain execution.
SRC_CGP = {"0x87647780180b8f55980c7d3ffefe08a9b29e9ae1": 253}
mento_return = False
for x in flows:
    if x["direction"] != "in":
        continue
    a = int(x["amount"])
    if a < 100000 * 10**18:
        continue
    p = tx2pid.get(x["tx"])
    cgp = pid2cgp.get(p) or SRC_CGP.get(x["from"])
    mento_return = mento_return or x["from"] in SRC_CGP
    d = datetime.datetime.fromtimestamp(x["timestamp"], datetime.timezone.utc).strftime("%Y-%m-%d")
    w(f"| {d} | {SRC.get(x['from'], '`' + x['from'] + '`')} | {fmt(a)} | `{x['tx']}` | " + (cgp_link(cgp) if cgp else "none") + " |")
r = flow_audit["reconciliation"]
w("\n| Reconciliation item | CELO |\n|---|---:|")
w(f"| Opening balance (block {flow_audit['from_block'] - 1}) | {fmt(int(r['balance_start']))} |")
w(f"| Inflows seen | {fmt(int(r['incoming']))} |")
w(f"| Outflows seen | -{fmt(int(r['outgoing']))} |")
w(f"| Observed net flows | {fmt(int(r['observed_delta']))} |")
w(f"| Closing balance (block {flow_audit['to_block']}) | {fmt(int(r['balance_end']))} |")
w(f"| Balance change | {fmt(int(r['balance_delta']))} |")
w(f"| Unexplained difference | {fmt(int(r['unexplained']))} |\n")
if flow_audit.get("recovered_from_rpc"):
    w(f"Blockscout's index missed {flow_audit['recovered_from_rpc']} `Transfer` log(s) in this window. Each one was located by")
    w("bisecting the balance against the recorded flows and read from the node, so it is included above.\n")
if int(r["unexplained"]):
    w("**Warning:** the CELO flow scan does not reconcile to the balance change; review the unexplained difference before relying on the inflow totals.\n")
if any(x["direction"] == "in" and x["from"] == "0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19" for x in flows):
    w("The Celo Operations Safe (`0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19`, 2 of 5) collects the network's fee revenue from the")
    w("FeeHandler and the sequencer fee vault and sends the net amount to the fund, with no governance proposal per payment.")
    w("Celo Core Co. reports each payment, with its period and deductions, in")
    w("[Initiating Ongoing Celo Chain Revenue Transactions](https://forum.celo.org/t/initiating-ongoing-celo-chain-revenue-transactions/13494).\n")
dep = json.load(open("deposits.json")); dt = {k: int(x) for k, x in dep["totals"].items()}
outcomes = [d["outcome"] for d in dep["deposits"]]
w("**Proposal deposits.** Submitting a proposal sends a deposit to the Governance contract, which is the fund. When the")
w("proposal leaves the queue the deposit becomes withdrawable by its proposer; if it expires in the queue it is forfeited")
w(f"and stays in the fund. Of the {len(outcomes)} proposals ever submitted, {outcomes.count('dequeued')} left the queue,")
w(f"{outcomes.count('in queue')} are in the queue and {outcomes.count('expired in queue')} expired in it.\n")
w("| Proposal deposits, all time | CELO |\n|---|---:|")
w(f"| Deposited | {fmt(dt['deposited'])} |")
w(f"| Withdrawn by proposers | {fmt(dt['withdrawn'])} |")
w(f"| Withdrawable, not withdrawn yet | {fmt(dt['refundable_not_withdrawn'])} |")
w(f"| In the queue | {fmt(dt['in_queue'])} |")
w(f"| Forfeited to the fund | {fmt(dt['forfeited'])} |\n")
w(f"The {fmt(dt['refundable_not_withdrawn'] + dt['in_queue'])} CELO not withdrawn yet is in the fund's balance but belongs to the proposers,")
w("so the site subtracts it from the available amount. The deposits still withdrawable, by proposal:\n")
# `withdraw` pays out a proposer's whole balance, so what is still withdrawable is the deposits
# of its most recent proposals.
MONDO_STAGE = {5: "expired", 6: "executed", 7: "withdrawn", 8: "rejected"}
w("| Proposal | Submitted | Deposit (CELO) | CGP | Outcome | Proposer | Submission tx |\n|---|---|---:|---|---|---|---|")
for addr, amount in sorted(dep["claimable"].items(), key=lambda kv: -int(kv[1])):
    held, covered = [], 0
    for d in reversed([d for d in dep["deposits"] if d["proposer"] == addr]):
        if covered >= int(amount):
            break
        held.append(d); covered += int(d["deposit"])
    for d in reversed(held):
        pid = d["proposal"]; n = pid2cgp.get(pid) or mondo.get(pid, {}).get("cgp")
        title = clean((cg.get(n, {}).get("meta") or {}).get("title") or mondo.get(pid, {}).get("title") or "")
        outcome = "executed" if str(pid) in v["execs"] else MONDO_STAGE.get(mondo.get(pid, {}).get("stage"), "not executed")
        note = "" if covered == int(amount) else " (partial match)"
        w(f"| {pid} | {d['date']} | {fmt(int(d['deposit']))} | " + (f"{cgp_link(n)} {title}" if n else "none") + f" | {outcome}{note} | `{addr}` | `{d['tx']}` |")
w("")
if mento_return:
    w(f"The Mento Reserve Safe return is governed by {cgp_link(253)}. It is distinct from the Celo Governance")
    w("Reserve and is shown as an inflow, not as a locked deduction from the fund.\n")
w("### 9. Cross-check with Mondo\n")
if mondo:
    ours = {int(p) for p in v["execs"]}
    theirs = {i for i, x in mondo.items() if x["stage"] == 6}
    w(f"[Mondo](https://mondo.celo.org/governance), the Celo governance app, lists {len(mondo)} proposals, {len(theirs)} of them executed.")
    w(f"- Executed on-chain and executed in Mondo: {len(ours & theirs)}")
    w(f"- Executed in Mondo but not on-chain: {', '.join(map(str, sorted(theirs - ours))) or 'none'}")
    missing = sorted(ours - theirs)
    w(f"- Executed on-chain but not listed as executed in Mondo: {', '.join(map(str, missing)) or 'none'}"
      + (" (not in Mondo's list at all)" if missing and all(p not in mondo for p in missing) else ""))
    diff = sorted(p for p in ours & theirs if mondo[p].get("cgp") and pid2cgp.get(p) != mondo[p]["cgp"])
    w(f"- Proposals where Mondo and this audit disagree on the CGP: {', '.join(map(str, diff)) or 'none'}\n")
else:
    w("Mondo data was not available for this run.\n")
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
