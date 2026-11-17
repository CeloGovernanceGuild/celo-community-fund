import React from 'react';
import { getAddress } from 'viem';
import { EXPLORER } from '../data/data';
import { proposals } from '../data';
import { formatWei } from '../lib/format';

export default function ProposalsPage({ state }) {
  return (
    <section className="page">
      <p className="page-intro">
        CGPs that are not executed and not rejected, withdrawn or expired in{' '}
        <a href="https://github.com/celo-org/governance" target="_blank" rel="noopener noreferrer">celo-org/governance</a>,
        with the on-chain stage of their proposal. Fund requests of proposals that can still execute are reserved from the funds available.
      </p>

      {proposals.length === 0 && <p>No pending proposals.</p>}
      <div className="cards">
        {proposals.map((p) => (
          <div className="card" key={p.cgp}>
            <h4><a href={p.url} target="_blank" rel="noopener noreferrer">CGP-{p.cgp}: {p.title}</a></h4>
            <p>
              Status <strong>{p.status}</strong>
              {p.proposalId ? <> | proposal {p.proposalId}, on-chain stage <strong>{p.stage}</strong></> : ' | not submitted on-chain'}
              {p.created && <> | created {p.created}</>}
            </p>
            {p.stage === 'Expiration' && <p className="note">Expired on-chain: it can no longer execute, the CGP status is out of date.</p>}
            {p.requests.length === 0 ? (
              <p className="note">Non-funding proposal.</p>
            ) : (
              <table>
                <thead><tr><th>Function</th><th className="num">Amount</th><th>Token</th><th>To</th></tr></thead>
                <tbody>
                  {p.requests.map((r) => (
                    <tr key={`${r.function}-${r.to}`}>
                      <td>{r.function}</td>
                      <td className="num">{formatWei(r.amount)}</td>
                      <td>{r.token}</td>
                      <td className="mono"><a href={`${EXPLORER}/address/${r.to}`} target="_blank" rel="noopener noreferrer">{getAddress(r.to)}</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {state.pending.length > 0 && (
        <p className="note">Reserved from funds available: {state.pending.map((p) => `${p.title} ${formatWei(p.amount)} ${p.token}`).join(', ')}.</p>
      )}
    </section>
  );
}
