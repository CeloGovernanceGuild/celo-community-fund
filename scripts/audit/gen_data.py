"""Generate src/data/*.js from the verified governance grants (grants.json + verified.json)."""
import json, sys
g = json.load(open("grants.json")); v = json.load(open("verified.json"))
NAMES = {
 "0x7bdee323f5227f214edfc3ae4bd4ebc032b59c82": "Celo Airdrop",
 "0x2f90bb1caf4079192481b1a7f3088220d291456d": "CCF1",
 "0x5374cf78f82e3610f9678bd7af617785ff6c578a": "Community Appreciation Gifts",
 "0x0d8b5f1cd567656b6ad4c88e8f082f1f694e5bb5": "Ocelot (Celo Ecosystem Treasury)",
 "0x275d5828bf7e5aaf51bf8ef2f0668ac4a98f0d23": "Climate Collective",
 "0x9cf769bcce5e750534d88b251fb5b58da9776190": "Climate Collective Follow-on",
 "0xda2069f47d252121c2288301d6ef50b87220a693": "Prezenti",
 "0xc59533fd060e38230100f3577ef5ad9467ae2594": "Africa DAO",
 "0x46421b8ef42b67ae4e24be599bd78144e5e12088": "Chainlink SCALE",
 "0x38dbab5c651f352c8f5f765fda292e9b92d850ff": "Latam DAO",
 "0x81bc5b8f34cf959105c793f776971fa8a7bb2a25": "Celo Tribe",
 "0x4763a32d5256eda615fd5c07b0e333c7baa4d628": "Europe DAO",
 "0xf737369f79291d8e4ab273bbe5a4669381cb4715": "Celo Korea",
 "0xa7af94d898fc31a43d163201ce44b4fa944a79ee": "Mobile First Community",
 "0x34cbb11f19d9b6f1fc54d20b5e248db4a9b9afa2": "Centrifuge Deployment",
 "0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce": "MiniPay Strategic Grant",
 "0x71f433514957d00287a9d33da759f1e0c1732381": "Public Goods Funding H1 2024",
 "0x9138ad934d63a81a3bd10e5e6a2511db13c1c1ca": "Outlier Ventures RWA Accelerator",
 "0x083ab4a0c5d6cc899008bd5e8e1312379d629320": "Red Beard Ventures Accelerator",
 "0x9c257bdc314dc516e673728d70f45444f6e22412": "Stabila",
 "0x1b98202492bd78bb042523674eec19cd0ac50f96": "CeloPG H2 2024",
 "0xdd817a3d583bb0b97579c5959b4c929504f688d7": "CeloPG H2 2024 (second spender)",
 "0xd71efa410b6eaab0bac3b515b393c886be70f09e": "CICLOPS",
 "0x90860c778a8a69380376baab6ac7fec5daff4ab5": "Celo Regional Council",
 "0x85910be70d7ebf149918ed96ef8be175a0639c33": "CeloPG Seasons 0-1",
 "0x0b6a6666027d90fd56f4a2e1827296db4d590f4d": "Celo Communities Guild",
 "0x91606ba0b9a5527bf384001b94ab908c9054c677": "Celo Camp 2025",
 "0xa5c9389a0ce1bfe24ff883e761ff313225c77d44": "Prezenti Seasons 1-2",
 "0x9d7bc0ed7e53c9d8bddac8ce7dff77aba54022d5": "Next FX Market",
 "0x0f293b1548a55a7ba9541d4c27442e1591b068c9": "Celo Foundation",
 "0x35ff861a0b6215cec71ea282b0d32afefa661795": "Celo SHIELD",
 "0xc733285e8e4db433d4cd641f99c46bf108dcb54f": "Celo Governance Guild",
 "0xb0d0780eddc2fa35906c0b37b9b4dc7583c3dbb0": "Celo Core Co.",
 "0x68ce71d4ceca3003701ca6844d9a345925407455": "Celo Challenger Operator",
}
TRANSFER_GROUPS = [
 ("Oracle Funding", [23, 46, 67, 85, 114]),
 ("Governance Approvers Gas", [101]),
 ("cLabs L2 Project", [106, 154]),
 ("L2 Development Next Phase", [201]),
 ("cLabs Core Protocol Season 2", [220]),
]
url = lambda n: f"https://github.com/celo-org/governance/blob/main/CGPs/cgp-{n:04d}.md"
# checksummed addresses from the CGP files when available
checksum = {}
for s in json.load(open("spends.json")):
    if isinstance(s["to"], str) and s["to"].startswith("0x"):
        checksum[s["to"].lower()] = s["to"]
