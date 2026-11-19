import React from 'react';
import { formatWhole } from '../lib/format';

// Geometry of the map, in SVG units. The figure scales to its container and scrolls sideways on
// narrow screens, so every label keeps a readable size.
const W = 1100;
const X0 = 190;
const XW = 880;
const LO = Date.UTC(2018, 0, 1);
const HI = Date.UTC(2027, 0, 1);
const TOP = 96;
const STEP = 34;
const SECTION_GAP = 36;
const x = (date) => X0 + ((Date.parse(date) - LO) / (HI - LO)) * XW;
const COLOR = {
  companies: 'var(--camp-companies)',
  community: 'var(--camp-community)',
  partners: 'var(--camp-partners)',
  operations: 'var(--camp-operations)',
};
const DASH = { via: '8 6', volunteer: '2 5' };

function layout(lanes) {
  let y = TOP;
  let previous = null;
  const ys = {};
  const sections = [];
  for (const lane of lanes) {
    const section = lane.camp === 'community' ? 'community' : 'companies';
    if (previous && section !== previous) y += SECTION_GAP;
    if (section !== previous) sections.push({ section, y });
    ys[lane.key] = y;
    y += STEP;
    previous = section;
  }
  return { ys, sections, bottom: y - STEP };
}

const DAY = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * The organisations the fund paid, on one timeline: a line runs while an organisation operates or is
 * funded, splits are spin-outs, joins are merges, and the shaded box is the year CeloPG paid community
 * programs from one budget. Grants are drawn from the ledger on the lane of their organisation.
 *
 * @param {object} props
 * @param {object} props.map lanes, segments, links, events and milestones (src/data/fundHistory.js)
 * @param {Array<{name: string, start: string, end: string}>} props.eras shaded periods with a heading
 * @param {Array<object>} props.grants from ledgerGrants()
 * @param {string} [props.today] ISO date where open lanes end
 */
