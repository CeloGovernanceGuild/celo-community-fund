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
const FUNCTION_LABEL = { approve: 'Allowance set', increaseAllowance: 'Allowance increased', transfer: 'Direct transfer' };

// Amounts of different tokens cannot be added up, so sorting compares CELO first, then USDm, then EURm.
const amountOf = (group, field, token) => group.positions.find((p) => p.token === token)?.[field] ?? 0n;
const byAmount = (field) => (a, b) => {
  for (const token of TOKENS) {
    const x = amountOf(a, field, token);
    const y = amountOf(b, field, token);
    if (x !== y) return x < y ? 1 : -1;
  }
  return 0;
};
const SORTS = {
  newest: { label: 'Newest grant', compare: (a, b) => (a.lastGrant < b.lastGrant ? 1 : -1) },
  approved: { label: 'Largest approved', compare: byAmount('approved') },
  remaining: { label: 'Largest remaining', compare: byAmount('remaining') },
  name: { label: 'Name', compare: (a, b) => a.title.localeCompare(b.title) },
};

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

function Grant({ grant }) {
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
      <span className="grant-amount num"><Amount wei={grant.effective} /> {grant.token}</span>
      <span className="grant-links">
        <a href={cgpUrl(grant.cgp)} target="_blank" rel="noopener noreferrer">Read proposal CGP-{grant.cgp}</a>
        <span className="muted">On-chain proposal {grant.proposalId}</span>
        <a className="link-out" href={txUrl(grant.tx)} target="_blank" rel="noopener noreferrer" title={grant.tx}>Transaction on Celoscan</a>
        <a className="link-out" href={addressUrl(grant.to)} target="_blank" rel="noopener noreferrer" title={getAddress(grant.to)}>Recipient {short(getAddress(grant.to))} on Celoscan</a>
      </span>
    </div>
  );
}

// One amount per token, each with its unit, so a recipient funded in CELO and USDm reads as one line.
function Amounts({ label, positions, field }) {
  return (
    <span className="ledger-cell num">
      <span className="cell-label">{label}</span>
      {positions.map((p) => (
        <span className="amount-line" key={p.token}><Amount wei={p[field]} /> <span className="unit">{p.token}</span></span>
      ))}
    </span>
  );
}

function Entry({ group, positions }) {
  const [open, setOpen] = useState(false);
  const id = `entry-${group.key.replace(/\W+/g, '-')}`;
  const tokens = new Set(positions.map((p) => p.token));
  return (
    <li className="ledger-item">
      <button className="ledger-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <span className="ledger-name">
          <span className="row-title">{group.title}</span>
          <span className="row-meta">
            {positions.map((p) => <span className="badge plain" key={p.token}>{p.token}</span>)}
            <span className={group.status === 'open' ? 'badge open' : 'badge'}>{STATUS_LABEL[group.status]}</span>
          </span>
        </span>
        <Amounts label="Approved" positions={positions} field="approved" />
        <Amounts label="Claimed" positions={positions} field="claimed" />
        <Amounts label="Remaining" positions={positions} field="remaining" />
        <span className="chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="ledger-detail" id={id}>
          {group.kind === 'allowance' && positions.map((p) => (
            <div className="position" key={p.token}>
              <span className="small muted">{p.token}: claimed <Amount wei={p.claimed} /> of <Amount wei={p.approved} /></span>
              <ClaimProgress claimed={p.claimed} remaining={p.remaining} />
            </div>
          ))}
          {group.address && (
            <p className="row-meta" style={{ margin: '0.75rem 0' }}>
              <span>Recipient <span className="mono">{getAddress(group.address)}</span></span>
              <a className="link-out" href={addressUrl(group.address)} target="_blank" rel="noopener noreferrer">Open on Celoscan</a>
              {positions.map((p) => (
                <a key={p.token} className="link-out" href={tokenHolderUrl(p.token, group.address)} target="_blank" rel="noopener noreferrer">
                  See its {p.token} claims on Celoscan
                </a>
              ))}
            </p>
          )}
          {group.grants.filter((g) => tokens.has(g.token)).map((g) => <Grant key={`${g.tx}-${g.to}-${g.token}`} grant={g} />)}
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

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.groups
      .filter((g) => token === 'all' || g.tokens.includes(token))
      .filter((g) => status === 'all' || g.status === status)
      .filter((g) => !q || g.title.toLowerCase().includes(q) || (g.address ?? '').toLowerCase().includes(q) || g.cgps.some((n) => `cgp-${n}` === q || String(n) === q))
      .sort(SORTS[sort].compare);
  }, [state.groups, query, token, status, sort]);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Ledger</p>
        <h1 className="display">Every grant, to the last CELO.</h1>
        <p className="lede">
          One line per recipient, with every token it was granted. Approved is what governance granted, claimed is
          what the recipient already took, remaining is what it can still take. Open any line to see the proposals behind it.
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
            {groups.length} of {state.groups.length} recipients. Amounts are in whole units; hover a number for the exact value.
          </p>

          {groups.length === 0 ? (
            <p className="empty">Nothing matches these filters.</p>
          ) : (
            <>
              <div className="ledger-head" aria-hidden="true">
                <span>Recipient</span><span>Approved</span><span>Claimed</span><span>Remaining</span><span />
              </div>
              <ul className="rows" style={{ borderTop: 0 }}>
                {groups.map((g) => (
                  <Entry key={g.key} group={g} positions={token === 'all' ? g.positions : g.positions.filter((p) => p.token === token)} />
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </>
  );
}
