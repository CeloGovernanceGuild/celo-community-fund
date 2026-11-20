import React from 'react';
import { CAMPS } from '../data/organisations';
import { formatWhole } from '../lib/format';

const W = 1100;
const X0 = 230;
const XW = 850;
const ROW = 20;
const SECTION = 30;
const TOP = 34;
const START = Date.UTC(2021, 0, 1);
const END = Date.UTC(2027, 0, 1);
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026, 2027];

const x = (date) => X0 + ((Date.parse(date) - START) / (END - START)) * XW;
const yearX = (year) => x(`${year}-01-01`);

/**
 * Every grant in the ledger on a timeline, one row per organisation, grouped by camp. Rows are drawn
 * straight from ledger.js, so a new grant appears here as soon as the audit adds it.
 *
 * @param {object} props
 * @param {Array<{name: string, camp: string, grants: Array<object>, first: string, last: string}>} props.timeline from grantTimeline()
 * @param {{from: string, to: string, label: string}} [props.band] a shaded period with a label
 */
export default function GrantTimeline({ timeline, band }) {
  const sections = CAMPS.map((camp) => ({ ...camp, orgs: timeline.filter((o) => o.camp === camp.key) }))
    .filter((s) => s.orgs.length > 0);
  let y = TOP;
  const placed = sections.map((s) => {
    const top = y + SECTION;
    y = top + s.orgs.length * ROW;
    return { ...s, top };
  });
  const height = y + 36;
  const today = new Date().toISOString().slice(0, 10);
  const grants = timeline.reduce((n, o) => n + o.grants.length, 0);

  return (
    <svg className="timeline" viewBox={`0 0 ${W} ${height}`} role="img" aria-labelledby="timeline-title timeline-desc">
      <title id="timeline-title">Grants from the Community Fund over time</title>
      <desc id="timeline-desc">
        {`${grants} grants to ${timeline.length} organisations. ${placed.map((s) => `${s.label}: ${s.orgs.map((o) => o.name).join(', ')}`).join('. ')}.`}
      </desc>

      {YEARS.slice(0, -1).map((year, i) => i % 2 === 0 && (
        <rect key={year} className="timeline-stripe" x={yearX(year)} y={TOP} width={yearX(year + 1) - yearX(year)} height={y - TOP} />
      ))}
      {band && (
        <g>
          <rect className="timeline-band" x={x(band.from)} y={TOP} width={x(band.to) - x(band.from)} height={y - TOP} />
          <text className="timeline-band-label" x={(x(band.from) + x(band.to)) / 2} y={TOP - 10} textAnchor="middle">{band.label}</text>
        </g>
      )}
      {today < '2027-01-01' && <line className="timeline-today" x1={x(today)} x2={x(today)} y1={TOP} y2={y} />}

      {placed.map((s) => (
        <g key={s.key}>
          <text className="timeline-section" x={8} y={s.top - 9}>{s.label.toUpperCase()}</text>
          {s.orgs.map((o, i) => {
            const cy = s.top + i * ROW + ROW / 2;
            return (
              <g key={o.name}>
                <text className="timeline-name" x={8} y={cy + 4}>{o.name.length > 30 ? `${o.name.slice(0, 29)}...` : o.name}</text>
                <line className={`timeline-span camp-stroke-${s.key}`} x1={x(o.first)} x2={x(o.last)} y1={cy} y2={cy} />
                {o.grants.map((g, j) => (
                  <g key={`${g.cgp}-${g.token}-${j}`}>
                    <circle className={`timeline-dot camp-fill-${s.key}`} cx={x(g.date)} cy={cy} r={4.5} />
                    <circle className="timeline-hit" cx={x(g.date)} cy={cy} r={9}>
                      <title>{`${o.name}: ${g.wei < 0n ? 'lowered by ' : ''}${formatWhole(g.wei < 0n ? -g.wei : g.wei)} ${g.token}, CGP-${g.cgp}, ${g.date}`}</title>
                    </circle>
                  </g>
                ))}
              </g>
            );
          })}
        </g>
      ))}

      <line className="timeline-axis" x1={X0} x2={X0 + XW} y1={y + 6} y2={y + 6} />
      {YEARS.map((year) => (
        <g key={year}>
          <line className="timeline-axis" x1={yearX(year)} x2={yearX(year)} y1={y + 6} y2={y + 11} />
          <text className="timeline-year" x={yearX(year)} y={y + 26} textAnchor="middle">{year}</text>
        </g>
      ))}
    </svg>
  );
}
