import React from 'react';
import {
  CELO_USD_FEED,
  COMMUNITY_FUND_EXPLORER,
  EUR_USD_FEED,
  FEE_HANDLER,
  GOVERNANCE_ADDRESS,
  GOVERNANCE_APPROVER,
  OPERATIONS_SAFE,
  REPL_RATE,
  RESERVE_ADDRESS,
  REVENUE_REPORTS_URL,
  SEQUENCER_FEE_VAULT,
  TOKEN_ADDRESSES,
  UNRELEASED_TREASURY,
  addressUrl,
} from '../data/data';
import { CreditsCard } from '../components/Credits';
import { AUDIT_BLOCK } from '../data';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';

const CONTRACTS = [
  { name: 'Community Fund (Governance contract)', what: 'Holds the fund and executes proposals', address: GOVERNANCE_ADDRESS },
  { name: 'CELO token', what: 'Balance and allowances in CELO', address: TOKEN_ADDRESSES.CELO },
  { name: 'USDm token', what: 'Balance and allowances in USDm', address: TOKEN_ADDRESSES.USDm },
  { name: 'EURm token', what: 'Balance and allowances in EURm', address: TOKEN_ADDRESSES.EURm },
  { name: 'Governance approver multisig', what: 'Must approve a proposal before it can execute (3 of 14 signers)', address: GOVERNANCE_APPROVER },
  { name: 'Celo Operations Safe', what: 'Collects network fee revenue and sends the net amount to the fund (2 of 5 signers)', address: OPERATIONS_SAFE },
  { name: 'FeeHandler', what: 'Gas fees, forwarded to the Celo Operations Safe', address: FEE_HANDLER },
  { name: 'Sequencer fee vault', what: 'Layer 2 sequencer fees, withdrawn to the Celo Operations Safe', address: SEQUENCER_FEE_VAULT },
  { name: 'CeloUnreleasedTreasury', what: 'Daily protocol payment and CELO for large grants', address: UNRELEASED_TREASURY },
  { name: 'Reserve', what: 'Source of CELO for large grants', address: RESERVE_ADDRESS },
  { name: 'Chainlink CELO / USD', what: 'Price used for USD values', address: CELO_USD_FEED },
  { name: 'Chainlink EUR / USD', what: 'Price used for USD values', address: EUR_USD_FEED },
];

