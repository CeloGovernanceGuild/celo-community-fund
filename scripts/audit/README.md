# Governance audit scripts

Rebuild `src/data` and `docs/audit.md` from governance and on-chain data.

```sh
git clone https://github.com/celo-org/governance ../governance
scripts/audit/run.sh ../governance
```

Requires Python 3 and Node (for address checksums). Network access to `forno.celo.org`
(archive RPC) and `celo.blockscout.com`. Intermediate JSON goes to `.audit/` (git-ignored).

| Script | Output | What it does |
|---|---|---|
| `parse_cgps.py` | `cgps.json` | CGP metadata and `mainnet.json` transactions |
| `fetch_logs.py` | `chain.json` | `ProposalExecuted` events, fund token approvals and transfers |
| `verify.py` | `verified.json` | Execution receipts, current balances and allowances |
| `reconcile.py` | `recon.json` | CGP spends vs execution receipts, in both directions |
| `grants.py` | `grants.json` | Effective allowance change of every grant (archive calls) |
| `fetch_inflows.py` | `celo_in.json` | CELO transferred into the fund over the last year |
| `gen_data.py` | `src/data/*.js` | Active and completed initiatives |
| `gen_report.py` | `docs/audit.md` | The audit report |

New spenders need a display name in `NAMES` in `gen_data.py`; the script stops if one is missing.
