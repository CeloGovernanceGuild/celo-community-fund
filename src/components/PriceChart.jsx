import React from 'react';

const W = 1000;
const H = 300;
const L = 56;
const R = 16;
const T = 16;
const B = 34;
const START = Date.UTC(2023, 0, 1);
const END = Date.UTC(2027, 0, 1);
const YEARS = [2023, 2024, 2025, 2026, 2027];

const usd = (n) => `$${n.toFixed(n < 1 ? 3 : 2)}`;

/**
 * The CELO price each dollar-priced proposal used (its dollar value divided by its CELO), one dot per
 * proposal, against today's price. The proposal prices come from the CGP text; today's is the live feed.
 *
 * @param {object} props
 * @param {Array<{cgp: number, date: string, organisation: string, price: number, usdForCelo: number, celo: number}>} props.rows
 * @param {number|null} props.today today's CELO price in dollars, or null
 */
export default function PriceChart({ rows, today }) {
  const top = Math.max(1, ...rows.map((r) => r.price));
  const max = Math.ceil(top * 4) / 4;
  const ticks = Array.from({ length: Math.round(max / 0.25) + 1 }, (_, i) => i * 0.25);
  const x = (date) => L + ((Date.parse(date) - START) / (END - START)) * (W - L - R);
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const fmt = new Intl.NumberFormat('en-US');

  return (
    <svg className="price-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="price-title price-desc">
      <title id="price-title">CELO price used by proposals priced in dollars</title>
      <desc id="price-desc">
        {rows.map((r) => `CGP-${r.cgp} ${r.organisation}, ${r.date}: ${usd(r.price)}`).join('; ')}
        {today ? `. Today: ${usd(today)}.` : '.'}
      </desc>
      {ticks.map((t) => (
        <g key={t}>
          <line className="price-grid" x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
          <text className="price-tick" x={L - 8} y={y(t) + 4} textAnchor="end">${t.toFixed(2)}</text>
        </g>
      ))}
      {YEARS.map((year) => (
        <text key={year} className="price-tick" x={x(`${year}-01-01`)} y={H - 10} textAnchor="middle">{year}</text>
      ))}
      {today && (
        <g>
          <line className="price-today" x1={L} x2={W - R} y1={y(today)} y2={y(today)} />
          <text className="price-today-label" x={L + 8} y={y(today) - 8}>Today {usd(today)}</text>
        </g>
      )}
      {rows.map((r) => (
        <g key={r.cgp}>
          <circle className="price-dot" cx={x(r.date)} cy={y(r.price)} r={5} />
          <circle className="timeline-hit" cx={x(r.date)} cy={y(r.price)} r={10}>
            <title>{`CGP-${r.cgp}, ${r.organisation}, ${r.date}: $${fmt.format(r.usdForCelo)} as ${fmt.format(r.celo)} CELO, ${usd(r.price)} per CELO`}</title>
          </circle>
        </g>
      ))}
    </svg>
  );
}
