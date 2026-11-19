import React from 'react';
import Columns from '../components/Columns';
import MovementMap, { MapLegend } from '../components/MovementMap';
import { history } from '../data/history';
import { campLabel } from '../lib/organisations';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';
const pct = (part, whole) => (whole > 0 ? `${Math.round((100 * part) / whole)}%` : '–');
const passRate = (r) => pct(r.passed, r.passed + r.notPassed);

const CAMP_SERIES = [
  { key: 'companies', label: campLabel('companies'), className: 'camp-companies' },
  { key: 'community', label: campLabel('community'), className: 'camp-community' },
  { key: 'partners', label: campLabel('partners'), className: 'camp-partners' },
];

function Figure({ value, label, note }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  );
}

export default function HistoryPage() {
  const { totals, years, types, camps, eras, map, moves, snapshot } = history;
  const decided = totals.passed + totals.notPassed;
  const peak = years.reduce((a, b) => (b.total > a.total ? b : a));
  const maxType = Math.max(...types.map((t) => t.cgps));

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">History</p>
        <h1 className="display">How Celo&apos;s organisations, and the proposals that funded them, moved.</h1>
        <p className="lede">
          Two founding organisations spun out new teams and came back together as Celo Core Co. A single Community Fund
          became a crowd of stewards, DAOs and guilds. This page follows both, from the first proposal in 2020 to today.
        </p>
      </header>

      <section className="stats" aria-label="Governance in numbers">
        <Figure value={totals.cgps} label="Proposals written" note="Every CGP in celo-org/governance, April 2020 to today" />
        <Figure value={pct(totals.passed, decided)} label="Passed" note={`${totals.passed} of the ${decided} that reached a decision`} />
        <Figure value={totals.submissions} label="On-chain submissions" note="Including resubmissions of the same CGP" />
        <Figure value={totals.contested} label="Contested votes" note="Votes where No reached 10% or more of Yes and No" />
      </section>

      <div className="stack">
        <section className="card" aria-labelledby="map-heading">
          <div className="card-head">
            <div>
              <h2 className="section-title" id="map-heading">The movement map</h2>
              <p className="muted">
                A line runs while an organisation operates or is funded. Splits are spin-outs, joins are merges, and the
                shaded box is the year CeloPG paid community programs from one budget.
              </p>
            </div>
          </div>
          <MapLegend />
          <MovementMap map={map} eras={eras} />
          <details className="template">
            <summary>Read the map as a list</summary>
            <ul className="rows" style={{ marginTop: '0.75rem' }}>
              {moves.map((m) => (
                <li key={m.when}><div className="row-main"><span className="row-title">{m.when}</span></div><p className="row-meta"><span>{m.what}</span></p></li>
              ))}
            </ul>
          </details>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            CICLOPS and Stabila still file their own budgets, so they run beside Celo Core Co. rather than into it.
            Ocelot was a 5-of-9 multisig of ecosystem members, not a cLabs program.
          </p>
        </section>

        <div className="grid-2">
          <section className="card" aria-labelledby="years-heading">
            <h2 className="section-title" id="years-heading">Proposals per year, by who wrote them</h2>
            <p className="muted">Volume peaked at {peak.total} in {peak.year}. Under each year, the share of decided proposals that passed.</p>
            <Columns
              rows={years}
              xKey="year"
              series={CAMP_SERIES}
              label="Proposals written per year by camp of the proposer"
              foot={(r) => `${passRate(r)} passed`}
              highlight={(r) => r.year === peak.year}
            />
          </section>

          <section className="card" aria-labelledby="camps-heading">
            <h2 className="section-title" id="camps-heading">Who writes the proposals</h2>
            <p className="muted">Community proposals pass less often and meet the most opposition.</p>
            <table className="table stackable" style={{ marginTop: '1rem' }}>
              <thead>
                <tr><th>Camp</th><th className="num">Proposals</th><th className="num">Passed</th><th className="num">Contested</th></tr>
              </thead>
              <tbody>
                {camps.map((c) => (
                  <tr key={c.key}>
                    <td data-label="Camp"><span className="org-tag"><span className={`swatch camp-${c.key}`} aria-hidden="true" />{campLabel(c.key)}</span></td>
                    <td className="num" data-label="Proposals">{c.cgps} <span className="muted">({pct(c.cgps, totals.cgps)})</span></td>
                    <td className="num" data-label="Passed">{passRate(c)}</td>
                    <td className="num" data-label="Contested">{c.contested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: '0.75rem' }}>
              Camp of the organisation that wrote the proposal. Passed is executed out of executed, rejected and expired.
              Contested means No reached 10% or more of Yes and No.
            </p>
          </section>
        </div>

        <section className="card" aria-labelledby="types-heading">
          <h2 className="section-title" id="types-heading">What gets proposed</h2>
          <p className="muted">More than a third of proposals ask the fund for money, and they are the least likely to pass.</p>
          <ul className="rows type-rows" style={{ marginTop: '1rem' }}>
            {types.map((t) => (
              <li key={t.type}>
                <div className="type-row">
                  <span>
                    <span className="row-title">{t.type}</span>
                    <span className="small muted" style={{ display: 'block' }}>{t.what}</span>
                  </span>
                  <span className="type-bar" aria-hidden="true"><span style={{ width: `${(t.cgps / maxType) * 100}%` }} /></span>
                  <span className="num">{t.cgps}</span>
                  <span className="num muted">{passRate(t)} passed</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="eras-heading">
          <h2 className="section-title" id="eras-heading">Six eras</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            {eras.map((e) => (
              <li key={e.name}>
                <div className="row-main"><span className="row-title">{e.name}</span><span className="muted">{e.years}</span></div>
                <p className="row-meta"><span>{e.what ?? e.text}</span></p>
              </li>
            ))}
          </ul>
        </section>

        <p className="small muted">
          Snapshot of {snapshot}. Proposals come from celo-org/governance, outcomes from on-chain events, and types and
          camps are assigned by hand. <a href={`${REPO}/blob/main/docs/history.md`} target="_blank" rel="noopener noreferrer">How this page is made</a>.
        </p>
      </div>
    </>
  );
}
