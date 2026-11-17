import React, { Fragment, useState } from 'react';
import { getAddress } from 'viem';
import { EXPLORER } from '../data/data';
import { TOKENS } from '../lib/fund';
import { formatWei } from '../lib/format';

const cgpUrl = (n) => `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(n).padStart(4, '0')}.md`;
const STATUSES = ['all', 'open', 'fully claimed', 'transferred'];

function Grants({ entry }) {
  return (
    <table className="grants">
      <thead>
        <tr>
          <th>Date</th><th>CGP</th><th>Proposal</th><th>Function</th><th>To</th>
          <th className="num">Requested</th><th className="num">Replaced</th><th className="num">Effective</th><th>Execution tx</th>
        </tr>
      </thead>
      <tbody>
        {entry.grants.map((g) => (
          <tr key={`${g.tx}-${g.to}`}>
            <td>{g.date}</td>
            <td><a href={cgpUrl(g.cgp)} target="_blank" rel="noopener noreferrer">CGP-{g.cgp}</a></td>
            <td>{g.proposalId}</td>
            <td>{g.function}</td>
            <td className="mono"><a href={`${EXPLORER}/address/${g.to}`} target="_blank" rel="noopener noreferrer">{getAddress(g.to)}</a></td>
            <td className="num">{formatWei(g.requested)}</td>
            <td className="num">{formatWei(g.replaced)}</td>
            <td className="num">{formatWei(g.effective)}</td>
            <td className="mono"><a href={`${EXPLORER}/tx/${g.tx}`} target="_blank" rel="noopener noreferrer">{g.tx}</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function LedgerPage({ state }) {
  const [token, setToken] = useState('all');
  const [status, setStatus] = useState('all');
  const [expanded, setExpanded] = useState(() => new Set());

  const rows = state.rows.filter((r) => (token === 'all' || r.token === token) && (status === 'all' || r.status === status));
  const toggle = (key) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <section className="page">
      <p className="page-intro">
        Every grant the Community Fund made through governance. <strong>Approved</strong> is the effective amount
        governance granted, <strong>Claimed</strong> what the spender already pulled, <strong>Remaining</strong> the
        live allowance. Amounts are exact; click a row to see each proposal and its execution transaction.
      </p>

      <table className="totals">
        <thead>
          <tr><th>Token</th><th className="num">Approved</th><th className="num">Claimed</th><th className="num">Remaining</th></tr>
        </thead>
        <tbody>
          {TOKENS.map((t) => (
            <tr key={t}>
              <td>{t}</td>
              <td className="num">{formatWei(state.tokens[t].approved)}</td>
              <td className="num">{formatWei(state.tokens[t].claimed)}</td>
              <td className="num">{formatWei(state.tokens[t].open)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="filters">
        <label>Token{' '}
          <select value={token} onChange={(e) => setToken(e.target.value)}>
            {['all', ...TOKENS].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Status{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <span>{rows.length} entries</span>
      </div>

      <div className="table-scroll">
        <table className="ledger">
          <thead>
            <tr>
              <th>Initiative</th><th>Token</th><th className="num">Approved</th><th className="num">Claimed</th>
              <th className="num">Remaining</th><th>Status</th><th>CGPs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const key = `${r.kind}:${r.token}:${r.address ?? r.title}`;
              const open = expanded.has(key);
              return (
                <Fragment key={key}>
                  <tr className={`ledger-row status-${r.status.replace(' ', '-')}`} onClick={() => toggle(key)} aria-expanded={open}>
                    <td>{open ? '- ' : '+ '}{r.title}</td>
                    <td>{r.token}</td>
                    <td className="num">{formatWei(r.approved)}</td>
                    <td className="num">{formatWei(r.claimed)}</td>
                    <td className="num">{formatWei(r.remaining)}</td>
                    <td>{r.status}</td>
                    <td>{r.cgps.map((n) => <a key={n} href={cgpUrl(n)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{n} </a>)}</td>
                  </tr>
                  {open && (
                    <tr className="grants-row">
                      <td colSpan={7}>
                        {r.address && (
                          <p className="mono">Spender: <a href={`${EXPLORER}/address/${r.address}`} target="_blank" rel="noopener noreferrer">{getAddress(r.address)}</a></p>
                        )}
                        <Grants entry={r} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
