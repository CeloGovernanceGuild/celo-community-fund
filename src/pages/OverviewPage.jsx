import React, { useEffect, useState } from 'react';
import Amount from '../components/Amount';
import { ClaimProgress, SegmentedBar } from '../components/Charts';
import { fetchMarket } from '../lib/celo';
import { formatUsd } from '../lib/format';

const cgpUrl = (n) => `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(n).padStart(4, '0')}.md`;

function Stat({ label, wei, unit = 'CELO', note }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value"><Amount wei={wei} /> <span className="stat-unit">{unit}</span></p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  );
}

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
          Every grant approved by Celo governance: how much was approved, how much has been claimed and
          how much is still available. Read live from the chain.
        </p>
        <div className="actions">
          <a className="button primary" href="#/ledger">Explore the ledger</a>
          <a className="link-arrow" href="#/about">How to read this</a>
        </div>
      </header>

      <section className="stats" aria-label="Key figures">
        <Stat label="Fund balance" wei={celo.balance} note={usd(celo.balance) ?? 'CELO held by the governance contract'} />
        <Stat label="Available" wei={celo.available} note="Not committed to any grant or pending proposal" />
        <Stat label="Committed" wei={celo.open} note={`Approved and not yet claimed, across ${open.length} grants`} />
        <Stat label="Claimed all time" wei={celo.claimed} note="Already paid out to grant recipients" />
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
                  <ClaimProgress claimed={r.claimed} remaining={r.remaining} />
                  <p className="row-meta">
                    <span>Claimed <Amount wei={r.claimed} /> of <Amount wei={r.approved} /></span>
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
                    <a href={cgpUrl(g.cgp)} target="_blank" rel="noopener noreferrer">CGP-{g.cgp}</a>
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
