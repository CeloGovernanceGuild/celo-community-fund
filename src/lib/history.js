import { CAMPS, ORGANISATIONS, RECIPIENTS } from '../data/organisations.js';
import { organisationOf } from './organisations.js';

const WEI = 10n ** 18n;

/**
 * Every grant in the ledger, one per proposal transaction, with the organisation behind its recipient.
 * `wei` is the change the proposal applied on-chain, so an allowance that was lowered counts as negative.
 */
export function ledgerGrants(ledger, recipients = RECIPIENTS, organisations = ORGANISATIONS) {
  return ledger.flatMap((entry) => {
    const org = organisationOf({ address: entry.address, title: entry.title }, recipients, organisations);
    return entry.grants.map((g) => ({
      date: g.date,
      year: Number(g.date.slice(0, 4)),
      cgp: g.cgp,
      token: entry.token,
      wei: BigInt(g.effective),
      recipient: entry.title,
      organisation: org.name,
      camp: org.camp,
    }));
  });
}

/**
 * What governance approved for one token, per year and camp, in wei. Every year from the first grant in
 * any token to the last is present, so the columns of different tokens line up.
 */
export function approvedByYear(grants, token) {
  if (grants.length === 0) return [];
  const years = grants.map((g) => g.year);
  const rows = [];
  for (let year = Math.min(...years); year <= Math.max(...years); year += 1) {
    const row = { year, total: 0n };
    for (const c of CAMPS) row[c.key] = 0n;
    for (const g of grants) {
      if (g.year !== year || g.token !== token || !(g.camp in row)) continue;
      row[g.camp] += g.wei;
      row.total += g.wei;
    }
    rows.push(row);
  }
  return rows;
}

/** Organisations and their grants, ordered by camp and then by first grant. */
export function grantTimeline(grants) {
  const orgs = new Map();
  for (const g of grants) {
    if (!orgs.has(g.organisation)) orgs.set(g.organisation, { name: g.organisation, camp: g.camp, grants: [] });
    orgs.get(g.organisation).grants.push(g);
  }
  const campOrder = (key) => {
    const i = CAMPS.findIndex((c) => c.key === key);
    return i === -1 ? CAMPS.length : i;
  };
  return [...orgs.values()]
    .map((org) => {
      const sorted = [...org.grants].sort((a, b) => a.date.localeCompare(b.date));
      return { ...org, grants: sorted, first: sorted[0].date, last: sorted.at(-1).date };
    })
    .sort((a, b) => campOrder(a.camp) - campOrder(b.camp) || a.first.localeCompare(b.first) || a.name.localeCompare(b.name));
}

/**
 * Proposals that set their budget in dollars and were paid in CELO. The dollar value of the CELO part is the
 * proposal's own; `price` is that value divided by the CELO, so it includes any buffer the proposal added.
 * `today` is the same CELO at the live CELO/USD price (8 decimals), or null when the price could not be read.
 */
export function pricedProposals(priced, grants, celoUsd8) {
  const orgOf = new Map();
  for (const g of grants) if (!orgOf.has(g.cgp)) orgOf.set(g.cgp, g);
  return priced.map((p) => {
    const usdForCelo = p.usd - p.other;
    const org = orgOf.get(p.cgp);
    const today = celoUsd8 ? Number((BigInt(p.celo) * BigInt(celoUsd8)) / 10n ** 6n) / 100 : null;
    return {
      ...p,
      organisation: org?.organisation ?? `CGP-${p.cgp}`,
      camp: org?.camp ?? 'unassigned',
      usdForCelo,
      price: usdForCelo / p.celo,
      today,
      change: today === null ? null : today / usdForCelo - 1,
    };
  });
}

/** Totals for pricedProposals rows: CELO, its dollar value when approved, and today. */
export function pricedTotals(rows) {
  const celo = rows.reduce((sum, r) => sum + r.celo, 0);
  const then = rows.reduce((sum, r) => sum + r.usdForCelo, 0);
  const today = rows.every((r) => r.today !== null) ? rows.reduce((sum, r) => sum + r.today, 0) : null;
  return { celo, then, today };
}

/** Whole tokens from wei, for chart geometry and short labels. */
export const wholeTokens = (wei) => Number(wei / WEI);
