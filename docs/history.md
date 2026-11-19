# Organisations, History and Participation

The Ledger shows money per recipient address, exactly as the audit finds it. This page explains the context
added on top of it: who each recipient is, and how governance itself has worked since 2020.

## Organisations on the Ledger and Overview

`src/data/organisations.js` is edited by hand, like `src/data/drafts.js`.

- `RECIPIENTS` maps each ledger recipient (its lower-case address, or `transfer:<title>` for a direct
  transfer) to an organisation. Several addresses can belong to one organisation: cLabs, for example, has
  the L2 transfers, Celo SHIELD and the Season 2 transfer.
- `ORGANISATIONS` gives each organisation a camp and a family, and an optional note shown on the Ledger.
- `npm test` fails when the generated ledger has a recipient with no line in `RECIPIENTS`, so a new spender
  needs a line here as well as a display name in `scripts/audit/gen_data.py`.

The Ledger's **Organisations** view adds up an organisation's recipients per token; amounts of different
tokens are never added together. The Overview's **Who the fund has paid** card shows paid-out CELO and USDm by
camp.

Camps:

| Camp | Who | Notes |
|---|---|---|
| Celo companies & affiliates | cLabs, the Celo Foundation, Celo Core Co., CICLOPS, Stabila | CICLOPS was led from the Foundation (CGP-158); Stabila took on stablecoin and liquidity work the Foundation handed off (CGP-132). Both still file their own budgets, so they are not merged into Celo Core Co. |
| Community initiatives | Grant stewards, guilds, regional and community DAOs, governance operations | Ocelot, the Celo Ecosystem Treasury (CGP-38), is a 5-of-9 multisig of ecosystem members and counts here, not under cLabs. |
| External partners & vendors | Opera (MiniPay), Credit Collective, Chainlink, Centrifuge, accelerators, Artemis, oracle providers | Opera's 160M CELO stake (CGP-232) came from the Unreleased Treasury, not the Community Fund, so it is not in the Ledger. |
| Protocol & treasury operations | The CELO airdrop to cUSD holders, oracle and approver gas, liquidity the fund owns | Money the protocol spends on itself rather than a grant to an organisation. |

## History and Participation pages

`src/data/history.js` and `src/data/participation.js` are a dated snapshot (19 Nov 2026). The daily audit does
not refresh them.

Sources:

- Proposals: every CGP file in [celo-org/governance](https://github.com/celo-org/governance) (CGP-1 to CGP-257),
  matched to on-chain proposals 1 to 317.
- Outcomes, votes and submitters: the [Celo Mondo](https://github.com/celo-org/celo-mondo) database dump up to
  block 51,131,316 (about 14 Nov 2025), then Governance contract logs read from forno.celo.org up to
  19 Nov 2026. Turnout is only available for the first part.
- Maintenance: pull requests, reviews and call-agenda issues in celo-org/governance from the GitHub search API,
  and the repository's `Call_Log.md`.

Method:

- Each CGP has one type (funding, Mento, parameters, upgrades, strategy, governance process) and one proposing
  organisation, assigned by hand from its title, author line and text. The proposer's camp follows the same
  camps as above; CGP-38 counts under Ocelot.
- Passed means executed out of executed, rejected and expired. Contested means No reached 10% or more of Yes
  and No.
- Guild submitters are identified from the Safe signer lists in CGP-152, CGP-153 and CGP-223. Other submitting
  addresses are not named.
- "Guild" in the maintenance table counts the people who later formed it (0xj4an, 0xzoz, 0xGoldo and the
  celogovernance account), including the unpaid years before 2024.
- The movement map marks a line from first funding or founding to the end of the last funded period. Founding
  is shown as 2017–18 because sources differ. The cLabs and Celo Foundation unification is dated to its
  announcement in January 2026; Celo Core Co. was first funded as one organisation in Season 3 (CGP-247).

To update a figure, edit the snapshot file and the date in its header, and say where the new number comes from
in the pull request.
