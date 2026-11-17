const WEI = 10n ** 18n;
const group = (digits) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Exact decimal string of a wei amount with thousands separators. Never rounds. */
export function formatWei(wei) {
  const value = BigInt(wei);
  const sign = value < 0n ? '-' : '';
  const abs = value < 0n ? -value : value;
  const frac = (abs % WEI).toString().padStart(18, '0').replace(/0+$/, '');
  return sign + group((abs / WEI).toString()) + (frac ? `.${frac}` : '');
}

/** Approximate number for chart geometry only; never displayed as a value. */
export const toNumber = (wei) => Number(BigInt(wei) / 10n ** 12n) / 1e6;

/** Parse a decimal token string ("1234.5") into wei. */
export function parseUnits18(text) {
  const [whole, frac = ''] = String(text).split('.');
  return BigInt(whole || '0') * WEI + BigInt((frac + '0'.repeat(18)).slice(0, 18));
}

/** USD value of a wei amount at a Chainlink price with 8 decimals, to the cent (a conversion, not accounting). */
export function formatUsd(wei, price8) {
  if (!price8) return null;
  const cents = (BigInt(wei) * BigInt(price8)) / 10n ** 24n;
  return `$${group((cents / 100n).toString())}.${(cents % 100n).toString().padStart(2, '0')}`;
}
