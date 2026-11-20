# Organisations and History

The Ledger shows money per recipient address, exactly as the audit finds it. This page explains what is added on
top of it: who each recipient is, and the History page about the fund over time.

## Organisations on the Ledger, Overview and History

`src/data/organisations.js` is edited by hand, like `src/data/drafts.js`.

- `RECIPIENTS` maps each ledger recipient (its lower-case address, or `transfer:<title>` for a direct transfer) to
  an organisation. Several addresses can belong to one organisation: cLabs, for example, has the L2 transfers,
  Celo SHIELD and the Season 2 transfer.
- `ORGANISATIONS` gives each organisation a camp and a family, and an optional note shown on the Ledger.
- `npm test` fails when the generated ledger has a recipient with no line in `RECIPIENTS`, so a new spender needs a
  line here as well as a display name in `scripts/audit/gen_data.py`.

The Ledger's **Organisations** view adds up an organisation's recipients per token; amounts of different tokens are
never added together. The Overview's **Who the fund has paid** card shows paid-out CELO and USDm by camp.

Camps:

| Camp | Who | Notes |
|---|---|---|
| Celo companies & affiliates | cLabs, the Celo Foundation, Celo Core Co., CICLOPS, Stabila, Mento Reserve | CICLOPS was led from the Foundation (CGP-158). Stabila Foundation is a new entity funded in CGP-132 (May 2024) to accelerate stablecoin adoption on Celo. The liquidity sent to the Mento Reserve Safe in CGP-69 is Mento's, not the fund's. Both still file their own budgets, so they are not merged into Celo Core Co. |
| Community initiatives | Grant stewards, builder programs, regional and community DAOs | Ocelot, the Celo Ecosystem Treasury (CGP-38), is a 5-of-9 multisig of ecosystem members and counts here, not under cLabs. |
| Governance & community operations | Celo Governance Guild, Celo Communities Guild, Score Management Committee | The groups that run governance, the community spaces and network operations. The Season 1 framework (CGP-189) set community operations apart from other community funding; this camp follows that idea. |
| External partners & vendors | Opera (MiniPay), Credit Collective, Chainlink, Centrifuge, accelerators, Artemis, oracle providers | Opera's 160M CELO stake (CGP-232) came from the unreleased treasury, not the Community Fund, so it is not in the Ledger. |
| Protocol & treasury operations | The CELO airdrop to USDm holders, governance approver gas, liquidity the fund owns | Money the protocol spends on itself rather than a grant to an organisation. |

## The History page

The page is only about the Community Fund: what it paid, what came in, how funding proposals were decided and
what running that process costs. Proposals that never touched the fund (Mento, network parameters, upgrades) are
left out.

### Live parts

These are worked out in the browser from `src/data/ledger.js` and `src/data/organisations.js`
(`src/lib/history.js`), so they update with every audit:

- **CELO and USDm approved each year**, by camp. Approved is the `effective` change of each grant in the year its
  proposal executed. An allowance that a later proposal lowered counts as negative.
- **Every grant** on the movement map and in the full grant timeline.
- **Today's value** of CELO in dollar-priced proposals, at the Chainlink CELO/USD price on Celo.

### CELO's price

Almost all of the fund is CELO, and CELO's price has moved from above $1 to below $0.10. The page does not use a
third-party price history. Instead:

- Approvals are shown in tokens, not dollars, so years are not compared at different prices.
- "Asked in dollars, paid in CELO" uses only the proposals that set their budget in dollars. The dollar value of
  the CELO part comes from the proposal (its total, minus any stablecoin or other part it names), and the price is
  that value divided by the CELO. A proposal that adds a buffer for price moves shows a price below the market.
- Today's value is that CELO at the live feed price.

Neither number is what a recipient got. Allowances are claimed over months and recipients sell when they choose,
which is not visible on-chain.

### Snapshot parts

`src/data/fundHistory.js` is a dated snapshot (19 Nov 2026), edited by hand. The daily audit does not refresh it.

- `FUND_PROPOSALS`: CGPs that asked the Community Fund for money, or that moved fund money according to the
  ledger (99 CGPs). Opera's stake (CGP-232) is excluded. Outcomes, Yes and No totals, voters and submitters come
  from the [Celo Mondo](https://github.com/celo-org/celo-mondo) database dump up to block 51,131,316 (about
  14 Nov 2025) and Governance contract logs read from forno.celo.org after that. Each CGP has one proposing
  organisation, assigned by hand from its author line and text; its camp follows the camps above. Passed is
  executed out of executed, rejected and expired; opposed means No reached 10% or more of Yes and No.
  Guild submitters are identified from the Safe signer lists in CGP-152, CGP-153 and CGP-223.
- `PRICED`: the dollar amount, CELO and other parts as written in each proposal's text.
- `INFLOWS`: one-off CELO moved into the fund. Amounts marked as stated come from the CGP text (CGP-156 lists the
  earlier Mento returns); the others were read on-chain in [audit.md](audit.md).
- `PROCESS`: who ran the proposal process, one period per group and advisor (a period has at most one
  advisor), from the editor lists, commits and merges in
  [celo-org/governance](https://github.com/celo-org/governance), the Celo forum and the governance call notes.
  What the fund paid in each period comes from CGP-115, CGP-141, CGP-152, CGP-223 and CGP-250.
- `PEOPLE`: one entry per person named in `PROCESS`, with the GitHub login and Celo forum username that link
  each mention to the same account.
- `MAP` and `MOVES`: the lanes of the movement map and their spin-outs and merges. Each lane lists the
  organisations whose ledger grants are drawn on it. Founding is shown as 2017-18 because sources differ; the
  cLabs and Celo Foundation unification is dated to its announcement in January 2026, and Celo Core Co. was first
  funded as one organisation in Season 3 (CGP-247). A segment with no end runs to today.
- `ERAS`: one short paragraph per year of the fund.

To update a figure, edit the snapshot, change the date at the top, and say where the new number comes from in the
pull request.
