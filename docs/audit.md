# Community Fund governance audit

Snapshot: Celo block 83014439 (2026-11-17). Every number was read on-chain or from
[celo-org/governance](https://github.com/celo-org/governance) at that block. Amounts are exact to the wei:
nothing is rounded. The scripts that produce this report and `src/data` live in [`scripts/audit`](../scripts/audit).

## Method

1. Parse all CGPs in celo-org/governance: status, proposal id, and the transactions in `mainnet.json`.
2. Read every `ProposalExecuted` event of the Governance contract
   (`0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972`) and decode the CELO, USDm and EURm `Approval` and
   `Transfer` events emitted by the fund in each execution receipt.
3. Match both directions: every CGP spend must appear in its execution receipt, and every fund event in a
   receipt must come from a CGP.
4. For every approval, read the spender allowance one block before and at the execution block (archive
   calls). The effective amount is `after - before`, because `approve` replaces an allowance instead of
   adding to it.
5. For each spender: approved = sum of effective amounts, remaining = current allowance,
   claimed = approved - remaining. Allowances only go down through `transferFrom`, so this is exact.
6. Read current balances, the on-chain stage of pending proposals, and trace CELO inflows to the fund.

## Summary

| Token | Fund balance | Open allowances | Balance minus open allowances |
|---|---:|---:|---:|
| CELO | 77,858,565.789090605232734323 | 38,869,472.15175548892 | 38,989,093.637335116312734323 |
| USDm | 1,670.502286982809573708 | 1,152,130.261 | -1,150,459.758713017190426292 |
| EURm | 55.994895651259895506 | 0 | 55.994895651259895506 |

- Executed proposals checked: 208
- CGP spend transactions verified against execution receipts: 112 of 112
- CELO grants executed after the site's previous data update (2023-08-25): 54
- Pending CGPs with an on-chain proposal that can still execute: 0

## Ledger

One line per spender and token. `Claimed` is what the spender already pulled from the fund.
Entries with a remaining allowance, however small, are listed as open.

| Initiative | Token | Approved | Claimed | Remaining | Status | CGPs |
|---|---|---:|---:|---:|---|---|
| Celo Airdrop | CELO | 200,000 | 200,000 | 0 | fully claimed | [CGP-14](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0014.md) |
| CCF1 | CELO | 665,387 | 658,914.20824451108 | 6,472.79175548892 | open | [CGP-17](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0017.md) |
| Oracle Funding | CELO | 166,645.238095238095238095 | 166,645.238095238095238095 | 0 | transfer | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md), [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md), [CGP-67](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0067.md), [CGP-85](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0085.md), [CGP-114](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0114.md) |
| Community Appreciation Gifts | CELO | 15,000 | 700 | 14,300 | open | [CGP-20](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0020.md) |
| Ocelot (Celo Ecosystem Treasury) | CELO | 3,000,000 | 3,000,000 | 0 | fully claimed | [CGP-38](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0038.md) |
| Climate Collective | CELO | 4,700,000 | 4,700,000 | 0 | fully claimed | [CGP-52](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0052.md) |
| Prezenti (Community Fund stewardship) | CELO | 2,400,000 | 2,400,000 | 0 | fully claimed | [CGP-54](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0054.md), [CGP-72](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0072.md) |
| Governance-Owned USDm/USDC Liquidity (Mobius) | USDm | 5,000,000 | 5,000,000 | 0 | fully claimed | [CGP-61](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0061.md) |
| Mento-Owned USDm/USDC Liquidity (Curve) | USDm | 11,000,000 | 9,962,881.739 | 1,037,118.261 | open | [CGP-69](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0069.md) |
| Africa DAO | CELO | 550,000 | 549,010.1 | 989.9 | open | [CGP-68](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0068.md) |
| Chainlink SCALE | CELO | 5,980,314 | 5,980,312 | 2 | open | [CGP-75](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0075.md) |
| Latam DAO | CELO | 903,000 | 903,000 | 0 | fully claimed | [CGP-76](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0076.md) |
| Celo Tribe | CELO | 70,000 | 70,000 | 0 | fully claimed | [CGP-70](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0070.md) |
| Climate Collective Follow-on | CELO | 5,000,000 | 4,999,999 | 1 | open | [CGP-80](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0080.md) |
| Europe DAO | CELO | 440,000 | 440,000 | 0 | fully claimed | [CGP-82](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0082.md) |
| Credit Collective | EURm | 2,000,000 | 2,000,000 | 0 | fully claimed | [CGP-84](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0084.md) |
| Celo Korea | CELO | 303,030 | 303,030 | 0 | fully claimed | [CGP-88](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0088.md) |
| Mobile First Community | CELO | 120,000 | 120,000 | 0 | fully claimed | [CGP-92](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0092.md) |
| Centrifuge Deployment | CELO | 400,000 | 400,000 | 0 | fully claimed | [CGP-95](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0095.md) |
| Governance Approvers Gas | CELO | 60 | 60 | 0 | transfer | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) |
| cLabs L2 Project | CELO | 5,561,944 | 5,561,944 | 0 | transfer | [CGP-106](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0106.md), [CGP-154](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0154.md) |
| MiniPay Strategic Grant | CELO | 11,705,090.325 | 11,705,089.545 | 0.78 | open | [CGP-111](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0111.md), [CGP-170](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0170.md), [CGP-225](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0225.md) |
| CeloPG H1 2024 | CELO | 700,000 | 700,000 | 0 | fully claimed | [CGP-115](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0115.md) |
| CeloPG H1 2024 | USDm | 1,700,000 | 1,699,988 | 12 | open | [CGP-115](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0115.md) |
| Outlier Ventures RWA Accelerator | CELO | 41,000 | 41,000 | 0 | fully claimed | [CGP-129](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0129.md) |
| Outlier Ventures RWA Accelerator | USDm | 200,000 | 200,000 | 0 | fully claimed | [CGP-129](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0129.md) |
| Red Beard Ventures Accelerator | CELO | 46,000 | 46,000 | 0 | fully claimed | [CGP-130](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0130.md) |
| Red Beard Ventures Accelerator | USDm | 100,000 | 100,000 | 0 | fully claimed | [CGP-130](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0130.md) |
| Stabila | CELO | 20,346,426.11 | 20,346,425.43 | 0.68 | open | [CGP-132](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0132.md), [CGP-162](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0162.md), [CGP-179](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0179.md), [CGP-193](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0193.md), [CGP-222](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0222.md), [CGP-246](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0246.md) |
| CeloPG H2 2024 | CELO | 325,000 | 325,000 | 0 | fully claimed | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) |
| CeloPG H2 2024 | USDm | 875,000 | 860,000 | 15,000 | open | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) |
| CeloPG x Optimism matching (PG <> OP) | CELO | 1,250,000 | 0 | 1,250,000 | open | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) |
| CeloPG x Optimism matching (PG <> OP) | USDm | 100,000 | 0 | 100,000 | open | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) |
| Stablecoin & dApp Public Goods Dashboard | USDm | 175,000 | 175,000 | 0 | fully claimed | [CGP-148](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0148.md) |
| CeloColombia DAO | USDm | 38,000 | 38,000 | 0 | fully claimed | [CGP-153](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0153.md) |
| Celo Governance Guild | USDm | 55,000 | 55,000 | 0 | fully claimed | [CGP-152](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0152.md) |
| CICLOPS | CELO | 69,426,799 | 31,829,094 | 37,597,705 | open | [CGP-158](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0158.md), [CGP-202](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0202.md), [CGP-231](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0231.md), [CGP-237](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0237.md), [CGP-248](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0248.md) |
| CICLOPS | USDm | 3,101,298 | 3,101,298 | 0 | fully claimed | [CGP-158](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0158.md), [CGP-237](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0237.md) |
| Celo SHIELD | USDm | 225,000 | 225,000 | 0 | fully claimed | [CGP-157](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0157.md) |
| Celo Regional Council | CELO | 188,000 | 188,000 | 0 | fully claimed | [CGP-160](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0160.md), [CGP-204](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0204.md) |
| Celo Regional Council | USDm | 869,800 | 869,800 | 0 | fully claimed | [CGP-160](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0160.md), [CGP-204](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0204.md) |
| CeloPG Seasons 0-1 | CELO | 1,560,000 | 1,560,000 | 0 | fully claimed | [CGP-161](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0161.md), [CGP-194](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0194.md) |
| CeloPG Seasons 0-1 | USDm | 452,500 | 452,500 | 0 | fully claimed | [CGP-161](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0161.md), [CGP-194](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0194.md) |
| Stabila | USDm | 1,500,000 | 1,500,000 | 0 | fully claimed | [CGP-162](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0162.md), [CGP-193](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0193.md) |
| Celo Communities Guild | CELO | 1,304,258 | 1,304,258 | 0 | fully claimed | [CGP-165](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0165.md), [CGP-195](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0195.md), [CGP-219](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0219.md), [CGP-251](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0251.md) |
| Celo Communities Guild | USDm | 98,180 | 98,180 | 0 | fully claimed | [CGP-165](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0165.md), [CGP-195](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0195.md) |
| Prezenti Grants (Seasons 0-2) | USDm | 335,000 | 335,000 | 0 | fully claimed | [CGP-168](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0168.md) |
| Score Management Committee (incl. Challenger Operator funding) | USDm | 105,000 | 105,000 | 0 | fully claimed | [CGP-169](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0169.md), [CGP-181](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0181.md), [CGP-210](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0210.md) |
| Celo Camp 2025 | CELO | 223,098 | 223,098 | 0 | fully claimed | [CGP-176](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0176.md) |
| Celo Camp 2025 | USDm | 299,040 | 299,040 | 0 | fully claimed | [CGP-176](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0176.md) |
| Prezenti Grants (Seasons 0-2) | CELO | 5,176,267 | 5,176,267 | 0 | fully claimed | [CGP-197](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0197.md), [CGP-227](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0227.md) |
| FX Market Liquidity Strategy | CELO | 9,147,160 | 9,147,160 | 0 | fully claimed | [CGP-199](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0199.md) |
| FX Market Liquidity Strategy | USDm | 300,000 | 300,000 | 0 | fully claimed | [CGP-199](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0199.md) |
| L2 Development Next Phase | CELO | 6,453,860 | 6,453,860 | 0 | transfer | [CGP-201](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0201.md) |
| Celo Foundation | CELO | 13,426,449.275000000000000025 | 13,426,449.275000000000000025 | 0 | fully claimed | [CGP-200](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0200.md), [CGP-224](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0224.md) |
| Celo SHIELD | CELO | 183,333 | 183,333 | 0 | fully claimed | [CGP-215](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0215.md) |
| cLabs Core Protocol Season 2 | CELO | 4,355,627 | 4,355,627 | 0 | transfer | [CGP-220](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0220.md) |
| Celo Governance Guild | CELO | 862,000 | 862,000 | 0 | fully claimed | [CGP-223](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0223.md), [CGP-250](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0250.md) |
| Celo Core Co. | CELO | 31,609,499 | 31,609,499 | 0 | fully claimed | [CGP-247](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0247.md) |
| Score Management Committee (incl. Challenger Operator funding) | CELO | 1,312,500 | 1,312,500 | 0 | fully claimed | [CGP-242](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0242.md) |

