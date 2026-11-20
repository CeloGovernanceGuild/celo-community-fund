import React, { useEffect, useMemo, useState } from 'react';
import Columns from '../components/Columns';
import GrantTimeline from '../components/GrantTimeline';
import MovementMap, { MapLegend } from '../components/MovementMap';
import PriceChart from '../components/PriceChart';
import { ledger } from '../data';
import { CAMPS } from '../data/organisations';
import { ERAS, FUND_PROPOSALS, INFLOWS, MAP, MOVES, PEOPLE, PRICED, PROCESS, SNAPSHOT } from '../data/fundHistory';
import { fetchCeloPrice } from '../lib/celo';
import { formatWhole } from '../lib/format';
import { approvedByYear, grantTimeline, ledgerGrants, pricedProposals, pricedTotals, wholeTokens } from '../lib/history';
import { campLabel } from '../lib/organisations';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';
const CGP_URL = (n) => `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(n).padStart(4, '0')}.md`;
const number = new Intl.NumberFormat('en-US');
const pct = (part, whole) => (whole > 0 ? `${Math.round((100 * part) / whole)}%` : '-');
const passRate = (r) => pct(r.passed, r.passed + r.notPassed);

/** 1.2M, 640k, 900: short labels for chart columns. */
function compact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `${Math.round(n / 1e6)}M`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(Math.round(n));
}
const dollars = (n) => `$${number.format(Math.round(n))}`;

/** A person from PEOPLE, linked to their GitHub profile, or to their forum profile when there is none. */
function Person({ id }) {
  const p = PEOPLE[id];
  const href = p.github ? `https://github.com/${p.github}` : `https://forum.celo.org/u/${p.forum}`;
  const accounts = [p.github && `GitHub @${p.github}`, `forum @${p.forum}`].filter(Boolean).join(', ');
  return (
    <a href={href} target="_blank" rel="noreferrer" title={accounts}>
      {p.name}
    </a>
  );
}

/** "$54,000 + $1,000 other expenses": payments first, then any other line with its name. */
function amounts(items) {
  return items.map((c, i) => (
    <span key={c.item}>
      {i > 0 && ' + '}
      <strong>{c.usd === null ? 'not itemized' : dollars(c.usd)}</strong>
      {c.item !== 'Payments' && ` ${c.item.toLowerCase()}`}
      {c.note && ` ${c.note}`}
    </span>
  ));
}

/** A plain comma list. */
function joined(items) {
  return items.map((item, i) => (
    <span key={item.key}>
      {i > 0 && ', '}
      {item}
    </span>
  ));
}
const price = (n) => `$${n.toFixed(n < 1 ? 3 : 2)}`;
const change = (c) => (c === null ? '-' : `${c > 0 ? '+' : ''}${Math.round(c * 100)}%`);

const CAMP_SERIES = CAMPS.map((c) => ({ key: c.key, label: c.label, className: `camp-${c.key}` }));
const PROPOSER_SERIES = CAMP_SERIES.filter((s) => s.key !== 'operations');

function Figure({ value, label, note }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  );
}

function CgpLinks({ cgps }) {
  return cgps.map((n, i) => (
    <React.Fragment key={n}>
      {i > 0 && ', '}
      <a href={CGP_URL(n)} target="_blank" rel="noopener noreferrer">CGP-{n}</a>
    </React.Fragment>
  ));
}

function CampLegend({ keys }) {
  return (
    <ul className="chart-legend small">
      {CAMPS.filter((c) => keys.includes(c.key)).map((c) => (
        <li key={c.key}><span className={`swatch camp-${c.key}`} aria-hidden="true" />{c.label}</li>
      ))}
    </ul>
  );
}

/** One token's approvals per year, by camp, from the ledger. */
function ApprovedCard({ grants, token, note }) {
  const rows = approvedByYear(grants, token).map((r) => ({
    year: r.year,
    ...Object.fromEntries(CAMPS.map((c) => [c.key, wholeTokens(r[c.key])])),
  }));
  const total = rows.reduce((sum, r) => sum + CAMPS.reduce((s, c) => s + r[c.key], 0), 0);
  return (
    <section className="card" aria-labelledby={`approved-${token}`}>
      <h2 className="section-title" id={`approved-${token}`}>{token} approved each year</h2>
      <p className="muted">{number.format(total)} {token} in all. {note}</p>
      <Columns rows={rows} xKey="year" series={CAMP_SERIES} format={compact}
        label={`${token} approved from the Community Fund per year, by camp of the recipient`} />
    </section>
  );
}

