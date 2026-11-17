import React from 'react';
import { formatWei, formatWhole, toNumber } from '../lib/format';

const percent = (part, total) => (total > 0 ? (part / total) * 100 : 0);
const percentLabel = (value) => (value > 0 && value < 1 ? '<1%' : `${Math.round(value)}%`);

/**
 * One horizontal bar split into parts of a whole, with a legend that carries every value,
 * so nothing depends on color or on hovering.
 */
export function SegmentedBar({ segments, unit, label }) {
  const parts = segments.map((s) => ({ ...s, value: toNumber(s.wei) }));
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  const summary = parts.map((p) => `${p.label} ${formatWhole(p.wei)} ${unit} (${percentLabel(percent(p.value, total))})`).join(', ');

  return (
    <figure style={{ margin: 0 }}>
      <div className="segbar" role="img" aria-label={`${label}: ${summary}`}>
        {parts.filter((p) => p.value > 0).map((p) => (
          <span
            key={p.key}
            className={`series-${p.key}`}
            style={{ flexGrow: p.value, flexBasis: 0 }}
            title={`${p.label}: ${formatWei(p.wei)} ${unit}`}
          />
        ))}
      </div>
      <ul className="legend">
        {parts.map((p) => (
          <li key={p.key}>
            <span className={`swatch series-${p.key}`} aria-hidden="true" />
            <strong>{p.label}</strong>
            <span className="legend-value" title={`${formatWei(p.wei)} ${unit}`}>
              {formatWhole(p.wei)} {unit} ({percentLabel(percent(p.value, total))})
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Claimed vs remaining share of one grant. Decorative: the numbers sit next to it. */
export function ClaimProgress({ claimed, remaining }) {
  const c = toNumber(claimed);
  const r = toNumber(remaining);
  if (c + r <= 0) return null;
  return (
    <div className="progress" aria-hidden="true">
      {c > 0 && <span className="series-claimed" style={{ flexGrow: c, flexBasis: 0 }} />}
      {r > 0 && <span className="series-committed" style={{ flexGrow: r, flexBasis: 0 }} />}
    </div>
  );
}
