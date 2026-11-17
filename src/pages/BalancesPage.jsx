import React, { useEffect, useState } from 'react';
import Amount from '../components/Amount';
import { CELO_USD_FEED, COMMUNITY_FUND_EXPLORER, EUR_USD_FEED, GOVERNANCE_ADDRESS, RESERVE_ADDRESS, addressUrl, tokenHolderUrl } from '../data/data';
import { fetchMarket } from '../lib/celo';
import { TOKENS } from '../lib/fund';
import { formatUsd } from '../lib/format';

const formatPrice = (price8) => {
  if (!price8) return 'not available';
  const s = price8.toString().padStart(9, '0');
  return `$${s.slice(0, -8)}.${s.slice(-8, -4)}`;
};

function Holdings({ title, href, holder, amounts, prices }) {
  return (
    <section className="card">
      <div className="card-head">
        <h2 className="section-title">{title}</h2>
        <a className="link-out" href={href} target="_blank" rel="noopener noreferrer">Open contract on Celoscan</a>
      </div>
      <table className="table">
        <thead><tr><th>Token</th><th className="num">Balance</th><th className="num">USD value</th></tr></thead>
        <tbody>
          {TOKENS.map((t) => (
            <tr key={t}>
              <td>
                <a className="link-out" href={tokenHolderUrl(t, holder)} target="_blank" rel="noopener noreferrer" title={`${t} balance and transfers on Celoscan`}>{t}</a>
              </td>
              <td className="num"><Amount wei={amounts[t]} /></td>
              <td className="num">{prices ? formatUsd(amounts[t], prices[t]) ?? 'n/a' : '...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function BalancesPage({ state }) {
  const [market, setMarket] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMarket()
      .then((m) => { if (!cancelled) setMarket(m); })
      .catch((err) => { console.error(err); if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  const fund = Object.fromEntries(TOKENS.map((t) => [t, state.tokens[t].balance]));
  const reserveEmpty = market && TOKENS.every((t) => market.reserve[t] === 0n);
  const unbacked = TOKENS.filter((t) => state.tokens[t].available < 0n);

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Balances</p>
        <h1 className="display">What the fund holds, and what it owes.</h1>
        <p className="lede">Token balances of the Community Fund and the historical Celo Governance Reserve, and how much of the fund is already promised.</p>
      </header>

      <div className="stack">
        <div className="grid-2">
          <Holdings title="Community Fund" href={COMMUNITY_FUND_EXPLORER} holder={GOVERNANCE_ADDRESS} amounts={fund} prices={market?.prices} />
          {market && <Holdings title="Celo Governance Reserve (historical)" href={addressUrl(RESERVE_ADDRESS)} holder={RESERVE_ADDRESS} amounts={market.reserve} prices={market.prices} />}
        </div>

        {reserveEmpty && (
          <p className="notice" role="note">
            <span>The historical Celo Governance Reserve holds none of these tokens. It is separate from the Community Fund and does not reduce its Available amount.</span>
          </p>
        )}
        {error && <p className="notice" role="alert"><span>Governance Reserve balances and prices could not be loaded.</span></p>}

        <section className="card" aria-labelledby="commitments-title">
          <div className="card-head">
            <div>
              <h2 className="section-title" id="commitments-title">Commitments</h2>
              <p className="muted">
                Available is the balance minus open allowances, pending proposals and the proposal deposits that their
                proposers have not withdrawn yet.{' '}
                <a href="#/ledger?status=open">See the open allowances</a>
              </p>
            </div>
          </div>
          <table className="table stackable">
            <thead>
              <tr><th>Token</th><th className="num">Balance</th><th className="num">Open allowances</th><th className="num">Pending proposals</th><th className="num">Proposal deposits</th><th className="num">Available</th></tr>
            </thead>
            <tbody>
              {TOKENS.map((t) => {
                const s = state.tokens[t];
                return (
                  <tr key={t}>
                    <td data-label="Token">{t}</td>
                    <td className="num" data-label="Balance"><Amount wei={s.balance} /></td>
                    <td className="num" data-label="Open allowances"><Amount wei={s.open} /></td>
                    <td className="num" data-label="Pending proposals"><Amount wei={s.reserved} /></td>
                    <td className="num" data-label="Proposal deposits"><Amount wei={s.deposits} /></td>
                    <td className={s.available < 0n ? 'num negative' : 'num'} data-label="Available"><Amount wei={s.available} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {unbacked.length > 0 && (
            <p className="small muted" style={{ marginTop: '1rem' }}>
              A negative amount means open {unbacked.join(' and ')} allowances are larger than the balance. A claim above the
              balance fails, so those allowances are not backed by funds.
            </p>
          )}
        </section>

        {market && (
          <p className="small muted">
            USD values use Chainlink prices on Celo:{' '}
            <a className="link-out" href={addressUrl(CELO_USD_FEED)} target="_blank" rel="noopener noreferrer">CELO {formatPrice(market.prices.CELO)}</a>,{' '}
            <a className="link-out" href={addressUrl(EUR_USD_FEED)} target="_blank" rel="noopener noreferrer">EUR {formatPrice(market.prices.EURm)}</a>, USDm at $1.
          </p>
        )}
      </div>
    </>
  );
}