export default function HistoryPage() {
  const [celoUsd8, setCeloUsd8] = useState(null);
  const [priceFailed, setPriceFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchCeloPrice().then((p) => {
      if (!alive) return;
      if (p) setCeloUsd8(p);
      else setPriceFailed(true);
    });
    return () => { alive = false; };
  }, []);

  const grants = useMemo(() => ledgerGrants(ledger), []);
  const timeline = useMemo(() => grantTimeline(grants), [grants]);
  const priced = useMemo(() => pricedProposals(PRICED, grants, celoUsd8), [grants, celoUsd8]);
  const pricedAll = pricedTotals(priced);
  const pricedYears = [...new Set(priced.map((p) => p.date.slice(0, 4)))].map((year) => {
    const rows = priced.filter((p) => p.date.startsWith(year));
    return { year, count: rows.length, ...pricedTotals(rows) };
  });
  const today = celoUsd8 ? Number(celoUsd8) / 1e8 : null;
  const eurm = grants.filter((g) => g.token === 'EURm').reduce((sum, g) => sum + g.wei, 0n);

  const { totals, years, camps, opposed } = FUND_PROPOSALS;
  const decided = totals.passed + totals.notPassed;
  const inflowTotal = INFLOWS.reduce((sum, i) => sum + i.celo, 0);
  const guild = years.filter((y) => y.year >= 2023).reduce((a, y) => ({ by: a.by + y.byGuild, all: a.all + y.byGuild + y.byOthers }), { by: 0, all: 0 });

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">History</p>
        <h1 className="display">How the fund has been spent, refilled and governed.</h1>
        <p className="lede">
          Since 2021, governance has voted on {totals.cgps} proposals that asked for or moved the Community Fund&apos;s
          money. Most of it is paid in CELO, and CELO&apos;s price moves. A grant was worth one amount when it was
          approved, another when it was claimed and sold, and another today.
        </p>
      </header>

      <section className="stats" aria-label="The fund in numbers">
        <Figure value={totals.cgps} label="Funding proposals" note="Proposals that asked for or moved fund money, 2021 to today" />
        <Figure value={pct(totals.passed, decided)} label="Passed" note={`${totals.passed} of the ${decided} that reached a decision`} />
        <Figure value={timeline.length} label="Organisations funded" note={`${grants.length} grants in the ledger`} />
        <Figure value={`${(inflowTotal / 1e6).toFixed(1)}M`} label="CELO moved in" note="One-off returns and transfers voted by governance" />
      </section>

      <div className="stack">
        <div className="grid-2">
          <ApprovedCard grants={grants} token="CELO"
            note="CELO is counted in tokens: its dollar value moved a lot over these years, so years are not comparable in dollars." />
          <ApprovedCard grants={grants} token="USDm"
            note={eurm > 0n ? `A further ${formatWhole(eurm)} EURm went to Credit Collective in 2023.` : 'Stablecoins keep their dollar value.'} />
        </div>
        <p className="small muted">
          Approved is the change each proposal made on-chain, in the year it executed, read from the ledger, so it
          updates with every audit. Season 3 budgets for Celo Core Co., CICLOPS and Stabila in 2026 came in from the
          unreleased treasury and went straight back out, which is why 2026 is so large.
        </p>

        <section className="card" aria-labelledby="priced-heading">
          <h2 className="section-title" id="priced-heading">Asked in dollars, paid in CELO</h2>
          <p className="muted">
            Since 2023 most budgets are set in dollars and paid in CELO at a recent price. Each dot is one of
            the {priced.length} proposals that did this: the dollars it asked for, divided by the CELO it was paid.
            The line is today&apos;s price from the Chainlink CELO/USD feed.
          </p>
          <div className="chart-scroll" tabIndex={0}>
            <PriceChart rows={priced} today={today} />
          </div>
          <p style={{ marginTop: '1rem' }}>
            Together they paid <strong>{number.format(pricedAll.celo)} CELO</strong> for{' '}
            <strong>{dollars(pricedAll.then)}</strong> of budgets.{' '}
            {pricedAll.today !== null
              ? <>At today&apos;s price the same CELO is worth <strong>{dollars(pricedAll.today)}</strong> ({change(pricedAll.today / pricedAll.then - 1)}).</>
              : priceFailed ? "Today's price could not be read, so the value today is left out." : "Reading today's price..."}
          </p>
          <div className="table-scroll" tabIndex={0}>
            <table className="table" style={{ marginTop: '1rem' }}>
              <thead>
                <tr><th>Year</th><th className="num">Proposals</th><th className="num">CELO paid</th><th className="num">Dollars in the proposals</th><th className="num">Worth today</th></tr>
              </thead>
              <tbody>
                {pricedYears.map((y) => (
                  <tr key={y.year}>
                    <td>{y.year}</td>
                    <td className="num">{y.count}</td>
                    <td className="num">{number.format(y.celo)}</td>
                    <td className="num">{dollars(y.then)}</td>
                    <td className="num">{y.today === null ? '-' : `${dollars(y.today)} (${change(y.today / y.then - 1)})`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="template">
            <summary>All {priced.length} proposals</summary>
            <div className="table-scroll" tabIndex={0}>
              <table className="table" style={{ marginTop: '0.75rem' }}>
                <thead>
                  <tr><th>Proposal</th><th>Organisation</th><th>Executed</th><th className="num">Price used</th><th className="num">CELO</th><th className="num">Dollars</th><th className="num">Today</th></tr>
                </thead>
                <tbody>
                  {priced.map((p) => (
                    <tr key={p.cgp}>
                      <td><CgpLinks cgps={[p.cgp]} /></td>
                      <td>{p.organisation}</td>
                      <td className="mono small">{p.date}</td>
                      <td className="num">{price(p.price)}</td>
                      <td className="num">{number.format(p.celo)}</td>
                      <td className="num">{dollars(p.usdForCelo)}</td>
                      <td className="num">{p.today === null ? '-' : `${dollars(p.today)} (${change(p.change)})`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            Neither number is what a recipient received in dollars. Allowances are claimed over months and recipients
            sell when they choose, which the chain does not show. Some proposals add a buffer for price moves, so their
            price can sit below the market. Stablecoin parts of the same proposals are left out because their value
            does not move. Dollar amounts and CELO are as written in each proposal; see CGP-250 for a budget topped up
            after the price fell.
          </p>
        </section>

        <section className="card" aria-labelledby="map-heading">
          <h2 className="section-title" id="map-heading">Who the fund backed over time</h2>
          <p className="muted">
            The organisations the fund paid most, as lanes. A line runs while an organisation operates or is funded,
            splits are spin-outs and joins are merges. Each circle is a grant from the ledger; hover it for the amount
            and proposal.
          </p>
          <MapLegend />
          <MovementMap map={MAP} eras={ERAS} grants={grants} />
          <details className="template">
            <summary>Read the map as a list</summary>
            <ul className="rows" style={{ marginTop: '0.75rem' }}>
              {MOVES.map((m) => (
                <li key={m.when}><div className="row-main"><span className="row-title">{m.when}</span></div><p className="row-meta"><span>{m.what}</span></p></li>
              ))}
            </ul>
          </details>
          <details className="template">
            <summary>Every grant, for all {timeline.length} organisations</summary>
            <CampLegend keys={[...new Set(timeline.map((o) => o.camp))]} />
            <div className="chart-scroll" tabIndex={0}>
              <GrantTimeline timeline={timeline} band={{ from: '2024-01-01', to: '2025-01-01', label: '2024: community programs paid through CeloPG' }} />
            </div>
          </details>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            CICLOPS and Stabila still file their own budgets, so they run beside Celo Core Co. rather than into it. Ocelot
            was a 5-of-9 multisig of ecosystem members, not a cLabs program. In 2024 Prezenti, the regional DAOs and other
            community programs were paid by CeloPG from its own budget, so their grants that year sit on the CeloPG lane.
          </p>
        </section>

        <section className="card" aria-labelledby="inflows-heading">
          <h2 className="section-title" id="inflows-heading">Where new CELO came from</h2>
          <p className="muted">
            Besides its share of epoch rewards, network fee revenue and proposal deposits (see{' '}
            <a href="#/how">How it works</a>), governance has moved {number.format(inflowTotal)} CELO into the fund in
            one-off returns and transfers.
          </p>
          <div className="table-scroll" tabIndex={0}>
            <table className="table" style={{ marginTop: '1rem' }}>
              <thead><tr><th>Year</th><th>Proposal</th><th>From</th><th>What</th><th className="num">CELO</th></tr></thead>
              <tbody>
                {INFLOWS.map((i) => (
                  <tr key={i.cgp.join('-')}>
                    <td>{i.year}</td>
                    <td><CgpLinks cgps={i.cgp} /></td>
                    <td>{i.source}</td>
                    <td>{i.what}</td>
                    <td className="num">{number.format(i.celo)}{i.basis === 'stated' && <sup>*</sup>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            * As stated in the proposal text. The others were read on-chain in the <a href={`${REPO}/blob/main/docs/audit.md`} target="_blank" rel="noopener noreferrer">audit</a>.
          </p>
        </section>

        <div className="grid-2">
          <section className="card" aria-labelledby="years-heading">
            <h2 className="section-title" id="years-heading">Funding proposals per year</h2>
            <p className="muted">By the camp of the organisation asking. Under each year, the share of decided proposals that passed.</p>
            <Columns rows={years} xKey="year" series={PROPOSER_SERIES}
              label="Funding proposals per year by camp of the proposer" foot={(r) => `${passRate(r)} passed`} />
          </section>

          <section className="card" aria-labelledby="camps-heading">
            <h2 className="section-title" id="camps-heading">Who asks, and how it goes</h2>
            <p className="muted">Community requests fail more often and draw the most No votes.</p>
            <table className="table stackable" style={{ marginTop: '1rem' }}>
              <thead><tr><th>Camp</th><th className="num">Proposals</th><th className="num">Passed</th><th className="num">Opposed</th></tr></thead>
              <tbody>
                {camps.map((c) => (
                  <tr key={c.key}>
                    <td data-label="Camp"><span className="org-tag"><span className={`swatch camp-${c.key}`} aria-hidden="true" />{campLabel(c.key)}</span></td>
                    <td className="num" data-label="Proposals">{c.cgps}</td>
                    <td className="num" data-label="Passed">{passRate(c)}</td>
                    <td className="num" data-label="Opposed">{c.opposed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: '0.75rem' }}>
              Passed is executed out of executed, rejected and expired. Opposed means No reached 10% or more of Yes and
              No.
            </p>
          </section>
        </div>

        <section className="card" aria-labelledby="votes-heading">
          <h2 className="section-title" id="votes-heading">Who votes on them, and who takes them on-chain</h2>
          <p className="muted">
            The median funding vote drew between {Math.min(...years.map((y) => y.medianVoters ?? Infinity))} and {Math.max(...years.map((y) => y.medianVoters ?? 0))} voters, depending on the year. Since 2023 the people who now form the Governance Guild
            have submitted {guild.by} of {guild.all} funding proposals on-chain for the teams asking.
          </p>
          <div className="table-scroll" tabIndex={0}>
            <table className="table" style={{ marginTop: '1rem' }}>
              <thead><tr><th>Year</th><th className="num">Submitted on-chain</th><th className="num">By the Guild</th><th className="num">Median voters</th></tr></thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y.year}>
                    <td>{y.year}</td>
                    <td className="num">{y.byGuild + y.byOthers}</td>
                    <td className="num">{y.byGuild}</td>
                    <td className="num">{y.medianVoters ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="template">
            <summary>The {opposed.length} opposed funding votes</summary>
            <div className="table-scroll" tabIndex={0}>
              <table className="table" style={{ marginTop: '0.75rem' }}>
                <thead><tr><th>Proposal</th><th>Title</th><th>Year</th><th className="num">No</th><th>Outcome</th></tr></thead>
                <tbody>
                  {opposed.map((c) => (
                    <tr key={c.cgp}>
                      <td><CgpLinks cgps={[c.cgp]} /></td>
                      <td>{c.title}</td>
                      <td>{c.year}</td>
                      <td className="num">{c.noPct}%</td>
                      <td>{c.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            Every on-chain submission counts, so a resubmitted proposal counts twice. Median voters is over the submissions that drew votes. No is its share of Yes and No.
          </p>
        </section>

        <section className="card" aria-labelledby="process-heading">
          <h2 className="section-title" id="process-heading">Who runs the process the fund pays for</h2>
          <p className="muted">Reviewing proposals, running the governance calls and taking proposals on-chain. Volunteers until 2023, then paid from the fund.</p>
          <ol className="process-steps">
            {PROCESS.map((p) => (
              <li key={`${p.name}-${p.when}`}>
                <p className="process-years">{p.when}</p>
                <div className="process-body">
                  <h3 className="process-name">{p.name}</h3>
                  <p className="muted">{p.terms}.</p>
                  <dl className="process-people">
                    <dt>{p.role}</dt>
                    <dd>{joined(p.people.map((id) => <Person key={id} id={id} />))}</dd>
                    {p.advisor && (
                      <>
                        <dt>Advisor</dt>
                        <dd><Person id={p.advisor} /></dd>
                      </>
                    )}
                    {p.budget && (
                      <>
                        <dt>Budget</dt>
                        <dd>{amounts(p.budget)}</dd>
                        {p.paid && (
                          <>
                            <dt>Paid</dt>
                            <dd>{amounts(p.paid)}</dd>
                          </>
                        )}
                        <dt>Details</dt>
                        <dd>{p.details} <CgpLinks cgps={p.cgp} />.</dd>
                      </>
                    )}
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="card" aria-labelledby="eras-heading">
          <h2 className="section-title" id="eras-heading">Six years of the fund</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            {ERAS.map((e) => (
              <li key={e.years}>
                <div className="row-main"><span className="row-title">{e.name}</span><span className="muted">{e.years}</span></div>
                <p className="row-meta"><span>{e.text}</span></p>
              </li>
            ))}
          </ul>
        </section>

        <p className="small muted">
          The charts of approvals and grants are read from the ledger and the CELO price from the Chainlink feed, live.
          Proposal outcomes, votes, dollar amounts, inflows and the process are a snapshot of {SNAPSHOT}.{' '}
          <a href={`${REPO}/blob/main/docs/history.md`} target="_blank" rel="noopener noreferrer">How this page is made</a>.
        </p>
      </div>
    </>
  );
}