export default function AboutPage() {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">About</p>
        <h1 className="display">A public account of a public fund.</h1>
        <p className="lede">
          The Community Fund pays for the upkeep and growth of Celo. CELO holders decide how it is spent
          through governance proposals. This site shows where that money went.
        </p>
      </header>

      <div className="stack">
        <div className="grid-2">
          <section className="card">
            <h2 className="section-title">How to read the numbers</h2>
            <ul className="rows" style={{ marginTop: '1rem' }}>
              <li><strong>Approved.</strong> What governance granted a recipient, added up across all its proposals.</li>
              <li><strong>Claimed.</strong> What the recipient has already taken out of the fund.</li>
              <li><strong>Remaining.</strong> What the recipient can still take. It stays in the fund until then, which is why it counts as committed.</li>
              <li><strong>Available.</strong> The fund balance minus everything committed and every pending funding request.</li>
            </ul>
          </section>

          <section className="card">
            <h2 className="section-title">Where the data comes from</h2>
            <ul className="rows" style={{ marginTop: '1rem' }}>
              <li>Balances and remaining allowances are read from the Celo network every time you open the site.</li>
              <li>Grants come from an audit of every governance proposal executed on-chain, matched against the proposal texts. Latest snapshot: block {AUDIT_BLOCK}.</li>
              <li>Amounts are tracked to the last decimal and shown in whole units. Hover any number for the exact value. Less than one unit shows as &lt;1, never as zero.</li>
            </ul>
            <div className="actions">
              <a className="link-arrow" href={`${REPO}/blob/main/docs/audit.md`} target="_blank" rel="noopener noreferrer">Audit report</a>
              <a className="link-out" href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer">Open the fund contract on Celoscan</a>
            </div>
          </section>
        </div>

        <section className="card" aria-labelledby="how-title">
          <h2 className="section-title" id="how-title">How the fund works</h2>
          <p className="muted">From the fees people pay on Celo to the grants governance approves.</p>
          <ol className="how">
            <li>
              <h3>1. Money comes in</h3>
              <ul className="rows">
                <li>
                  <strong>Network fees.</strong> Gas and sequencer fees are collected by the{' '}
                  <a href={addressUrl(OPERATIONS_SAFE)} target="_blank" rel="noopener noreferrer">Celo Operations Safe</a>.
                  Fees paid in stablecoins are used to buy CELO. Every two weeks the Safe sends the fund what is left
                  after the cost of running the layer 2 and a 15% revenue share with the OP Superchain. There is no
                  proposal per payment; Celo Core Co. publishes{' '}
                  <a href={REVENUE_REPORTS_URL} target="_blank" rel="noopener noreferrer">each one on the Celo forum</a>.
                </li>
                <li>
                  <strong>Daily protocol payment.</strong> About {REPL_RATE} CELO a day from the{' '}
                  <a href={addressUrl(UNRELEASED_TREASURY)} target="_blank" rel="noopener noreferrer">unreleased treasury</a>.
                </li>
                <li>
                  <strong>Top-ups and returns.</strong> A proposal can bring CELO from the Reserve or the unreleased
                  treasury in the same execution that grants it, and unused funds are sometimes returned.
                </li>
              </ul>
            </li>
            <li>
              <h3>2. CELO holders decide</h3>
              <ul className="rows">
                <li>Anyone can write a Celo Governance Proposal (CGP) and submit it on-chain.</li>
                <li>
                  The{' '}
                  <a href={addressUrl(GOVERNANCE_APPROVER)} target="_blank" rel="noopener noreferrer">approver multisig</a>{' '}
                  (3 of its 14 signers) has to approve it, and holders of locked CELO vote on it.
                </li>
                <li>If it passes, the Governance contract executes it. That contract is the fund, so the proposal moves the money itself.</li>
              </ul>
            </li>
            <li>
              <h3>3. Money goes out</h3>
              <ul className="rows">
                <li>
                  <strong>Allowance.</strong> Most grants only authorize the recipient to withdraw up to an amount.
                  The CELO stays in the fund until the recipient takes it, which is why open allowances count as committed.
                </li>
                <li><strong>Direct transfer.</strong> A few proposals send the funds at execution, with nothing left to claim.</li>
              </ul>
              <div className="actions">
                <a className="link-arrow" href="#/ledger">See every grant in the ledger</a>
              </div>
            </li>
          </ol>
        </section>

        <section className="card" aria-labelledby="contracts-title">
          <h2 className="section-title" id="contracts-title">Check it yourself on-chain</h2>
          <p className="muted">Every number on this site comes from these contracts. Each one opens on Celoscan.</p>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            {CONTRACTS.map((c) => (
              <li key={c.address}>
                <div className="row-main">
                  <span className="row-title">{c.name}</span>
                  <a className="link-out" href={addressUrl(c.address)} target="_blank" rel="noopener noreferrer">Open on Celoscan</a>
                </div>
                <p className="row-meta"><span>{c.what}</span><span className="mono">{c.address}</span></p>
              </li>
            ))}
          </ul>
        </section>

        <CreditsCard />

        <section className="card">
          <h2 className="section-title">Found something wrong?</h2>
          <p style={{ marginTop: '0.75rem', maxWidth: '48rem' }}>
            The code and the audit scripts are open. Open an issue or a pull request and it will be checked against the chain.
          </p>
          <div className="actions">
            <a className="button" href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Report an issue</a>
            <a className="link-arrow" href={REPO} target="_blank" rel="noopener noreferrer">Source code</a>
          </div>
        </section>
      </div>
    </>
  );
}
