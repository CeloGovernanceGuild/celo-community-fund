import React, { useEffect, useState } from 'react';
import Amount from '../components/Amount';
import { ClaimProgress, SegmentedBar } from '../components/Charts';
import { COMMUNITY_FUND_EXPLORER, GOVERNANCE_ADDRESS, tokenHolderUrl, txUrl } from '../data/data';
import { fetchMarket } from '../lib/celo';
import { formatUsd } from '../lib/format';

const cgpUrl = (n) => `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(n).padStart(4, '0')}.md`;

function Stat({ label, wei, unit = 'CELO', note, link }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value"><Amount wei={wei} /> <span className="stat-unit">{unit}</span></p>
      {note && <p className="stat-note">{note}</p>}
      {link}
    </div>
  );
}

const Out = ({ href, children }) => (
  <a className="stat-link link-out" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

export default function OverviewPage({ state }) {
  const [celoPrice, setCeloPrice] = useState(null);
  const celo = state.tokens.CELO;
  const usdm = state.tokens.USDm;

  useEffect(() => {
    let cancelled = false;
    fetchMarket().then((m) => { if (!cancelled) setCeloPrice(m.prices.CELO); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const open = state.rows.filter((r) => r.token === 'CELO' && r.remaining > 0n).sort((a, b) => (a.remaining < b.remaining ? 1 : -1));
  const latest = state.rows
    .flatMap((r) => r.grants.map((g) => ({ ...g, title: r.title, token: r.token })))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const usd = (wei) => (celoPrice ? `About ${formatUsd(wei, celoPrice)}` : null);

  return (
    <>
      <header>
        <p className="eyebrow">Celo governance treasury</p>
        <h1 className="display">Where the Community Fund stands today.</h1>
        <p className="lede">
          Everything governance approved from the Community Fund: how much was approved, how much has been paid
          out and how much is still available. Read live from the chain.
        </p>
        <div className="actions">
          <a className="button primary" href="#/ledger">Explore the ledger</a>
          <a className="link-arrow" href="#/about">How to read this</a>
        </div>
      </header>

      <section className="stats" aria-label="Key figures">
        <Stat
          label="Fund balance"
          wei={celo.balance}
          note={usd(celo.balance) ?? 'CELO held by the governance contract'}
          link={<Out href={tokenHolderUrl('CELO', GOVERNANCE_ADDRESS)}>Check the balance on Celoscan</Out>}
        />
        <Stat
          label="Available"
          wei={celo.available}
          note="Not committed to any grant, pending proposal or proposal deposit"
          link={<a className="stat-link" href="#/balances">See how it is calculated</a>}
        />
        <Stat
          label="Committed"
          wei={celo.open}
          note={`Approved and not yet paid out, across ${open.length} open allowances`}
          link={<a className="stat-link" href="#/ledger?status=open">See the open allowances</a>}
        />
        <Stat
          label="Paid out"
          wei={celo.paidOut}
          note="Claimed from allowances, plus direct transfers"
          link={<Out href={tokenHolderUrl('CELO', GOVERNANCE_ADDRESS)}>See fund outflows on Celoscan</Out>}
        />
      </section>

      <div className="stack">
        <section className="card" aria-labelledby="composition-title">
          <div className="card-head">
            <div>
              <h2 className="section-title" id="composition-title">What the balance is made of</h2>
              <p className="muted">Committed CELO is still in the fund until each recipient claims it.</p>
            </div>
          </div>
          <SegmentedBar segments={state.composition} unit="CELO" label="Fund balance" />
          <div className="actions">
            <a className="link-out" href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer">Open the fund contract on Celoscan</a>
          </div>
        </section>

        {usdm.available < 0n && (
          <p className="notice" role="note">
            <span>
              <strong>Stablecoin allowances are not backed.</strong>{' '}
              Open USDm allowances add up to <Amount wei={usdm.open} /> USDm but the fund holds <Amount wei={usdm.balance} /> USDm.
              A claim above the balance fails. <a href="#/balances">See balances</a>
            </span>
          </p>
        )}

        <div className="grid-2">
          <section className="card" aria-labelledby="open-title">
            <div className="card-head">
              <h2 className="section-title" id="open-title">Open CELO allowances</h2>
              <a className="link-arrow" href="#/ledger">Full ledger</a>
            </div>
            <ul className="rows">
              {open.slice(0, 6).map((r) => (
                <li key={r.address}>
                  <div className="row-main">
                    <span className="row-title">{r.title}</span>
                    <span className="num"><Amount wei={r.remaining} /> CELO left</span>
                  </div>
                  <ClaimProgress claimed={r.paidOut} remaining={r.remaining} />
                  <p className="row-meta">
                    <span>Claimed <Amount wei={r.paidOut} /> of <Amount wei={r.approved} /></span>
                    <a className="link-out" href={tokenHolderUrl('CELO', r.address)} target="_blank" rel="noopener noreferrer">See its claims on Celoscan</a>
                  </p>
                </li>
              ))}
            </ul>
            {open.length > 6 && <p className="small muted" style={{ marginTop: '0.75rem' }}>And {open.length - 6} more with small amounts left.</p>}
          </section>

          <section className="card" aria-labelledby="latest-title">
            <div className="card-head">
              <h2 className="section-title" id="latest-title">Latest grants</h2>
              <a className="link-arrow" href="#/proposals">Pending proposals</a>
            </div>
            <ul className="rows">
              {latest.map((g) => (
                <li key={`${g.tx}-${g.to}-${g.token}`}>
                  <div className="row-main">
                    <span className="row-title">{g.title}</span>
                    <span className="num"><Amount wei={g.effective} /> {g.token}</span>
                  </div>
                  <p className="row-meta">
                    <span>{g.date}</span>
                    <a href={cgpUrl(g.cgp)} target="_blank" rel="noopener noreferrer">Proposal CGP-{g.cgp}</a>
                    <a className="link-out" href={txUrl(g.tx)} target="_blank" rel="noopener noreferrer">Transaction on Celoscan</a>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
