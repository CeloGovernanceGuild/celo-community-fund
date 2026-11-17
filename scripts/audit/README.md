# Governance audit scripts

Rebuild `src/data` and `docs/audit.md` from governance and on-chain data.

```sh
git clone https://github.com/celo-org/governance ../governance
scripts/audit/run.sh ../governance
```

Requires Python 3. Network access to `forno.celo.org`
(archive RPC) and `celo.blockscout.com`. Intermediate JSON goes to `.audit/` (git-ignored).

| Script | Output | What it does |
|---|---|---|
| `common.py` | | RPC helpers and exact wei formatting |
| `parse_cgps.py` | `cgps.json` | CGP metadata and `mainnet.json` transactions |
| `extract_spends.py` | `spends.json` | Fund spends declared in CGPs |
| `fetch_logs.py` | `chain.json` | `ProposalExecuted` events, fund token approvals and transfers |
| `verify.py` | `verified.json` | Execution receipts, current balances and allowances |
| `reconcile.py` | `recon.json` | CGP spends vs execution receipts, in both directions |
| `grants.py` | `grants.json` | Exact effective amount of every grant (archive calls) |
| `fetch_inflows.py` | `celo_in.json` | CELO transferred into the fund over the last year |
| `gen_data.py` | `src/data/ledger.js`, `src/data/proposals.js` | Ledger of every grant and pending proposals |
| `gen_report.py` | `docs/audit.md` | The audit report |

All amounts are integers in wei; nothing is rounded.

New spenders need a display name in `NAMES` in `gen_data.py`; the script stops if one is missing.
