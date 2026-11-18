import React from 'react';
import { getAddress } from 'viem';
import Amount from '../components/Amount';
import { addressUrl } from '../data/data';
import { proposals } from '../data';

const STAGE_TEXT = {
  Queued: 'Queued on-chain',
  Approval: 'Waiting for approval',
  Referendum: 'Voting now',
  Execution: 'Passed, waiting for execution',
  Expiration: 'Expired on-chain',
};
const LIVE = new Set(['Queued', 'Approval', 'Referendum', 'Execution']);

export default function ProposalsPage({ state }) {
  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Proposals</p>
        <h1 className="display">What could change the fund next.</h1>
        <p className="lede">
          Governance proposals that are drafted or in progress. Funding requests that can still pass are
          already subtracted from the available balance.
        </p>
        <div className="actions">
          <a className="button" href="https://mondo.celo.org/governance" target="_blank" rel="noopener noreferrer">Vote on Mondo</a>
          <a className="link-arrow" href="https://github.com/celo-org/governance/tree/main/CGPs" target="_blank" rel="noopener noreferrer">All CGPs</a>
        </div>
      </header>

      <div className="stack">
        {state.pending.length === 0 && (
          <p className="notice" role="note">
            <span><strong>No pending funding requests.</strong> None of the proposals below asks for money from the fund.</span>
          </p>
        )}

        {proposals.length === 0 && <p className="card empty">There are no drafted or in-progress proposals right now.</p>}

        {proposals.map((p) => (
          <article className="card" key={p.cgp}>
            <div className="row-meta" style={{ marginTop: 0, marginBottom: '0.5rem' }}>
              <span className="badge plain">CGP-{p.cgp}</span>
              <span className={LIVE.has(p.stage) ? 'badge live' : 'badge'}>
                {p.stage ? STAGE_TEXT[p.stage] ?? p.stage : 'Draft, not submitted on-chain'}
              </span>
              {p.created && <span>Created {p.created}</span>}
            </div>
            <h2 className="section-title">{p.title}</h2>
            {p.stage === 'Expiration' ? (
              <p className="muted" style={{ marginTop: '0.5rem' }}>Expired on-chain and does not affect the current available balance.</p>
            ) : p.requests.length === 0 ? (
              <p className="muted" style={{ marginTop: '0.5rem' }}>Does not request funds.</p>
            ) : (
              <ul className="rows" style={{ marginTop: '1rem' }}>
                {p.requests.map((r) => (
                  <li key={`${r.function}-${r.to}-${r.token}`}>
                    <div className="row-main">
                      <span className="row-title">Requests <Amount wei={r.amount} /> {r.token}</span>
                      <a className="link-out" href={addressUrl(r.to)} target="_blank" rel="noopener noreferrer" title={getAddress(r.to)}>Open the recipient on Celoscan</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="actions">
              <a className="link-arrow" href={p.url} target="_blank" rel="noopener noreferrer">Read the proposal</a>
              {p.proposalId && <span className="muted">On-chain proposal {p.proposalId}</span>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