spenders = {}
for x in g:
    if x["token"] != "CELO" or x["kind"] != "approval":
        continue
    a = spenders.setdefault(x["to"], {"approved": 0.0, "cgps": [], "last": x["date"]})
    a["approved"] += x["delta"]; a["last"] = x["date"]
    if x["cgp"] not in a["cgps"]:
        a["cgps"].append(x["cgp"])
missing = [s for s in spenders if s not in NAMES]
if missing:
    sys.exit(f"unnamed spenders: {missing}")
active, completed = [], []
for s, a in spenders.items():
    remaining = v["allowances"].get(f"CELO:{s}", 0)
    entry = {"title": NAMES[s], "address": checksum.get(s, s), "approved": round(a["approved"], 2),
             "cgps": a["cgps"], "proposal": url(a["cgps"][-1]), "_remaining": remaining, "_last": a["last"]}
    (active if remaining >= 100 else completed).append(entry)
for title, nums in TRANSFER_GROUPS:
    amt = sum(x["delta"] for x in g if x["kind"] == "transfer" and x["token"] == "CELO" and x["cgp"] in nums)
    last = max(x["date"] for x in g if x["cgp"] in nums)
    completed.append({"title": title, "approved": round(amt, 2), "cgps": nums, "proposal": url(nums[-1]), "_remaining": 0, "_last": last})
unassigned = [x for x in g if x["kind"] == "transfer" and x["token"] == "CELO" and not any(x["cgp"] in n for _, n in TRANSFER_GROUPS)]
if unassigned:
    sys.exit(f"unassigned transfers: {unassigned}")
active.sort(key=lambda e: e["_last"]); completed.sort(key=lambda e: e["_last"])

def js(entries, name, header):
    out = [header, "", f"export const {name} = ["]
    for e in entries:
        out.append("  {")
        out.append(f'    title: "{e["title"]}",')
        if "address" in e:
            out.append(f'    address: "{e["address"]}",')
        amt = e["approved"]
        out.append(f"    approved: {int(amt) if float(amt).is_integer() else amt},")
        out.append(f'    cgps: [{", ".join(str(n) for n in e["cgps"])}],')
        out.append(f'    proposal: "{e["proposal"]}",')
        out.append("  },")
    out.append("];")
    return "\n".join(out) + "\n"

block = v["block"]
H = f"""// Generated from the governance audit at Celo block {block} (see docs/audit.md).
// `approved` is the total CELO allowance (or transfer) authorized by governance for
// this spender: the sum of allowance increases across its proposals, read on-chain
// as allowance after minus allowance before each execution."""
open(sys.argv[1] + "/active_initiatives.js", "w").write(js(active, "activeInitiatives", f"""// Active initiatives: spenders that still hold a CELO allowance from the Community Fund.
//
{H}
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative"""))
open(sys.argv[1] + "/completed_initiatives.js", "w").write(js(completed, "completedInitiatives", f"""// Completed initiatives: allowances used down to less than 100 CELO and
// direct CELO transfers executed by governance. Entries without an address
// were one-off transfers, so there is no allowance to read.
//
{H}
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative"""))
json.dump({"active": active, "completed": completed, "block": block}, open("site_data.json", "w"), indent=1)
print("active", [(e["title"], e["_remaining"]) for e in active])
print("completed", len(completed), "total approved CELO", f'{sum(e["approved"] for e in active+completed):,.2f}')
