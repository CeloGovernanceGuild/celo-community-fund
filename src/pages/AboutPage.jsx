import React from 'react';
import { COMMUNITY_FUND_EXPLORER, REPL_RATE } from '../data/data';
import { AUDIT_BLOCK } from '../data';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';

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
              <a className="link-arrow" href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer">Governance contract</a>
            </div>
          </section>
        </div>

        <section className="card">
          <h2 className="section-title">How the fund is replenished</h2>
          <p style={{ marginTop: '0.75rem', maxWidth: '48rem' }}>
            The fund receives a share of epoch rewards, slashed assets and part of transaction fees. Since Celo became a
            layer 2 that regular inflow is small, about {REPL_RATE} CELO a day. Large grants are funded from the Reserve or the
            unreleased treasury in the same proposal that approves them.
          </p>
        </section>

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
