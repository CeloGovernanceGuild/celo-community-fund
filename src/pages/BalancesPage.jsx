import React, { useEffect, useState } from 'react';
import { COMMUNITY_FUND_EXPLORER, EXPLORER, RESERVE_ADDRESS } from '../data/data';
import { fetchMarket } from '../lib/celo';
import { TOKENS } from '../lib/fund';
import { formatUsd, formatWei } from '../lib/format';

const formatPrice = (price8) => {
  if (!price8) return 'n/a';
  const s = price8.toString().padStart(9, '0');
  return `$${s.slice(0, -8)}.${s.slice(-8)}`;
};

function Holdings({ title, href, amounts, prices }) {
  return (
    <div className="card">
      <h4><a href={href} target="_blank" rel="noopener noreferrer">{title}</a></h4>
      <table>
        <thead><tr><th>Token</th><th className="num">Balance</th><th className="num">USD value</th></tr></thead>
        <tbody>
          {TOKENS.map((t) => (
            <tr key={t}>
              <td>{t}</td>
              <td className="num">{formatWei(amounts[t])}</td>
              <td className="num">{prices ? formatUsd(amounts[t], prices[t]) ?? 'n/a' : '...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BalancesPage({ state }) {
  const [market, setMarket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMarket()
      .then((m) => { if (!cancelled) setMarket(m); })
      .catch((err) => { console.error(err); if (!cancelled) setError('Could not load Reserve balances and prices.'); });
    return () => { cancelled = true; };
  }, []);

  const fund = Object.fromEntries(TOKENS.map((t) => [t, state.tokens[t].balance]));

  return (
    <section className="page">
      <div className="cards">
        <Holdings title="Community Fund" href={COMMUNITY_FUND_EXPLORER} amounts={fund} prices={market?.prices} />
        {market && <Holdings title="Reserve" href={`${EXPLORER}/address/${RESERVE_ADDRESS}`} amounts={market.reserve} prices={market.prices} />}
      </div>
      {market && TOKENS.every((t) => market.reserve[t] === 0n) && (
        <p className="note">
          The Reserve holds no CELO, USDm or EURm: governance moved its CELO into the Community Fund to fund
          grants (see the inflows section of the audit report).
        </p>
      )}
      {error && <p className="loading">{error}</p>}

      <div className="card">
        <h4>Community Fund commitments</h4>
        <table>
          <thead>
            <tr><th>Token</th><th className="num">Balance</th><th className="num">Open allowances</th><th className="num">Pending proposals</th><th className="num">Available</th></tr>
          </thead>
          <tbody>
            {TOKENS.map((t) => {
              const s = state.tokens[t];
              return (
                <tr key={t}>
                  <td>{t}</td>
                  <td className="num">{formatWei(s.balance)}</td>
                  <td className="num">{formatWei(s.open)}</td>
                  <td className="num">{formatWei(s.reserved)}</td>
                  <td className={s.available < 0n ? 'num negative' : 'num'}>{formatWei(s.available)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="note">
          A negative value means open allowances exceed the balance: a claim above the balance reverts, so those
          allowances are not backed by funds.
        </p>
      </div>

      {market && (
        <p className="note">
          Prices from Chainlink on Celo: CELO/USD {formatPrice(market.prices.CELO)}, EUR/USD {formatPrice(market.prices.EURm)}, USDm at $1.
          USD values are conversions to the cent; token balances are exact.
        </p>
      )}
    </section>
  );
}
