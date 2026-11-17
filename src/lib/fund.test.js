import { describe, expect, it } from 'vitest';
import { allowanceKey, buildFundState } from './fund.js';

const E = 10n ** 18n;
const A = '0x00000000000000000000000000000000000000aa';
const B = '0x00000000000000000000000000000000000000bb';
const ledger = [
  { title: 'A', token: 'CELO', kind: 'allowance', address: A, approved: (1000n * E).toString(), cgps: [1], grants: [] },
  { title: 'B', token: 'USDm', kind: 'allowance', address: B, approved: (500n * E).toString(), cgps: [2], grants: [] },
  { title: 'T', token: 'CELO', kind: 'transfer', approved: (300n * E).toString(), cgps: [3], grants: [] },
];

describe('buildFundState', () => {
  it('computes claimed and remaining exactly, keeping 1 wei', () => {
    const allowances = { [allowanceKey('CELO', A)]: 1n, [allowanceKey('USDm', B)]: 0n };
    const state = buildFundState({ balances: { CELO: 10000n * E, USDm: 0n, EURm: 0n }, allowances, ledger });
    const [a, b, t] = state.rows;

    expect(a).toMatchObject({ remaining: 1n, claimed: 1000n * E - 1n, status: 'open' });
    expect(b).toMatchObject({ remaining: 0n, claimed: 500n * E, status: 'fully claimed' });
    expect(t).toMatchObject({ remaining: 0n, claimed: 300n * E, status: 'transferred' });
    expect(state.tokens.CELO.available).toBe(10000n * E - 1n);
  });

  it('reserves requests of proposals that can still execute and manual drafts', () => {
    const proposals = [
      { cgp: 9, stage: 'Referendum', url: 'u', requests: [{ token: 'CELO', amount: (50n * E).toString() }] },
      { cgp: 8, stage: 'Expiration', url: 'u', requests: [{ token: 'CELO', amount: (70n * E).toString() }] },
    ];
    const drafts = [{ title: 'D', amount: '0.5' }];
    const state = buildFundState({ balances: { CELO: 1000n * E }, allowances: {}, ledger, proposals, drafts });

    expect(state.tokens.CELO.reserved).toBe(50n * E + E / 2n);
    expect(state.pending.map((p) => p.title)).toEqual(['CGP-9', 'D']);
  });

  it('reports a negative available amount when allowances exceed the balance', () => {
    const allowances = { [allowanceKey('USDm', B)]: 500n * E };
    const state = buildFundState({ balances: { USDm: 2n * E }, allowances, ledger });

    expect(state.tokens.USDm.available).toBe(2n * E - 500n * E);
  });

  it('never gives the chart a negative slice and keeps the real value for tooltips', () => {
    const allowances = { [allowanceKey('CELO', A)]: 900n * E };
    const state = buildFundState({ balances: { CELO: 100n * E }, allowances, ledger });
    const fund = state.charts.Current.children[0].children[0];

    expect(fund.loc).toBe(0);
    expect(fund.label).toBe('-800');
  });
});