export default function MovementMap({ map, eras, grants, today = new Date().toISOString().slice(0, 10) }) {
  const { ys, sections, bottom } = layout(map.lanes);
  const end = (s) => s.end ?? today;
  const axisY = bottom + 32;
  const height = axisY + 50;
  const years = Array.from({ length: 10 }, (_, i) => 2018 + i);
  const band = { x1: x('2024-01-01'), x2: x('2025-01-01'), y1: ys.celopg - 16, y2: ys.commguild + 16 };
  const stripes = [{ name: 'Before the fund', years: '2018–20', start: '2018-01-01', end: '2021-01-01' }, ...eras];
  const laneGrants = map.lanes.flatMap((lane) => grants.filter((g) => lane.orgs.includes(g.organisation)).map((g) => ({ ...g, lane })));
  const label = (lane) => (ys[lane] ?? 0);

  return (
    <div className="chart-scroll">
      <svg
        className="movement-map"
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-labelledby="map-title map-desc"
      >
        <title id="map-title">The organisations the Community Fund paid, 2018 to today</title>
        <desc id="map-desc">
          cLabs and the Celo Foundation start together, spin out Mento Labs, Stabila and CICLOPS, partner with Opera on
          MiniPay, and unify as Celo Core Co. in January 2026. Community programs pass through CeloPG in 2024 and leave for
          budgets of their own in 2025. {laneGrants.length} grants from the fund are marked on their lanes, and the Mento
          Reserve's returns of CELO on the Mento lane. The list under the map gives the same moves in words.
        </desc>

        {stripes.map((e, i) => (
          <g key={e.name}>
            {i % 2 === 1 && <rect x={x(e.start)} y={46} width={x(e.end) - x(e.start)} height={axisY - 52} className="map-stripe" />}
            <text x={(x(e.start) + x(e.end)) / 2} y={20} textAnchor="middle" className="map-era">{e.short ?? e.name}</text>
            <text x={(x(e.start) + x(e.end)) / 2} y={36} textAnchor="middle" className="map-muted">{e.years}</text>
          </g>
        ))}

        <rect x={band.x1} y={band.y1} width={band.x2 - band.x1} height={band.y2 - band.y1} rx={10} className="map-band" />
        <text x={band.x1 - 10} y={ys.celopg + 5} textAnchor="end" className="map-band-label">Paid through CeloPG in 2024</text>

        <line x1={x(today)} x2={x(today)} y1={88} y2={axisY - 6} className="map-today" />
        <text x={x(today)} y={82} textAnchor="end" className="map-muted">{DAY.format(new Date(`${today}T00:00:00Z`))}</text>

        {map.links.map((l) => (
          <line
            key={`${l.source}-${l.target}`}
            x1={x(l.date)} x2={x(l.date)} y1={label(l.source)} y2={label(l.target)}
            stroke={COLOR[l.camp]}
            strokeWidth={l.kind === 'tie' ? 1.5 : 5}
            strokeDasharray={l.kind === 'tie' ? '5 4' : undefined}
            strokeLinecap="round"
          />
        ))}

        {map.segments.map((s) => (
          <line
            key={`${s.lane}-${s.start}`}
            x1={x(s.start)} x2={x(end(s))} y1={ys[s.lane]} y2={ys[s.lane]}
            stroke={COLOR[s.camp]}
            strokeWidth={s.style === 'volunteer' ? 2.5 : 5}
            strokeDasharray={DASH[s.style]}
            strokeLinecap={s.style === 'own' ? 'round' : 'butt'}
          >
            <title>{`${map.lanes.find((l) => l.key === s.lane)?.label}: ${s.start} to ${s.end ?? 'today'}`}</title>
          </line>
        ))}
        {map.segments.filter((s) => s.cap === 'end').map((s) => (
          <line key={`cap-${s.lane}-${s.end}`} x1={x(s.end) + 3} x2={x(s.end) + 3} y1={ys[s.lane] - 9} y2={ys[s.lane] + 9} stroke={COLOR[s.camp]} strokeWidth={3} />
        ))}

        {laneGrants.map((g, i) => (
          <g key={`grant-${i}`}>
            <circle cx={x(g.date)} cy={ys[g.lane.key]} r={4.5} stroke={COLOR[g.lane.camp]} className="map-grant" />
            <circle cx={x(g.date)} cy={ys[g.lane.key]} r={9} className="map-hit">
              <title>{`${g.organisation}: ${g.wei < 0n ? 'lowered by ' : ''}${formatWhole(g.wei < 0n ? -g.wei : g.wei)} ${g.token}, CGP-${g.cgp}, ${g.date}`}</title>
            </circle>
          </g>
        ))}

        {map.events.map((e) => (
          <g key={`${e.lane}-${e.date}-${e.label}`}>
            {e.dot === 'root' && <circle cx={x(e.date)} cy={ys[e.lane]} r={7} fill={COLOR.companies} className="map-dot" />}
            {e.dot === 'ink' && <circle cx={x(e.date)} cy={ys[e.lane]} r={5} className="map-dot ink" />}
            {e.dot === 'return' && (
              <rect x={x(e.date) - 5} y={ys[e.lane] - 5} width={10} height={10} transform={`rotate(45 ${x(e.date)} ${ys[e.lane]})`} className="map-return">
                <title>{e.title}</title>
              </rect>
            )}
            {e.label && <text x={x(e.date) + e.dx} y={ys[e.lane] + e.dy} textAnchor={e.anchor} className="map-label">{e.label}</text>}
          </g>
        ))}

        {sections.map((s) => (
          <text key={s.section} x={0} y={s.y - 24} className="map-section">
            {s.section === 'community' ? 'COMMUNITY' : 'CELO COMPANIES & AFFILIATES'}
          </text>
        ))}
        {map.lanes.map((l) => (
          <text key={l.key} x={0} y={ys[l.key] + 5} className={l.key === 'coreco' ? 'map-lane strong' : 'map-lane'}>{l.label}</text>
        ))}

        <line x1={X0} x2={X0 + XW} y1={axisY} y2={axisY} className="map-axis" />
        {years.map((yr) => (
          <g key={yr}>
            <line x1={x(`${yr}-01-01`)} x2={x(`${yr}-01-01`)} y1={axisY} y2={axisY + 6} className="map-axis" />
            <text x={x(`${yr}-01-01`)} y={axisY + 20} textAnchor="middle" className="map-muted">{yr}</text>
          </g>
        ))}
        {map.milestones.map((m) => (
          <g key={m.date}>
            <rect x={x(m.date) - 5} y={axisY - 5} width={10} height={10} transform={`rotate(45 ${x(m.date)} ${axisY})`} className="map-milestone" />
            <text x={x(m.date)} y={axisY + 38} textAnchor="middle" className="map-label strong">{m.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function MapLegend() {
  const line = (style, color = 'var(--ink)') => (
    <svg width="28" height="10" viewBox="0 0 28 10" aria-hidden="true">
      <line x1="2" x2="26" y1="5" y2="5" stroke={color} strokeWidth={style === 'volunteer' ? 2.5 : style === 'tie' ? 1.5 : 4}
        strokeDasharray={style === 'tie' ? '5 4' : DASH[style]} strokeLinecap={style === 'own' ? 'round' : 'butt'} />
    </svg>
  );
  return (
    <ul className="chart-legend small">
      <li><span className="swatch camp-companies" aria-hidden="true" />Celo companies &amp; affiliates</li>
      <li><span className="swatch camp-community" aria-hidden="true" />Community initiatives</li>
      <li><span className="swatch camp-partners" aria-hidden="true" />External partner</li>
      <li>{line('own')}Operating or funded</li>
      <li>{line('via')}Funded through CeloPG</li>
      <li>{line('volunteer')}Volunteer, unpaid</li>
      <li>{line('tie', 'var(--camp-partners)')}Partnership</li>
      <li><span className="cap-mark" aria-hidden="true" />Funding ended</li>
      <li>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="4.5" className="map-grant" stroke="var(--ink)" /></svg>
        Grant from the fund
      </li>
      <li>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="3" y="3" width="8" height="8" transform="rotate(45 7 7)" className="map-return" /></svg>
        CELO returned to the fund
      </li>
    </ul>
  );
}
