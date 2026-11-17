import React, { useMemo, useState } from 'react';
import { getAddress } from 'viem';
import Amount from '../components/Amount';
import { ClaimProgress } from '../components/Charts';
import { addressUrl, tokenHolderUrl, txUrl } from '../data/data';
import { TOKENS } from '../lib/fund';

const cgpUrl = (n) => `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(n).padStart(4, '0')}.md`;
const short = (hex) => `${hex.slice(0, 6)}...${hex.slice(-4)}`;

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'fully claimed', label: 'Claimed' },
  { value: 'transferred', label: 'Transferred' },
];
const STATUS_LABEL = { open: 'Open', 'fully claimed': 'Fully claimed', transferred: 'Transferred' };
const SORTS = {
  newest: { label: 'Newest grant', compare: (a, b) => (a.grants.at(-1).date < b.grants.at(-1).date ? 1 : -1) },
  approved: { label: 'Largest approved', compare: (a, b) => (a.approved < b.approved ? 1 : -1) },
  remaining: { label: 'Largest remaining', compare: (a, b) => (a.remaining < b.remaining ? 1 : -1) },
  name: { label: 'Name', compare: (a, b) => a.title.localeCompare(b.title) },
};
const FUNCTION_LABEL = { approve: 'Allowance set', increaseAllowance: 'Allowance increased', transfer: 'Direct transfer' };

function Segmented({ label, options, value, onChange }) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="field">
      <span id={id}>{label}</span>
      <div className="segmented" role="group" aria-labelledby={id}>
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

function Grant({ grant, token }) {
  const replaced = BigInt(grant.replaced);
  return (
    <div className="grant">
      <span className="muted">{grant.date}</span>
      <span>
        <strong>{FUNCTION_LABEL[grant.function] ?? grant.function}</strong>
        {replaced > 0n && (
          <span className="muted"> (requested <Amount wei={grant.requested} />, replaced an unclaimed <Amount wei={replaced} />)</span>
        )}
      </span>
      <span className="grant-amount num"><Amount wei={grant.effective} /> {token}</span>
      <span className="grant-links">
        <a href={cgpUrl(grant.cgp)} target="_blank" rel="noopener noreferrer">Read proposal CGP-{grant.cgp}</a>
        <span className="muted">On-chain proposal {grant.proposalId}</span>
        <a className="link-out" href={txUrl(grant.tx)} target="_blank" rel="noopener noreferrer" title={grant.tx}>Transaction on Celoscan</a>
        <a className="link-out" href={addressUrl(grant.to)} target="_blank" rel="noopener noreferrer" title={getAddress(grant.to)}>Recipient {short(getAddress(grant.to))} on Celoscan</a>
      </span>
    </div>
  );
}

function Entry({ row }) {
  const [open, setOpen] = useState(false);
  const id = `entry-${row.kind}-${row.token}-${row.address ?? row.title.replace(/\W+/g, '-')}`;
  return (
    <li className="ledger-item">
      <button className="ledger-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <span className="ledger-name">
          <span className="row-title">{row.title}</span>
          <span className="row-meta">
            <span className="badge plain">{row.token}</span>
            <span className={row.status === 'open' ? 'badge open' : 'badge'}>{STATUS_LABEL[row.status]}</span>
          </span>
        </span>
        <span className="ledger-cell num"><span className="cell-label">Approved</span><Amount wei={row.approved} /></span>
        <span className="ledger-cell num"><span className="cell-label">Claimed</span><Amount wei={row.claimed} /></span>
        <span className="ledger-cell num"><span className="cell-label">Remaining</span><Amount wei={row.remaining} /></span>
        <span className="chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="ledger-detail" id={id}>
          {row.kind === 'allowance' && <ClaimProgress claimed={row.claimed} remaining={row.remaining} />}
          {row.address && (
            <p className="row-meta" style={{ margin: '0.75rem 0' }}>
              <span>Recipient <span className="mono">{getAddress(row.address)}</span></span>
              <a className="link-out" href={addressUrl(row.address)} target="_blank" rel="noopener noreferrer">Open on Celoscan</a>
              <a className="link-out" href={tokenHolderUrl(row.token, row.address)} target="_blank" rel="noopener noreferrer">See its {row.token} claims on Celoscan</a>
            </p>
          )}
          {row.grants.map((g) => <Grant key={`${g.tx}-${g.to}`} grant={g} token={row.token} />)}
        </div>
      )}
    </li>
  );
}

export default function LedgerPage({ state }) {
  const [query, setQuery] = useState('');
  const [token, setToken] = useState('all');
  const [status, setStatus] = useState(() => {
    const wanted = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('status');
    return STATUS_FILTERS.some((f) => f.value === wanted) ? wanted : 'all';
  });
  const [sort, setSort] = useState('newest');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.rows
      .filter((r) => token === 'all' || r.token === token)
      .filter((r) => status === 'all' || r.status === status)
      .filter((r) => !q || r.title.toLowerCase().includes(q) || (r.address ?? '').includes(q) || r.cgps.some((n) => `cgp-${n}` === q || String(n) === q))
      .sort(SORTS[sort].compare);
  }, [state.rows, query, token, status, sort]);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Ledger</p>
        <h1 className="display">Every grant, to the last CELO.</h1>
        <p className="lede">
          One line per recipient and token. Approved is what governance granted, claimed is what the recipient
          already took, remaining is what it can still take. Open any line to see the proposals behind it.
        </p>
      </header>

      <div className="stack">
        <section className="card" aria-label="Totals by token">
          <table className="table stackable">
            <thead>
              <tr><th>Token</th><th className="num">Approved</th><th className="num">Claimed</th><th className="num">Remaining</th></tr>
            </thead>
            <tbody>
              {TOKENS.map((t) => (
                <tr key={t}>
                  <td data-label="Token">{t}</td>
                  <td className="num" data-label="Approved"><Amount wei={state.tokens[t].approved} /></td>
                  <td className="num" data-label="Claimed"><Amount wei={state.tokens[t].claimed} /></td>
                  <td className="num" data-label="Remaining"><Amount wei={state.tokens[t].open} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card" aria-label="Grants">
          <div className="toolbar">
            <label className="field grow">
              Search
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, address or CGP" />
            </label>
            <Segmented label="Token" options={[{ value: 'all', label: 'All' }, ...TOKENS.map((t) => ({ value: t, label: t }))]} value={token} onChange={setToken} />
            <Segmented label="Status" options={STATUS_FILTERS} value={status} onChange={setStatus} />
            <label className="field">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <p className="small muted" role="status" style={{ marginBottom: '0.75rem' }}>
            {rows.length} of {state.rows.length} entries. Amounts are in whole units; hover a number for the exact value.
          </p>

          {rows.length === 0 ? (
            <p className="empty">Nothing matches these filters.</p>
          ) : (
            <>
              <div className="ledger-head" aria-hidden="true">
                <span>Recipient</span><span>Approved</span><span>Claimed</span><span>Remaining</span><span />
              </div>
              <ul className="rows" style={{ borderTop: 0 }}>
                {rows.map((r) => <Entry key={`${r.kind}:${r.token}:${r.address ?? r.title}`} row={r} />)}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
