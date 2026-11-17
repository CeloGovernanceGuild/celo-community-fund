# Celo Community Fund Status

## Overview 

This repository is to keep a canonical history of the Celo Community Fund status and initiatives that have utilized the fund. Previously, the data was segregated and hard to decipher current initiatives that were in draft proposal phase, initiatives that had spend approval and the remaining funds available to them. It was also difficult to have a high level overview of the total funds.

## What is the fund?

The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.

The Community Fund receives assets from three sources:

- The Community Fund obtains a desired epoch reward defined as a fraction of the total desired epoch rewards (governable, initially planned to be 25%). This amount is subject to adjustment up or down in the event of under- or over-spending against the epoch rewards target schedule. The Community Fund epoch rewards may be redirected to bolster the Reserve.

- The Community Fund is the default destination for slashed assets.
- The Community Fund also receives the 'base' portion of transaction fees.


## Initiatives

Initiative data in `src/data` is generated from an on-chain audit of every executed governance
proposal: see [docs/audit.md](docs/audit.md) for the full list of grants, execution transactions and
findings, and [scripts/audit](scripts/audit) to re-run it.

As of Celo block 83009701: 5 spenders still hold a CELO allowance,
34 initiatives are completed, and there are no pending funding proposals.

| Active initiative | Approved (CELO) | Remaining allowance (CELO) | CGPs |
|:---|---:|---:|:---|
| CCF1 | 665,387.00 | 6,472.79 | [17](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0017.md) |
| Community Appreciation Gifts | 15,000.00 | 14,300.00 | [20](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0020.md) |
| Africa DAO | 550,000.00 | 989.90 | [68](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0068.md) |
| CeloPG H2 2024 (second spender) | 1,250,000.00 | 1,250,000.00 | [141](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md) |
| CICLOPS | 69,426,799.00 | 37,597,705.00 | [158](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0158.md), [202](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0202.md), [231](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0231.md), [237](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0237.md), [248](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0248.md) |

## Adding an Initiative

Re-run the audit (`scripts/audit/run.sh`) after new proposals execute; it regenerates the files below.
Drafts are the only file edited by hand. Each file has instructions at the top:

- `drafts.js`: proposals expected to go to governance (their amounts are reserved from the funds available)
- `active_initiatives.js`: approved spend allowances, read on-chain
- `completed_initiatives.js`: fully used spend allowances

Flow: Draft -> Active Initiative -> Completed Initiative.

## Webpage

> Note: the page only tracks CELO held by the Community Fund.

[celocommunityfund.xyz](https://www.celocommunityfund.xyz) shows the current CELO balance of the [governance contract](https://celoscan.io/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972) (Celo Community Fund) and a sunburst chart with a high level breakdown of its contents. This consists of 3 elements:

1. The currently available funds that are not allocated
2. The funds allocated via spend approvals (allowances) to their respective addresses
3. An aggregate of the draft proposals anticipating to go to governance (this is taken from no. 1 above)

The switch above the chart toggles between the **Lifetime** view (including CELO already spent by initiatives) and the **Current** view.

### Info

Clicking the info button at the top right gives a more detailed overview, including:

- What is the Celo Community Fund
- The regular daily CELO inflow to the fund
- Each initiative with its total amount approved, available amount left and a link to its governance proposal

## Development

Requires Node.js 22 (see `.nvmrc`).

```sh
npm ci
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # production build into ./build
```

### Project structure

```
src/
  data/                 initiative data, the only place to edit when governance changes
    data.js             contract addresses, colors, regular inflow
    active_initiatives.js
    completed_initiatives.js
    drafts.js
    index.js            combines the lists above
  lib/
    celo.js             on-chain reads (viem): fund balance and allowances
    fund.js             pure derivation of chart and table data (tested)
  components/           Table and icons
  App.jsx               page
scripts/status.js       CLI version of the dashboard (npm run status)
.github/workflows/      CI (test-and-build) and branch flow checks
```

### Branches and releases

`feature branch -> dev -> main`. `dev` and `main` are protected: changes go
through pull requests with passing CI, and only `dev` can be merged into
`main`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## CLI

`npm run status` prints the current on-chain status:

```
-------Community Fund-------
Contract Balance: <balance>
CICLOPS: <remaining allowance>
...
-------Drafts-------
--------------------
Regular inflow: ~30 CELO per day
Funds Available (after allowances and drafts): <amount>
```

## Contributing

This is a community run project, all contributions are welcome. If you have feedback or a request please submit an issue. If you want to add additional information or correct information please submit a PR

## Pay it Forward

If you find this useful please support and vote for [TPT](https://www.thecelo.com/groupDetail/thepassivetrust)(The Passive Trust) Celo validator group.