import React from 'react';
import {
  CELO_USD_FEED,
  COMMUNITY_FUND_EXPLORER,
  EUR_USD_FEED,
  GOVERNANCE_ADDRESS,
  REPL_RATE,
  RESERVE_ADDRESS,
  TOKEN_ADDRESSES,
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

        <section className="card">
          <h2 className="section-title">How the fund is replenished</h2>
          <p style={{ marginTop: '0.75rem', maxWidth: '48rem' }}>
            The fund receives a share of epoch rewards, slashed assets and part of transaction fees. Since Celo became a
            layer 2 that regular inflow is small, about {REPL_RATE} CELO a day. Large grants are funded from the Reserve or the
            unreleased treasury in the same proposal that approves them.
          </p>
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
