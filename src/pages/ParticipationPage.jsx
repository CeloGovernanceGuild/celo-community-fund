import React from 'react';
import Columns from '../components/Columns';
import { participation } from '../data/participation';
import { campLabel } from '../lib/organisations';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';
const pct = (part, whole) => (whole > 0 ? `${Math.round((100 * part) / whole)}%` : '–');
const usd = (n) => `$${n.toLocaleString('en-US')}`;

function Figure({ value, label, note }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  );
}

export default function ParticipationPage() {
  const { voters, carriers, subsByYear, maintenance, handoff, budgets, snapshot } = participation;
  const peak = voters.reduce((a, b) => (b.voters > a.voters ? b : a));
  const community = carriers.find((c) => c.camp === 'community');
  const paid = maintenance.filter((m) => m.year >= 2024);
  const opened = paid.reduce((s, m) => s + m.prsOpened, 0);
  const reviewed = paid.reduce((s, m) => s + m.reviewed, 0);
  const first = voters[0];
  const turnouts = voters.filter((v) => v.turnout != null);
  const low = turnouts.reduce((a, b) => (b.turnout < a.turnout ? b : a));

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Participation</p>
        <h1 className="display">Who votes, who takes proposals on-chain and who keeps governance running.</h1>
        <p className="lede">
          Governance runs on two kinds of work. Participation is voting and bringing proposals. Maintenance is everything
          that gets a proposal from draft to vote: reviewing it, running the calls and submitting it on-chain.
        </p>
      </header>

      <section className="stats" aria-label="Participation in numbers">
        <Figure value={peak.voters} label={`Voters in ${peak.year}`} note="Distinct addresses that voted at least once that year, the high so far" />
        <Figure value={voters.at(-1).median} label="Voters on a typical proposal" note={`Median for ${voters.at(-1).year}, against ${first.median} in ${first.year}`} />
        <Figure value={pct(community.byGuild, community.submissions)} label="Community proposals put on-chain by the Guild" note="Since 2023, when Guild members began submitting for other teams" />
        <Figure value={pct(reviewed, opened)} label="Proposal reviews by the Guild" note={`${reviewed} of ${opened} pull requests to celo-org/governance, 2024 to today`} />
      </section>

      <div className="stack">
        <div className="grid-2">
          <section className="card" aria-labelledby="voters-heading">
            <h2 className="section-title" id="voters-heading">Voters per year</h2>
            <p className="muted">
              Turnout jumps for big decisions. Under each year, the median number of voters on a single proposal.
            </p>
            <Columns
              rows={voters}
              xKey="year"
              series={[{ key: 'voters', label: 'Distinct voting addresses', className: 'series-voters' }]}
              label="Distinct addresses that voted each year"
              foot={(r) => `${r.median} median`}
              highlight={(r) => r.year === peak.year}
            />
            <p className="small muted" style={{ marginTop: '0.75rem' }}>
              Median turnout of voting weight fell from {first.turnout}% in {first.year} to {low.turnout}% in {low.year}.
              One person or fund can hold many addresses.
            </p>
          </section>

          <section className="card" aria-labelledby="carriers-heading">
            <h2 className="section-title" id="carriers-heading">Who takes proposals on-chain</h2>
            <p className="muted">
              Submitting needs a deposit, 100 CELO until 2024 and 10,000 CELO since, and someone to build the transactions.
            </p>
            <Columns
              rows={subsByYear}
              xKey="year"
              series={[
                { key: 'guild', label: 'Guild members', className: 'camp-community' },
                { key: 'others', label: 'Other addresses', className: 'series-others' },
              ]}
              label="On-chain submissions per year by submitter"
            />
            <table className="table stackable" style={{ marginTop: '1rem' }}>
              <thead><tr><th>Proposals from</th><th className="num">Submissions</th><th className="num">By Guild members</th></tr></thead>
              <tbody>
                {carriers.filter((c) => c.camp !== 'none').map((c) => (
                  <tr key={c.camp}>
                    <td data-label="Proposals from">{campLabel(c.camp)}</td>
                    <td className="num" data-label="Submissions">{c.submissions}</td>
                    <td className="num" data-label="By Guild members">{c.byGuild} <span className="muted">({pct(c.byGuild, c.submissions)})</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small muted" style={{ marginTop: '0.75rem' }}>Since 2023. Resubmissions count each time.</p>
          </section>
        </div>

        <section className="card" aria-labelledby="keep-heading">
          <h2 className="section-title" id="keep-heading">Who keeps it running</h2>
          <p className="muted">Who ran the process, from the governance calls to proposal reviews.</p>
          <ol className="handoff">
            {handoff.map((h, i) => (
              <li key={h.name} className={i === handoff.length - 1 ? 'current' : undefined}>
                <strong>{h.name}</strong>
                <span className="muted">{h.years}</span>
              </li>
            ))}
          </ol>
          <div className="table-scroll">
            <table className="table stackable">
              <thead>
                <tr>
                  <th>Year</th><th>Phase</th><th className="num">Pull requests</th><th className="num">Reviewed by Guild</th>
                  <th className="num">Calls held</th><th className="num">Agendas by Guild</th><th className="num">Submitted by Guild</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((m) => (
                  <tr key={m.year}>
                    <td data-label="Year">{m.year}</td>
                    <td data-label="Phase">{m.phase}</td>
                    <td className="num" data-label="Pull requests">{m.prsOpened}</td>
                    <td className="num" data-label="Reviewed by Guild">{m.reviewed}</td>
                    <td className="num" data-label="Calls held">{m.calls}</td>
                    <td className="num" data-label="Agendas by Guild">{m.agendas}</td>
                    <td className="num" data-label="Submitted by Guild">{m.submitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: '0.75rem' }}>
            &ldquo;Guild&rdquo; counts the people who later formed it, including the unpaid years. Pull requests and reviews come
            from celo-org/governance, calls from its call log.
          </p>
        </section>

        <section className="card" aria-labelledby="cost-heading">
          <h2 className="section-title" id="cost-heading">What maintenance costs</h2>
          <ul className="rows" style={{ marginTop: '1rem' }}>
            {budgets.map((b) => (
              <li key={b.year}>
                <div className="row-main"><span className="row-title">{b.year}</span><span className="num">{usd(b.usd)}</span></div>
                <p className="row-meta"><span>{b.note}</span></p>
              </li>
            ))}
          </ul>
        </section>

        <p className="small muted">
          Snapshot of {snapshot}. Votes come from the Celo Mondo database to November 2025 and Governance contract logs
          after that. <a href={`${REPO}/blob/main/docs/history.md`} target="_blank" rel="noopener noreferrer">How this page is made</a>.
        </p>
      </div>
    </>
  );
}
