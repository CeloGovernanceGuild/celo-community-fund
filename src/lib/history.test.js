import { describe, expect, it } from 'vitest';
import { ledger } from '../data/ledger.js';
import { PRICED } from '../data/fundHistory.js';
import { approvedByYear, grantTimeline, ledgerGrants, pricedProposals, pricedTotals } from './history.js';

const E18 = 10n ** 18n;
const recipients = { '0xa': 'Org A', '0xb': 'Org B', 'transfer:Gift': 'Org B' };
const organisations = {
  'Org A': { camp: 'companies', family: 'x' },
  'Org B': { camp: 'community', family: 'y' },
};
const sample = [
  { title: 'A', token: 'CELO', address: '0xA', grants: [
    { cgp: 1, date: '2021-03-01', effective: (5n * E18).toString() },
    { cgp: 4, date: '2023-01-01', effective: (-2n * E18).toString() },
  ] },
  { title: 'B', token: 'USDm', address: '0xB', grants: [{ cgp: 2, date: '2022-06-01', effective: (7n * E18).toString() }] },
  { title: 'Gift', token: 'CELO', grants: [{ cgp: 3, date: '2021-01-01', effective: (1n * E18).toString() }] },
];

describe('ledgerGrants', () => {
  it('lists every grant with its organisation and signed amount', () => {
    const grants = ledgerGrants(sample, recipients, organisations);
    expect(grants).toHaveLength(4);
    expect(grants.find((g) => g.cgp === 4)).toMatchObject({ organisation: 'Org A', camp: 'companies', wei: -2n * E18, year: 2023 });
    expect(grants.find((g) => g.cgp === 3)).toMatchObject({ organisation: 'Org B', token: 'CELO' });
  });

  it('assigns every grant in the generated ledger to a camp', () => {
    expect(ledgerGrants(ledger).filter((g) => g.camp === 'unassigned')).toEqual([]);
  });
});

describe('approvedByYear', () => {
  const grants = ledgerGrants(sample, recipients, organisations);

  it('adds up one token per year and camp, keeping empty years', () => {
    const rows = approvedByYear(grants, 'CELO');
    expect(rows.map((r) => r.year)).toEqual([2021, 2022, 2023]);
    expect(rows[0]).toMatchObject({ companies: 5n * E18, community: 1n * E18, total: 6n * E18 });
    expect(rows[1].total).toBe(0n);
    expect(rows[2].companies).toBe(-2n * E18);
  });

  it('matches the ledger total for each token', () => {
    const all = ledgerGrants(ledger);
    for (const token of ['CELO', 'USDm']) {
      const fromRows = approvedByYear(all, token).reduce((sum, r) => sum + r.total, 0n);
      const fromLedger = ledger.filter((e) => e.token === token).reduce((sum, e) => sum + BigInt(e.approved), 0n);
      expect(fromRows).toBe(fromLedger);
    }
  });
});

describe('grantTimeline', () => {
  it('orders organisations by camp, then first grant', () => {
    const timeline = grantTimeline(ledgerGrants(sample, recipients, organisations));
    expect(timeline.map((o) => o.name)).toEqual(['Org A', 'Org B']);
    expect(timeline[1]).toMatchObject({ first: '2021-01-01', last: '2022-06-01' });
  });
});

describe('pricedProposals', () => {
  const grants = ledgerGrants(sample, recipients, organisations);
  const priced = [{ cgp: 1, date: '2021-03-01', usd: 150, celo: 100, other: 50 }];

  it('values the CELO part at the proposal price and at today', () => {
    const [row] = pricedProposals(priced, grants, 50000000n);
    expect(row).toMatchObject({ organisation: 'Org A', usdForCelo: 100, price: 1, today: 50 });
    expect(row.change).toBeCloseTo(-0.5);
    expect(pricedTotals([row])).toEqual({ celo: 100, then: 100, today: 50 });
  });

  it('leaves today empty when the price is missing', () => {
    const [row] = pricedProposals(priced, grants, null);
    expect(row.today).toBeNull();
    expect(pricedTotals([row]).today).toBeNull();
  });

  it('finds an organisation for every priced proposal in the snapshot', () => {
    const rows = pricedProposals(PRICED, ledgerGrants(ledger), null);
    expect(rows.filter((r) => r.camp === 'unassigned')).toEqual([]);
    for (const r of rows) expect(r.price).toBeGreaterThan(0);
  });
});