## Findings

### 1. The site data stopped in August 2023

54 CELO grants were executed after the last manual data update. `src/data/ledger.js` is now generated from this audit.

### 2. Wrong amounts in the old data

| Initiative | Old site | On-chain | Source |
|---|---:|---:|---|
| Climate Collective | 4,000,000 | 4,700,000 | [CGP-52](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0052.md), proposal 60 |
| Celo Korea ("Asia DAO") | 333,030 | 303,030 | [CGP-88](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0088.md), proposal 120 |
| Chainlink | 5,980,313 | 5,980,314 | [CGP-75](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0075.md), proposal 88 |
| Climate Collective follow-on | missing | 5,000,000 | [CGP-80](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0080.md), proposal 105 |

### 3. Stale drafts

- India DAO Chitty: [CGP-64](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0064.md) was WITHDRAWN.
- India DAO Monish: no CGP exists.
- ImmuneFi Bug Bounty: [CGP-73](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0073.md) was WITHDRAWN.
- Centrifuge Deployment: [CGP-95](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0095.md) was EXECUTED on 2023-09-05 (proposal 130).

### 4. `approve` overwrote unspent allowances

| Proposal | Spender | Token | Allowance before | Approved to | Effective change |
|---|---|---|---:|---:|---:|
| [CGP-162](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0162.md) (#208) | `0x9c257bdc314dc516e673728d70f45444f6e22412` | CELO | 2,136,556.64 | 2,000,000 | -136,556.64 |
| [CGP-170](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0170.md) (#215) | `0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce` | CELO | 946,950.135 | 6,496,828.71 | 5,549,878.575 |
| [CGP-202](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0202.md) (#250) | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | CELO | 1,897,470 | 9,254,340 | 7,356,870 |
| [CGP-224](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0224.md) (#276) | `0x0f293b1548a55a7ba9541d4c27442e1591b068c9` | CELO | 0.274999999999999975 | 8,880,995 | 8,880,994.725000000000000025 |

The Stabila reduction was restored by [CGP-179](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0179.md). Future proposals should use `increaseAllowance`.

### 5. Open allowances

| Initiative | Token | Remaining | Last grant | Spender |
|---|---|---:|---|---|
| CCF1 | CELO | 6,472.79175548892 | 2021-02-11 | `0x2f90bb1caf4079192481b1a7f3088220d291456d` |
| Community Appreciation Gifts | CELO | 14,300 | 2021-03-26 | `0x5374cf78f82e3610f9678bd7af617785ff6c578a` |
| Mento-Owned USDm/USDC Liquidity (Curve) | USDm | 1,037,118.261 | 2023-01-12 | `0x87647780180b8f55980c7d3ffefe08a9b29e9ae1` |
| Africa DAO | CELO | 989.9 | 2023-03-04 | `0xc59533fd060e38230100f3577ef5ad9467ae2594` |
| Chainlink SCALE | CELO | 2 | 2023-04-07 | `0x46421b8ef42b67ae4e24be599bd78144e5e12088` |
| Climate Collective Follow-on | CELO | 1 | 2023-05-14 | `0x9cf769bcce5e750534d88b251fb5b58da9776190` |
| MiniPay Strategic Grant | CELO | 0.78 | 2026-02-18 | `0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce` |
| CeloPG H1 2024 | USDm | 12 | 2024-02-16 | `0x71f433514957d00287a9d33da759f1e0c1732381` |
| Stabila | CELO | 0.68 | 2026-08-06 | `0x9c257bdc314dc516e673728d70f45444f6e22412` |
| CeloPG H2 2024 | USDm | 15,000 | 2024-07-13 | `0x1b98202492bd78bb042523674eec19cd0ac50f96` |
| CeloPG x Optimism matching (PG <> OP) | CELO | 1,250,000 | 2024-07-13 | `0xdd817a3d583bb0b97579c5959b4c929504f688d7` |
| CeloPG x Optimism matching (PG <> OP) | USDm | 100,000 | 2024-07-13 | `0xdd817a3d583bb0b97579c5959b4c929504f688d7` |
| CICLOPS | CELO | 37,597,705 | 2026-08-10 | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` |

The CeloPG x Optimism matching budget (PG <> OP multisig) was never claimed: it was only to be used if Optimism approved a joint grant program. Old leftovers can be revoked
by governance with `approve(spender, 0)` or confirmed by their spenders.

### 6. USDm allowances are not backed

The fund holds 1,670.502286982809573708 USDm against 1,152,130.261 USDm of open allowances. A `transferFrom`
above the balance reverts, so this is not a loss, but those allowances are not funds.

### 7. CGP metadata does not match the chain

| CGP | Repository | Chain |
|---|---|---|
| [CGP-189](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0189.md) | EXECUTED, no on-chain ProposalExecuted | proposal 236 was not executed (Mondo: adopted, a vote with nothing to execute) |
| [CGP-233](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0233.md) | EXECUTED, no on-chain ProposalExecuted | proposal 286 was not executed (Mondo: adopted, a vote with nothing to execute) |
| [CGP-242](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0242.md) | status PROPOSED | proposal 309 executed on-chain 2026-09-03 |
| [CGP-243](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0243.md) | EXECUTED, no on-chain ProposalExecuted | proposal 297 was not executed (Mondo: adopted, a vote with nothing to execute) |
| [CGP-251](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0251.md) | status PROPOSED | proposal 311 executed on-chain 2026-09-09 |
| [CGP-253](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0253.md) | status PROPOSED | proposal 310 executed on-chain 2026-09-08 |
| [CGP-254](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0254.md) | status PROPOSED | proposal 317 executed on-chain 2026-11-12 |
| [CGP-254](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0254.md) | governance-proposal-id is 314 | it executed as proposal 317 |
| [CGP-255](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0255.md) | status PROPOSED | proposal 315 executed on-chain 2026-11-10 |
| [CGP-255](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0255.md) | governance-proposal-id is 312 | it executed as proposal 315 |
| [CGP-256](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0256.md) | status PROPOSED | proposal 316 executed on-chain 2026-11-12 |
| [CGP-256](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0256.md) | governance-proposal-id is 313 | it executed as proposal 316 |
| [CGP-63](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0063.md) | status DRAFT | proposal 78 expired |

Proposals executed on-chain with no CGP: none. None of them moves fund assets.
A proposal is matched to the CGP that declares its id; proposals no CGP declares are matched by the description
URL they were queued with on-chain, so a CGP that expired and was re-submitted under a new proposal id is
followed to the attempt that executed.
CGPs 14, 17, 20, 38, 52, 54, 61, 69, 70 and 75 have no `mainnet.json`; their fund movements were taken from the
execution receipts.

### 8. Inflows and replenish rate

After the L2 migration the regular inflow is about 30 CELO/day from `CeloUnreleasedTreasury`. Large grants are
funded in the same execution that approves them. Inflows of 100,000 CELO or more in the last year:

| Date | From | Amount | Tx | Proposal |
|---|---|---:|---|---|
| 2026-02-12 | Reserve | 4,355,627 | `0xe4f10755728fdcc0513d855d04abe6c55950c81674fb17196702449ec61b618b` | [CGP-220](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0220.md) |
| 2026-02-27 | Reserve | 43,012,777.340972869827370586 | `0x80e4b3307b76119f1bd436f36d6925a24e035fa3132bf13ca9b2c281f342f96c` | [CGP-231](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0231.md) |
| 2026-04-01 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 1,748,950 | `0xfbe1dac031726b6f580b561bfc2a80262b9529d09e4463fc3600cc74dce31a86` | none |
| 2026-07-28 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 1,324,344 | `0x0c9ed148e35a3c7b7cc92c49bcf8cd7b2c1947a9b20091c805a4f7187a4288b3` | none |
| 2026-08-06 | CeloUnreleasedTreasury | 4,838,709.68 | `0x6ab4a53ba5341b78e07bfd71fca11075147cc7293659d200453a8949c8f00303` | [CGP-246](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0246.md) |
| 2026-08-06 | CeloUnreleasedTreasury | 31,609,499 | `0xcaba97d3c63869aa8a1120a0ce5120ccb5e4f183aedf7490892c5b86467d8106` | [CGP-247](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0247.md) |
| 2026-08-06 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 795,081 | `0x8b2206b76efafe5e31d1bcfaf70de12f73b916eafe19fc79aa5a382521b1291e` | none |
| 2026-08-10 | CeloUnreleasedTreasury | 35,838,926 | `0xed3cb2e5c385968e610bcbdc9ef875bdccf07e6f0346d329b7820f856742562b` | [CGP-248](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0248.md) |
| 2026-08-25 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 667,815 | `0x0403c49fc0458d49f76d3e82260c3112b0bf130b9d04a6fa848f0588eace4696` | none |
| 2026-10-08 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 648,972 | `0x92ebdf72a5c25849505c7ea2021afec76660f461064840b84646860e34fa68db` | none |
| 2026-10-09 | `0x87647780180b8f55980c7d3ffefe08a9b29e9ae1` | 33,937,679.887277602347928717 | `0xece87a0b2200f51188a9f205adeb94dcb2f5f5d2ccb60b687bac5d169d664195` | none |
| 2026-10-27 | `0x7a1e98fc9a008107dbd1f430a05ace8cf6f3fe19` | 598,607 | `0x73ed01af8707e4619d1b82e906419ae4f567316f16d3569296e08a442ae210ea` | none |

Inflows with no proposal came from Safes outside governance. `0x87647780180b8f55980c7d3ffefe08a9b29e9ae1` is the
spender of the Mento USDm/USDC liquidity allowance from [CGP-69](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0069.md). Their owners should confirm what these transfers are.

### 9. Cross-check with Mondo

[Mondo](https://mondo.celo.org/governance), the Celo governance app, lists 294 proposals, 200 of them executed.
- Executed on-chain and executed in Mondo: 200
- Executed in Mondo but not on-chain: none
- Executed on-chain but not listed as executed in Mondo: 68, 83, 86, 88, 89, 96, 111, 115 (not in Mondo's list at all)
- Proposals where Mondo and this audit disagree on the CGP: none

## Pending proposals

| CGP | Status | Proposal | On-chain stage | Fund requests |
|---|---|---:|---|---|
| [CGP-257](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0257.md) Revenue-Based CELO Burn - Allocate 25% of Net L2 Sequencer Revenue to Permanent Burn | DRAFT | - | not submitted | none |
| [CGP-190](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0190.md) Enable USDGLO as Gas Currency | DRAFT | - | not submitted | none |
| [CGP-89](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0089.md) Enable G$ as Gas Currency | DRAFT | - | not submitted | none |
| [CGP-63](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0063.md) Learn to Earn | DRAFT | 78 | Expiration | none |

## Every grant

`Replaced` is the allowance an `approve` overwrote. `Effective` is what changed on-chain.

| Date | Proposal | CGP | Title | Token | Function | To | Requested | Replaced | Effective | Execution tx |
|---|---:|---|---|---|---|---|---:|---:|---:|---|
| 2021-01-14 | 16 | [CGP-14](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0014.md) | Distribute CELO to cUSD holders | CELO | approve | `0x7bdee323f5227f214edfc3ae4bd4ebc032b59c82` | 200,000 | 0 | 200,000 | `0x053c3752a21224653ba50679e9d7fde6e4b30c6aa0457e352fe197d836a7f427` |
| 2021-02-11 | 18 | [CGP-17](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0017.md) | Activation of Celo Community Fund | CELO | approve | `0x2f90bb1caf4079192481b1a7f3088220d291456d` | 665,387 | 0 | 665,387 | `0x1432cc545070d2dbbd43fb87849ed9108ff37a24f4e07adca8267f551e08f997` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xef1e143c554efc43b0537af00ac27c828de6cf8d` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xf4b4aa107f30206ea019de145a9b778a220f9fc0` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0x24c303e6395dd19806f739619960a311764e3f40` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xda413875fb45e5905950bc08a908ebd246ee6581` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0x87c45738dad8dc3d2b1cce779e0766329cc408c6` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xb8bdbfdd591a5be5980983a7ba1710a5f46f42b5` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0x929ad7f2b781ce830014e824ca2ef0b7b8de87c2` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xccc0b54edd8dae3c15b5c002dd5d348495d4f7fe` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xc5280ddbdec37540436935c01c912869b2d5ae1c` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-25 | 22 | [CGP-23](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0023.md) | Oracle activation for cEUR and cEUR freezing | CELO | transfer | `0xbd955f84e11ee53095f9068b88c9d2ffd3def707` | 100 | 0 | 100 | `0x7c249d1cdd0bd5336a1ae89456c3d60de747dee4b981e89b0ed3b2ab63c55c82` |
| 2021-03-26 | 25 | [CGP-20](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0020.md) | Community Appreciation Gifts | CELO | approve | `0x5374cf78f82e3610f9678bd7af617785ff6c578a` | 15,000 | 0 | 15,000 | `0xb9b6cb5486ac264ab9758417744d97368b4225645da50483e3ad866bd8ea4134` |
| 2021-11-11 | 43 | [CGP-38](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0038.md) | The Celo Ecosystem Treasury | CELO | approve | `0x0d8b5f1cd567656b6ad4c88e8f082f1f694e5bb5` | 3,000,000 | 0 | 3,000,000 | `0x01c4ee42af02f1dfbd9a87da942d6f7d769459ce0d81798940f2de85180f9535` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0xc3994b2af0e82490e432d49e9f2246cdfd84da8f` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x3b91bbb873f3b979bd6671dc018d5fc1848882dd` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x9b376b33c33325332df8c6ca951a9896889a6d1e` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x554ba7f4d200c7b233b93b7f2223bc1ea7c467fd` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x535cea1834d6b52e4e9724642fdd7008f569ba5c` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x1299dd007cd5120262e546dca893e30d1cff8a10` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x57d8a7bf9e7f4113c49e077b140fd8e1d7f78a76` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x116951e440aee97a328614f9937710c9bb2f0839` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0xd1f3d8fc2446d2ff0e2408ae33a0097a4c94e381` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2021-12-14 | 49 | [CGP-46](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0046.md) | cREAL oracle and constitution parameter activation | CELO | transfer | `0x7f045f538c3837d9096205e740a0173ea860c400` | 1,000 | 0 | 1,000 | `0xcf10c4564e0967935ab99d297b18831857ec7c2c65d73ffe3618ef094a3e124b` |
| 2022-06-19 | 60 | [CGP-52](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0052.md) | Funds for Climate Collective Treasury | CELO | approve | `0x275d5828bf7e5aaf51bf8ef2f0668ac4a98f0d23` | 4,700,000 | 0 | 4,700,000 | `0x77f641532e7038a7ef26da706d35e7671a6fef7ebf5cbe0185da25373a241dd9` |
| 2022-06-19 | 61 | [CGP-54](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0054.md) | Reopening of the Celo Community Fund | CELO | approve | `0xda2069f47d252121c2288301d6ef50b87220a693` | 800,000 | 0 | 800,000 | `0xdae9715d7fdd3746eb1473dd78c3e6eff152003e5f94c06d75282d0f53d536b1` |
| 2022-08-25 | 68 | [CGP-61](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0061.md) | Governance-Owned cUSD<->USDC Liquidity | USDm | approve | `0xfa3df877f98ac5ecd87456a7accaa948462412f0` | 5,000,000 | 0 | 5,000,000 | `0xba7601829251411408092a75ef5b81d47fb4bc09537b48a0dd4ceb94fa835951` |
| 2022-12-19 | 77 | [CGP-67](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0067.md) | Enabling T-Systems as an oracle provider and deploy oracle payments | CELO | transfer | `0xc870dc32e84531da06c0156f0dfa73cfa091c4bd` | 9,523.809523809523809524 | 0 | 9,523.809523809523809524 | `0x088e1add27537ca2a19ac9cfe6cf82d8cb4157ee239761bb48fa2d2f259cf950` |
| 2022-12-19 | 77 | [CGP-67](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0067.md) | Enabling T-Systems as an oracle provider and deploy oracle payments | CELO | transfer | `0xcf4840cb2fddf6e8caff525797c08ddf593fe4e3` | 28,571.428571428571428571 | 0 | 28,571.428571428571428571 | `0x088e1add27537ca2a19ac9cfe6cf82d8cb4157ee239761bb48fa2d2f259cf950` |
| 2022-12-19 | 77 | [CGP-67](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0067.md) | Enabling T-Systems as an oracle provider and deploy oracle payments | CELO | transfer | `0xf895f918de6c9ab144a081eb04e06d5cfac40855` | 9,375 | 0 | 9,375 | `0x088e1add27537ca2a19ac9cfe6cf82d8cb4157ee239761bb48fa2d2f259cf950` |
| 2022-12-19 | 77 | [CGP-67](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0067.md) | Enabling T-Systems as an oracle provider and deploy oracle payments | CELO | transfer | `0xcc5df0f229f4e8fae17068eef24d2e81fe010455` | 28,125 | 0 | 28,125 | `0x088e1add27537ca2a19ac9cfe6cf82d8cb4157ee239761bb48fa2d2f259cf950` |
| 2023-01-12 | 80 | [CGP-69](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0069.md) | Move Mento-Owned cUSD<->USDC Liquidity from Mobius to Curve | USDm | approve | `0x87647780180b8f55980c7d3ffefe08a9b29e9ae1` | 11,000,000 | 0 | 11,000,000 | `0xf7895dc78d7dcd4f8628e74775600011dfef114605a843de5ef65d91ae963cc8` |
| 2023-03-04 | 85 | [CGP-68](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0068.md) | Celo Africa DAO | CELO | approve | `0xc59533fd060e38230100f3577ef5ad9467ae2594` | 550,000 | 0 | 550,000 | `0xb1b6ded11fdb8d94dd12734621b83b13e081659560ad1d29fa0715c55757c324` |
| 2023-04-07 | 88 | [CGP-75](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0075.md) | Celo to Join Chainlink SCALE Program To Accelerate Ecosystem Growth | CELO | approve | `0x46421b8ef42b67ae4e24be599bd78144e5e12088` | 5,980,314 | 0 | 5,980,314 | `0x33f1b54edab599bb32573d140dba2602595ce5d717267d6cc95ef070c95b18cd` |
| 2023-04-07 | 89 | [CGP-72](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0072.md) | Prezenti (Celo Community Fund) stewardship follow-on funding request | CELO | approve | `0xda2069f47d252121c2288301d6ef50b87220a693` | 1,600,000 | 0 | 1,600,000 | `0x2c63719f70ed5c1c49eb1045ab6bba9dfbdbadd402e0f32996e541e8fd377603` |
| 2023-04-23 | 96 | [CGP-76](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0076.md) | LatAm-W3-DAO-Proposal | CELO | approve | `0x38dbab5c651f352c8f5f765fda292e9b92d850ff` | 903,000 | 0 | 903,000 | `0x4657148667297ac6313b8cd69af1f815bd0b6e21e16b196b9ddd974598977f38` |
| 2023-04-29 | 101 | [CGP-70](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0070.md) | Celo Tribe Web3 Social club | CELO | approve | `0x81bc5b8f34cf959105c793f776971fa8a7bb2a25` | 70,000 | 0 | 70,000 | `0x309bcbfcbad8bc5c1c6eb90bdbf8ef832916f08d6f9c98d09b131f9e70e31ee7` |
| 2023-05-14 | 105 | [CGP-80](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0080.md) | Follow-on Funding for Climate Collective | CELO | approve | `0x9cf769bcce5e750534d88b251fb5b58da9776190` | 5,000,000 | 0 | 5,000,000 | `0x4a325f88c62969261ee62ce90160c1249808de50c24c9a7c36779817b4026a41` |
| 2023-07-11 | 115 | [CGP-82](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0082.md) | EuropeDAO-Proposal | CELO | approve | `0x4763a32d5256eda615fd5c07b0e333c7baa4d628` | 440,000 | 0 | 440,000 | `0xa349ec1a4b1778629c8aae01abee284bb5060ada807552b435d32f835b8646ff` |
| 2023-08-01 | 117 | [CGP-84](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0084.md) | Funding for Credit Collective | EURm | approve | `0x5f411351e6566409f9b0b8d03873846e0c7201b3` | 2,000,000 | 0 | 2,000,000 | `0xcac94832836ad066d82d6e14b9407d0132b04d1d4a29f714f12870802b1f9ce3` |
| 2023-08-03 | 120 | [CGP-88](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0088.md) | CELO Korea | CELO | approve | `0xf737369f79291d8e4ab273bbe5a4669381cb4715` | 303,030 | 0 | 303,030 | `0xd7823ddcdb8be442c9be1312b445f9fa3c8682acbcf6360ed285397e5549e086` |
| 2023-08-20 | 123 | [CGP-92](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0092.md) | Proposal for mobile first community in celo ecosystem and telecom | CELO | approve | `0xa7af94d898fc31a43d163201ce44b4fa944a79ee` | 120,000 | 0 | 120,000 | `0xd739b597f85c1aafcb4b0f114b8cb700bed1bd363240086fe426293e145e72e4` |
| 2023-09-05 | 130 | [CGP-95](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0095.md) | Centrifuge Deployment on Celo | CELO | approve | `0x34cbb11f19d9b6f1fc54d20b5e248db4a9b9afa2` | 400,000 | 0 | 400,000 | `0x4183ab7e64be8c6df94567ec25f1ccb276fa7bbc90680fab0383c276ab3e7a75` |
| 2023-10-12 | 138 | [CGP-85](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0085.md) | G$ oracle activation | CELO | transfer | `0x6ae2549301bf56198a22d814e921ba3e2acd1d5c` | 1,000 | 0 | 1,000 | `0x9dca6cd4fd6df9a34dbe5db27d702fa7f12f32155aa0990db05ae558570246b8` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0x5c73151a9edcaccbd20ebb346bd4e419cdc94da3` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0x5cae91b0d08641249580ac89e129e8242b8335ef` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0xc97d3c16be3cbe408984cf1d7ce50d4b00c246c0` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0x94a33095647bd7f51515c6b6d3e076da72dad8d2` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0x978727d0b401b66cf3891aaf9a40826765469ba2` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-10-21 | 140 | [CGP-101](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0101.md) | Add New Governance Approvers Temperature Check | CELO | transfer | `0x3ca642dfba1976d74be94e735153ffdf722b9232` | 10 | 0 | 10 | `0x3ecb112014d4c4f7587dbde5dd7d6c80003cec354b748c52338750d84729b43e` |
| 2023-11-12 | 142 | [CGP-106](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0106.md) | Funding for cLabs blockchain L2 project | CELO | transfer | `0x33020296a0da7c897d2d6dadef5fecebe2667ad7` | 2,769,504 | 0 | 2,769,504 | `0x9bd3f0f95cd2626f285e0c97a71d2eeaf7778ac5a7a919aa6041360cd92200cc` |
| 2023-12-22 | 147 | [CGP-111](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0111.md) | Strategic Grant For Accelerating Celo Ecosystem Adoption Across Africa | CELO | approve | `0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce` | 5,205,000 | 0 | 5,205,000 | `0xac3bc285db085de4c93a7eed9ae780b88b481a384a42e068bd875aca0d8ea455` |
| 2024-01-26 | 151 | [CGP-114](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0114.md) | Funding payment contracts for Oracle providers | CELO | transfer | `0xbda2e0e65cf3a8c6ef40f99a7f93d7650d8a5c09` | 7,007 | 0 | 7,007 | `0xfd61f9c35c8064e32f340a82c9a2e4f23a744df259835cc4f1ca87b2921d0142` |
| 2024-01-26 | 151 | [CGP-114](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0114.md) | Funding payment contracts for Oracle providers | CELO | transfer | `0x1f9719c84f4819459f702c7d6e3e14bbd2e62b49` | 31,668 | 0 | 31,668 | `0xfd61f9c35c8064e32f340a82c9a2e4f23a744df259835cc4f1ca87b2921d0142` |
| 2024-01-26 | 151 | [CGP-114](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0114.md) | Funding payment contracts for Oracle providers | CELO | transfer | `0x4b3491dc5a6fb99e515323fb104c80543df0239b` | 8,707 | 0 | 8,707 | `0xfd61f9c35c8064e32f340a82c9a2e4f23a744df259835cc4f1ca87b2921d0142` |
| 2024-01-26 | 151 | [CGP-114](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0114.md) | Funding payment contracts for Oracle providers | CELO | transfer | `0xca7973db0d6d40b4b375510b3b5c9cb4cce16216` | 31,668 | 0 | 31,668 | `0xfd61f9c35c8064e32f340a82c9a2e4f23a744df259835cc4f1ca87b2921d0142` |
| 2024-02-16 | 157 | [CGP-115](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0115.md) | Revised Celo Governance Guidelines and Public Goods Funding Strategy H1 2024 | CELO | increaseAllowance | `0x71f433514957d00287a9d33da759f1e0c1732381` | 700,000 | 0 | 700,000 | `0x849798afb1f2dc090e8c561a6e05d80e54473fa6c34ceba190ecd96b3e3572c6` |
| 2024-02-16 | 157 | [CGP-115](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0115.md) | Revised Celo Governance Guidelines and Public Goods Funding Strategy H1 2024 | USDm | increaseAllowance | `0x71f433514957d00287a9d33da759f1e0c1732381` | 1,700,000 | 0 | 1,700,000 | `0x849798afb1f2dc090e8c561a6e05d80e54473fa6c34ceba190ecd96b3e3572c6` |
| 2024-04-12 | 170 | [CGP-129](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0129.md) | RWA-focused Accelerator with Outlier Ventures | CELO | increaseAllowance | `0x9138ad934d63a81a3bd10e5e6a2511db13c1c1ca` | 41,000 | 0 | 41,000 | `0xcfb09730793b449851fcf91d54786579842ec3ffa2bb7d0fdf625757cf2673cb` |
| 2024-04-12 | 170 | [CGP-129](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0129.md) | RWA-focused Accelerator with Outlier Ventures | USDm | increaseAllowance | `0x9138ad934d63a81a3bd10e5e6a2511db13c1c1ca` | 200,000 | 0 | 200,000 | `0xcfb09730793b449851fcf91d54786579842ec3ffa2bb7d0fdf625757cf2673cb` |
| 2024-04-13 | 172 | [CGP-130](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0130.md) | Red Beard Ventures x CELO Accelerator | CELO | increaseAllowance | `0x083ab4a0c5d6cc899008bd5e8e1312379d629320` | 46,000 | 0 | 46,000 | `0xb5e0f5892c4c399662dc20ff195db4feea22b835aaf6a398a2b53d481efdcad6` |
| 2024-04-13 | 172 | [CGP-130](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0130.md) | Red Beard Ventures x CELO Accelerator | USDm | increaseAllowance | `0x083ab4a0c5d6cc899008bd5e8e1312379d629320` | 100,000 | 0 | 100,000 | `0xb5e0f5892c4c399662dc20ff195db4feea22b835aaf6a398a2b53d481efdcad6` |
| 2024-05-17 | 176 | [CGP-132](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0132.md) | Proposal for Funding Stabila - Driving Stablecoin Adoption on Celo | CELO | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 5,000,000 | 0 | 5,000,000 | `0x5a7ed309ba0adbe654cfea0c51ada9142870858b96dd1b2f9b87576e93145244` |
| 2024-07-13 | 182 | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) | CeloPG H2 2024 Budget | CELO | increaseAllowance | `0x1b98202492bd78bb042523674eec19cd0ac50f96` | 325,000 | 0 | 325,000 | `0x7fc66b81d3895fde0818682d93189b2b3d44126aa78067e237e7b63997ba148a` |
| 2024-07-13 | 182 | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) | CeloPG H2 2024 Budget | USDm | increaseAllowance | `0x1b98202492bd78bb042523674eec19cd0ac50f96` | 875,000 | 0 | 875,000 | `0x7fc66b81d3895fde0818682d93189b2b3d44126aa78067e237e7b63997ba148a` |
| 2024-07-13 | 182 | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) | CeloPG H2 2024 Budget | CELO | increaseAllowance | `0xdd817a3d583bb0b97579c5959b4c929504f688d7` | 1,250,000 | 0 | 1,250,000 | `0x7fc66b81d3895fde0818682d93189b2b3d44126aa78067e237e7b63997ba148a` |
| 2024-07-13 | 182 | [CGP-141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) | CeloPG H2 2024 Budget | USDm | increaseAllowance | `0xdd817a3d583bb0b97579c5959b4c929504f688d7` | 100,000 | 0 | 100,000 | `0x7fc66b81d3895fde0818682d93189b2b3d44126aa78067e237e7b63997ba148a` |
| 2024-10-12 | 189 | [CGP-148](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0148.md) | Proposal for Stablecoin & dApp Public Goods Dashboard | USDm | approve | `0xd1a06a4477b9e4633e6e56d8f9eb9ccd39ce36bc` | 175,000 | 0 | 175,000 | `0x4ebd9f65cf481c937aa3692ec3b2476452bc39453035221dddcc84a219bf8d19` |
| 2024-11-13 | 193 | [CGP-153](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0153.md) | CeloColombia DAO - Funding and Operations Proposal | USDm | approve | `0x6c6dc3d4869d9812d80600b9f7f291e13ee73d49` | 38,000 | 0 | 38,000 | `0xdedde2234438bbf230d6966aaef742a24e86b638f38e51276f6fee84cbeead06` |
| 2024-11-17 | 194 | [CGP-154](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0154.md) | Funding for cLabs blockchain L2 project | CELO | transfer | `0x04a876e94ad57abf28250aa0f19cb4ac031b566f` | 2,792,440 | 0 | 2,792,440 | `0x1f531341d69ab90dc309afbc62076334f3346c94a52fa6dbdd31214b814992e1` |
| 2024-11-30 | 195 | [CGP-152](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0152.md) | Creation of Celo Governance Guild | USDm | approve | `0xc733285e8e4db433d4cd641f99c46bf108dcb54f` | 55,000 | 0 | 55,000 | `0x7752de634619b65e3c66c1b85464a97ed38821325c3454e067c65d5d5d128aa6` |
| 2025-01-15 | 197 | [CGP-158](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0158.md) | Celo Infrastructure for Chain Lifecycle Operational Support (CICLOPS) | CELO | approve | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 3,794,940 | 0 | 3,794,940 | `0x5dc943137f5b9008ec4671e8048e88b97a09d733cef6e03fda4a38d33d946a90` |
| 2025-01-15 | 197 | [CGP-158](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0158.md) | Celo Infrastructure for Chain Lifecycle Operational Support (CICLOPS) | USDm | approve | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 3,000,000 | 0 | 3,000,000 | `0x5dc943137f5b9008ec4671e8048e88b97a09d733cef6e03fda4a38d33d946a90` |
| 2025-02-10 | 199 | [CGP-157](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0157.md) | Celo SHIELD - Subsidized Help for Improving Ecosystem-Level Defense | USDm | approve | `0x35ff861a0b6215cec71ea282b0d32afefa661795` | 225,000 | 0 | 225,000 | `0xdeea2a053c58baf0abe1a077fecf34addea2ddfb0b5fdf022c9026d722f7e2a3` |
| 2025-02-15 | 201 | [CGP-160](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0160.md) | Celo Regional Council | CELO | approve | `0x90860c778a8a69380376baab6ac7fec5daff4ab5` | 50,000 | 0 | 50,000 | `0xcb15d5ee84029d457e9b2b35c4c726d55d76aed142accd44c89c84c0cc1390c3` |
| 2025-02-15 | 201 | [CGP-160](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0160.md) | Celo Regional Council | USDm | approve | `0x90860c778a8a69380376baab6ac7fec5daff4ab5` | 477,800 | 0 | 477,800 | `0xcb15d5ee84029d457e9b2b35c4c726d55d76aed142accd44c89c84c0cc1390c3` |
| 2025-02-15 | 202 | [CGP-161](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0161.md) | CeloPG Season 0 | CELO | increaseAllowance | `0x85910be70d7ebf149918ed96ef8be175a0639c33` | 685,000 | 0 | 685,000 | `0x908d20f7512eb733bb50b614df8dd358a3dca78bc880d4638a808f753468eff3` |
| 2025-02-15 | 202 | [CGP-161](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0161.md) | CeloPG Season 0 | USDm | increaseAllowance | `0x85910be70d7ebf149918ed96ef8be175a0639c33` | 164,000 | 0 | 164,000 | `0x908d20f7512eb733bb50b614df8dd358a3dca78bc880d4638a808f753468eff3` |
| 2025-02-28 | 208 | [CGP-162](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0162.md) | Stabila Funding Request Aave Liquidity & Incentives | CELO | approve | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 2,000,000 | 2,136,556.64 | -136,556.64 | `0x2a035286c9a57e5f55fcec0ab41ec2b500033d4e811803d4c48f11ef3821f245` |
| 2025-02-28 | 208 | [CGP-162](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0162.md) | Stabila Funding Request Aave Liquidity & Incentives | USDm | approve | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 1,000,000 | 0 | 1,000,000 | `0x2a035286c9a57e5f55fcec0ab41ec2b500033d4e811803d4c48f11ef3821f245` |
| 2025-03-08 | 211 | [CGP-168](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0168.md) | Budget Request: Prezenti Grant funding: Season 0 | USDm | approve | `0xa5c9389a0ce1bfe24ff883e761ff313225c77d44` | 335,000 | 0 | 335,000 | `0x2f92b8c94f2d620e9568b1274385a2efd0c151eaf107963be3687cba4b881127` |
| 2025-03-08 | 212 | [CGP-165](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0165.md) | Celo Communities Guild Proposal 2025 H1 Budget | CELO | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 5,000 | 0 | 5,000 | `0xb10431798096ff8e8f166836dd1a1bb494e5560c60516196c5a575fea7338548` |
| 2025-03-08 | 212 | [CGP-165](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0165.md) | Celo Communities Guild Proposal 2025 H1 Budget | USDm | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 47,090 | 0 | 47,090 | `0xb10431798096ff8e8f166836dd1a1bb494e5560c60516196c5a575fea7338548` |
| 2025-03-20 | 215 | [CGP-170](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0170.md) | Authorize 2nd half of Minipay Strategic Grant | CELO | approve | `0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce` | 6,496,828.71 | 946,950.135 | 5,549,878.575 | `0x2db76ac602f745d0e09728fa1393fe1d20132258e941d22ed5420d3bbc536ea7` |
| 2025-03-30 | 219 | [CGP-169](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0169.md) | Set The Great Celo Halvening Parameters | USDm | approve | `0x68ce71d4ceca3003701ca6844d9a345925407455` | 36,000 | 0 | 36,000 | `0xf10e6ec1f9cc37c24b9ce9117461a731e73fb3edb5086a1db4d14e92f7d9d44d` |
| 2025-05-02 | 226 | [CGP-179](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0179.md) | Restore Remaining CELO Spend Allowance to Stabila Multisig | CELO | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 2,136,556.64 | 0 | 2,136,556.64 | `0x0bff435e994ed355c6369ac795839d885066d5e290e1ecb5b17758eebb13ebbb` |
| 2025-05-11 | 228 | [CGP-176](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0176.md) | Celo Camp 2025 Season 0-1 Proposal | CELO | approve | `0x91606ba0b9a5527bf384001b94ab908c9054c677` | 223,098 | 0 | 223,098 | `0x3cb15f0d58b710f7783f7f70a97e637892e417c295e03bf1cdd51f0e5bed5631` |
| 2025-05-11 | 228 | [CGP-176](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0176.md) | Celo Camp 2025 Season 0-1 Proposal | USDm | approve | `0x91606ba0b9a5527bf384001b94ab908c9054c677` | 299,040 | 0 | 299,040 | `0x3cb15f0d58b710f7783f7f70a97e637892e417c295e03bf1cdd51f0e5bed5631` |
| 2025-05-16 | 229 | [CGP-181](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0181.md) | Extension of Score Management Committee and Additional Funding | USDm | approve | `0x68ce71d4ceca3003701ca6844d9a345925407455` | 24,000 | 0 | 24,000 | `0x9baa61b1e4a7ec25e8d61aed9c347efa9164118d219c4806ae21f20167f694e4` |
| 2025-08-08 | 240 | [CGP-193](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0193.md) | Stabila Season 1 Funding Request DeFi Flywheel Infrastructure and Incentives | CELO | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 2,885,246 | 0 | 2,885,246 | `0xf297a43fa12cf11f4074844f55bdd0fa75f3f946525628a42ae4141a5764d5ea` |
| 2025-08-08 | 240 | [CGP-193](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0193.md) | Stabila Season 1 Funding Request DeFi Flywheel Infrastructure and Incentives | USDm | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 500,000 | 0 | 500,000 | `0xf297a43fa12cf11f4074844f55bdd0fa75f3f946525628a42ae4141a5764d5ea` |
| 2025-08-08 | 241 | [CGP-194](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0194.md) | CeloPG Season 1 | CELO | increaseAllowance | `0x85910be70d7ebf149918ed96ef8be175a0639c33` | 875,000 | 0 | 875,000 | `0x24ee6c5b2dbafccd170229072088bd58789de8bb38d721cc26ffa1fb06f8835d` |
| 2025-08-08 | 241 | [CGP-194](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0194.md) | CeloPG Season 1 | USDm | increaseAllowance | `0x85910be70d7ebf149918ed96ef8be175a0639c33` | 288,500 | 0 | 288,500 | `0x24ee6c5b2dbafccd170229072088bd58789de8bb38d721cc26ffa1fb06f8835d` |
| 2025-08-11 | 243 | [CGP-195](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0195.md) | Celo Communities Guild Proposal / 2025 H2 Budget | CELO | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 10,000 | 0 | 10,000 | `0x223054107649df1d76af6196153884600d75f6e0afe2e730f31d907710a0c4ec` |
| 2025-08-11 | 243 | [CGP-195](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0195.md) | Celo Communities Guild Proposal / 2025 H2 Budget | USDm | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 51,090 | 0 | 51,090 | `0x223054107649df1d76af6196153884600d75f6e0afe2e730f31d907710a0c4ec` |
| 2025-08-12 | 244 | [CGP-197](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0197.md) | Prezenti Season 1 Funding Request: Direct Grants | CELO | increaseAllowance | `0xa5c9389a0ce1bfe24ff883e761ff313225c77d44` | 1,746,267 | 0 | 1,746,267 | `0x28e6d17533c3e16d2963e93e77fc87daa0c5b056be81621fc5e7e86c9d9a89da` |
| 2025-08-16 | 246 | [CGP-199](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0199.md) | Creating the Next FX Market A Strategy to Attract Liquidity to Celo | CELO | approve | `0x9d7bc0ed7e53c9d8bddac8ce7dff77aba54022d5` | 9,147,160 | 0 | 9,147,160 | `0xb9114a8e1c9b888daa59a2497fea15ebf1f88adb809c70a34ff95d0fba70001a` |
| 2025-08-16 | 246 | [CGP-199](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0199.md) | Creating the Next FX Market A Strategy to Attract Liquidity to Celo | USDm | approve | `0x9d7bc0ed7e53c9d8bddac8ce7dff77aba54022d5` | 300,000 | 0 | 300,000 | `0xb9114a8e1c9b888daa59a2497fea15ebf1f88adb809c70a34ff95d0fba70001a` |
| 2025-08-22 | 249 | [CGP-201](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0201.md) | Funding Proposal Accelerating the Next Phase of Celo's L2 Development | CELO | transfer | `0x65e25c46cb80ae5f8118d6bcfa3b69d969799411` | 6,453,860 | 0 | 6,453,860 | `0x305cf36403bc24eda544a2c8d974a246d44b605c36f7484b7d7ac67f4ed7f9d8` |
| 2025-08-27 | 250 | [CGP-202](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0202.md) | Celo Infrastructure for Chain Lifecycle Operational Support (CICLOPS 2) - Season 1 | CELO | approve | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 9,254,340 | 1,897,470 | 7,356,870 | `0x85c1aedf4adf54e0cbec9d1f7279a541a710c533aa8b37d09d8b1b4719c5227f` |
| 2025-09-05 | 251 | [CGP-200](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0200.md) | Celo Foundation Season 1 Funding Proposal | CELO | approve | `0x0f293b1548a55a7ba9541d4c27442e1591b068c9` | 4,545,454.55 | 0 | 4,545,454.55 | `0x1cc9f43a970a88074716c72294c8209b12f96231de45a3d1473108a26946c0b8` |
| 2025-09-19 | 252 | [CGP-204](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0204.md) | Celo Regional Council Season 1 Funding Request V2 | CELO | approve | `0x90860c778a8a69380376baab6ac7fec5daff4ab5` | 138,000 | 0 | 138,000 | `0xbf139a4f2d5b7c042622e31b91f64b1ec7d80d3bcefdb031059f48f175e0b6ff` |
| 2025-09-19 | 252 | [CGP-204](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0204.md) | Celo Regional Council Season 1 Funding Request V2 | USDm | approve | `0x90860c778a8a69380376baab6ac7fec5daff4ab5` | 392,000 | 0 | 392,000 | `0xbf139a4f2d5b7c042622e31b91f64b1ec7d80d3bcefdb031059f48f175e0b6ff` |
| 2025-12-17 | 267 | [CGP-210](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0210.md) | Score Management Committee - 6 Month Extension and Continued Funding | USDm | approve | `0x68ce71d4ceca3003701ca6844d9a345925407455` | 45,000 | 0 | 45,000 | `0x4321debb514a2c17eee7b62f00bf346168edfc3797e10eb1b7358b54199ec0d1` |
| 2025-12-30 | 268 | [CGP-215](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0215.md) | Celo SHIELD Part B - Strategic Conclusion and Bug Bounty Settlement | CELO | approve | `0x35ff861a0b6215cec71ea282b0d32afefa661795` | 183,333 | 0 | 183,333 | `0x7a6b1658262f55e6d26df9c93eb168bb2e5bf00890fb8e99b63fd58cc3cf5b46` |
| 2026-02-10 | 273 | [CGP-222](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0222.md) | Stabila Season 2 Funding Request | CELO | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 5,622,470.43 | 0 | 5,622,470.43 | `0x09a55032cd50abc110fdd7beebe08f3375cd4b4a382ef4304ed5edb6517aeaa1` |
| 2026-02-12 | 274 | [CGP-220](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0220.md) | cLabs Core Protocol Execution - Season 2 (H1 2026) Funding Proposal | CELO | transfer | `0xcc651797284339852a38f66c31fafa8ffe9e8fbe` | 4,355,627 | 0 | 4,355,627 | `0xe4f10755728fdcc0513d855d04abe6c55950c81674fb17196702449ec61b618b` |
| 2026-02-14 | 275 | [CGP-223](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0223.md) | Celo Governance Guild Season 2 Funding Request | CELO | approve | `0xc733285e8e4db433d4cd641f99c46bf108dcb54f` | 532,000 | 0 | 532,000 | `0x042b475ce026fa4fcc815a94f84a538d93c3f95c49cefd0cfc54d6a064a795c0` |
| 2026-02-14 | 276 | [CGP-224](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0224.md) | Celo Foundation Season 2 Funding Proposal | CELO | approve | `0x0f293b1548a55a7ba9541d4c27442e1591b068c9` | 8,880,995 | 0.274999999999999975 | 8,880,994.725000000000000025 | `0x1045b09ec83cfd01088e57c95354666b27ff7ba587ff82e0fd72f6d780a00d89` |
| 2026-02-18 | 277 | [CGP-225](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0225.md) | Sustaining and Expanding MiniPay as Celo's Global Stablecoin Distribution Layer | CELO | increaseAllowance | `0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce` | 950,211.75 | 0 | 950,211.75 | `0x24bfbc197b2eb7b06fc84c56d070fec43e7c4734099fdfaa3d39383bde168f0e` |
| 2026-02-22 | 278 | [CGP-227](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0227.md) | Prezenti Season 2 Funding Request - Direct Grants | CELO | increaseAllowance | `0xa5c9389a0ce1bfe24ff883e761ff313225c77d44` | 3,430,000 | 0 | 3,430,000 | `0x569a3d4b65b257b0b54b7db4eaa79bc2b776bb22cd7d19494a153ca69f8f6b03` |
| 2026-02-27 | 281 | [CGP-231](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0231.md) | Celo Infrastructure for Chain Lifecycle Operational Support (CICLOPS) Season 2 Funding Request | CELO | increaseAllowance | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 21,738,286 | 0 | 21,738,286 | `0x80e4b3307b76119f1bd436f36d6925a24e035fa3132bf13ca9b2c281f342f96c` |
| 2026-03-03 | 282 | [CGP-219](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0219.md) | Celo Communities Guild / Season 2 Funding Request | CELO | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 738,258 | 0 | 738,258 | `0x19e2c2dbf11903ca591d3b9cdbb7a319d281d9acb3d32583d8b5a5fb75a2d9fe` |
| 2026-05-17 | 289 | [CGP-237](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0237.md) | Allow CICLOPS to Complete Withdrawal of Season 2 Funding | CELO | increaseAllowance | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 697,777 | 0 | 697,777 | `0x74848f30fe2fd0ddad8942c09c86eba2aef6b8aad50beed7963c8d3dc5051f88` |
| 2026-05-17 | 289 | [CGP-237](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0237.md) | Allow CICLOPS to Complete Withdrawal of Season 2 Funding | USDm | increaseAllowance | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 101,298 | 0 | 101,298 | `0x74848f30fe2fd0ddad8942c09c86eba2aef6b8aad50beed7963c8d3dc5051f88` |
| 2026-08-06 | 302 | [CGP-246](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0246.md) | Stabila Season 3 Funding Proposal | CELO | increaseAllowance | `0x9c257bdc314dc516e673728d70f45444f6e22412` | 4,838,709.68 | 0 | 4,838,709.68 | `0x6ab4a53ba5341b78e07bfd71fca11075147cc7293659d200453a8949c8f00303` |
| 2026-08-06 | 303 | [CGP-247](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0247.md) | Celo Core Co. Season 3 Funding Proposal | CELO | increaseAllowance | `0xb0d0780eddc2fa35906c0b37b9b4dc7583c3dbb0` | 31,609,499 | 0 | 31,609,499 | `0xcaba97d3c63869aa8a1120a0ce5120ccb5e4f183aedf7490892c5b86467d8106` |
| 2026-08-10 | 304 | [CGP-248](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0248.md) | CICLOPS Season 3 Funding Proposal | CELO | increaseAllowance | `0xd71efa410b6eaab0bac3b515b393c886be70f09e` | 35,838,926 | 0 | 35,838,926 | `0xed3cb2e5c385968e610bcbdc9ef875bdccf07e6f0346d329b7820f856742562b` |
| 2026-08-13 | 306 | [CGP-250](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0250.md) | Celo Governance Guild / Season 2 Retro (H1 2026) & Funding Top-Up Request | CELO | approve | `0xc733285e8e4db433d4cd641f99c46bf108dcb54f` | 330,000 | 0 | 330,000 | `0x612c9a7dea25b1df8dc8a3d8a61268c7540b8ff99eb2a24977fe6701b4021b16` |
| 2026-09-03 | 309 | [CGP-242](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0242.md) | Celo Challenger Operator Funding | CELO | increaseAllowance | `0x68ce71d4ceca3003701ca6844d9a345925407455` | 1,312,500 | 0 | 1,312,500 | `0x2639e5d36fedc51ce63254616d2e47abd8a7a46b0b269312bbbe2059e72f3199` |
| 2026-09-09 | 311 | [CGP-251](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0251.md) | Celo Communities Guild / Season 3 Funding Request | CELO | approve | `0x0b6a6666027d90fd56f4a2e1827296db4d590f4d` | 551,000 | 0 | 551,000 | `0xfd99047bdd6a9ecc9b9656f5a11e6489572463c5476dc696983dfe4aeea7d981` |
