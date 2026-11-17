# Celo Community Fund Status

## Overview 

This repository is to keep a canonical history of the Celo Community Fund status and initiatives that have utilized the fund. Previously, the data was segregated and hard to decipher current initiatives that were in draft proposal phase, initiatives that had spend approval and the remaining funds available to them. It was also difficult to have a high level overview of the total funds.

## What is the fund?

The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.

The Community Fund receives assets from three sources:

- The Community Fund obtains a desired epoch reward defined as a fraction of the total desired epoch rewards (governable, initially planned to be 25%). This amount is subject to adjustment up or down in the event of under- or over-spending against the epoch rewards target schedule. The Community Fund epoch rewards may be redirected to bolster the Reserve.

- The Community Fund is the default destination for slashed assets.
- The Community Fund also receives the 'base' portion of transaction fees.


## History

| # | Name | Amount (CELO) | Proposal | Status |
|:---:|:---|---:|:---:|:---:|
| 1 | Celo Airdrop | 200,000 | [16](https://celo.stake.id/#/proposal/16) | Complete |
| 2 | CCF1 | 665,387 | [18](https://celo.stake.id/#/proposal/18) | Complete |
| 3 | Community Appreciation Gifts | 15,000 | [25](https://celo.stake.id/#/proposal/25) | Complete |
| 4 | Ocelot | 3,000,000 | [43](https://celo.stake.id/#/proposal/43) | Ongoing |
| 5 | Climate Collective | 4,000,000 | [60](https://celo.stake.id/#/proposal/60) | Ongoing |
| 6 | Prezenti (2 rounds) | 2,400,000 | [61](https://celo.stake.id/#/proposal/61), [89](https://celo.stake.id/#/proposal/89) | Ongoing |
| 7 | Africa DAO | 550,000 | [85](https://celo.stake.id/#/proposal/85) | Ongoing |
| 8 | Chainlink | 5,980,313 | [88](https://celo.stake.id/#/proposal/88) | Ongoing |
| 9 | Latam DAO | 903,000 | [96](https://celo.stake.id/#/proposal/96) | Ongoing |
| 10 | Celo Tribe | 70,000 | [101](https://celo.stake.id/#/proposal/101) | Ongoing |
| 11 | Europe DAO | 440,000 | [115](https://celo.stake.id/#/proposal/115) | Ongoing |
| 12 | Asia DAO | 333,030 | [120](https://celo.stake.id/#/proposal/120) | Ongoing |
| 13 | Mobile First Community | 120,000 | [123](https://celo.stake.id/#/proposal/123) | Ongoing |

## Drafts

| # | Name | Amount (CELO) | Proposal |
|:---:|:---|---:|:---:|
| 1 | India DAO Chitty | 270,000 | [CGP-0064](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0064.md) |
| 2 | India DAO Monish | 80,000 | N/A |
| 3 | ImmuneFi Bug Bounty | 1,500,000 | [CGP-0073](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0073.md) |
| 4 | Centrifuge Deployment | 400,000 | [CGP-0095](https://github.com/celo-org/governance/blob/main/CGPs/cgp-0095.md) |

## Adding an Initiative

Initiatives live in `src/data`, each file has instructions at the top:

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
- The estimated replenish rate per day of the fund
- Each initiative with its total amount approved, available amount left and a link to its governance proposal

## Development

Requires Node.js 20+.

```sh
npm install
npm run dev      # start the dev server
npm test         # run unit tests
npm run build    # production build into ./build
```

## CLI

`npm run status` prints the current on-chain status:

```
-------Community Fund-------
Contract Balance: <balance>
Ocelot: <remaining allowance>
...
-------Drafts-------
India DAO Chitty: 270,000
...
--------------------
Estimated Replenish Rate: ~18,000 per day
Funds Available (after allowances and drafts): <amount>
```

## Contributing

This is a community run project, all contributions are welcome. If you have feedback or a request please submit an issue. If you want to add additional information or correct information please submit a PR

## Pay it Forward

If you find this useful please support and vote for [TPT](https://www.thecelo.com/groupDetail/thepassivetrust)(The Passive Trust) Celo validator group.