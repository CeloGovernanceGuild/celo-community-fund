import React from 'react';

/**
 * Stacked columns, one per period, drawn with plain elements so they scale with the page.
 * Every value sits in the column's title and in the figure's label, so nothing depends on
 * colour or on hovering.
 *
 * @param {object} props
 * @param {Array<object>} props.rows one object per column
 * @param {string} props.xKey field with the column label (a year)
 * @param {Array<{key: string, label: string, className: string}>} props.series stacked bottom to top
 * @param {string} props.label what the chart shows, for screen readers
 * @param {(row: object) => string} [props.foot] a short line under each column (a rate, a median)
 * @param {(row: object) => boolean} [props.highlight] columns whose total is set in bold
 * @param {(value: number) => string} [props.format] how values are written (default: as is)
 */
export default function Columns({ rows, xKey, series, label, foot, highlight, format = String }) {
  const totals = rows.map((r) => series.reduce((sum, s) => sum + (r[s.key] ?? 0), 0));
  const max = Math.max(1, ...totals);
  const summary = rows.map((r, i) => `${r[xKey]}: ${format(totals[i])}${series.length > 1 ? ` (${series.map((s) => `${s.label} ${format(r[s.key] ?? 0)}`).join(', ')})` : ''}`).join('; ');

  return (
    <figure className="columns-figure">
      <div className="columns" role="img" aria-label={`${label}. ${summary}`}>
        {rows.map((r, i) => (
          <div className="column" key={r[xKey]}>
            <span className={highlight?.(r) ? 'column-total strong' : 'column-total'}>{format(totals[i])}</span>
            <div className="column-stack" style={{ height: `calc((100% - 1.5rem) * ${Math.max(0, totals[i]) / max})` }}
              title={series.map((s) => `${s.label}: ${format(r[s.key] ?? 0)}`).join('\n')}>
              {series.map((s) => (r[s.key] ?? 0) > 0 && (
                <span key={s.key} className={s.className} style={{ flexGrow: r[s.key], flexBasis: 0 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="columns-axis" aria-hidden="true">
        {rows.map((r) => (
          <div key={r[xKey]}>
            <span>{r[xKey]}</span>
            {foot && <span className="muted">{foot(r)}</span>}
          </div>
        ))}
      </div>
      {series.length > 1 && (
        <ul className="chart-legend small">
          {series.map((s) => <li key={s.key}><span className={`swatch ${s.className}`} aria-hidden="true" />{s.label}</li>)}
        </ul>
      )}
    </figure>
  );
}
