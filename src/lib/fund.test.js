import { describe, expect, it } from 'vitest';
import { allowanceKey, buildFundState, groupByRecipient } from './fund.js';

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

  it('does not count unclaimed proposal deposits as available', () => {
    const state = buildFundState({ balances: { CELO: 1000n * E, USDm: 10n * E }, allowances: {}, ledger, deposits: 40n * E });

    expect(state.tokens.CELO).toMatchObject({ deposits: 40n * E, available: 960n * E });
    expect(state.tokens.USDm).toMatchObject({ deposits: 0n, available: 10n * E });
    expect(state.composition.find((c) => c.key === 'deposits').wei).toBe(40n * E);
  });

  it('reports a negative available amount when allowances exceed the balance', () => {
    const allowances = { [allowanceKey('USDm', B)]: 500n * E };
    const state = buildFundState({ balances: { USDm: 2n * E }, allowances, ledger });

    expect(state.tokens.USDm.available).toBe(2n * E - 500n * E);
  });

  it('splits the CELO balance for the composition bar without a negative segment', () => {
    const allowances = { [allowanceKey('CELO', A)]: 900n * E };
    const state = buildFundState({ balances: { CELO: 100n * E }, allowances, ledger });

    expect(state.tokens.CELO.available).toBe(-800n * E);
    expect(state.composition.map((c) => [c.key, c.wei])).toEqual([
      ['available', 0n],
      ['committed', 900n * E],
      ['pending', 0n],
      ['deposits', 0n],
    ]);
  });
});

describe('groupByRecipient', () => {
  const grant = (date) => ({ date, cgp: 1, tx: '0x1', to: A, requested: '1', replaced: '0', effective: '1' });
  const multi = [
    { title: 'PG', token: 'USDm', kind: 'allowance', address: A, approved: (100n * E).toString(), cgps: [141], grants: [grant('2024-07-13')] },
    { title: 'PG', token: 'CELO', kind: 'allowance', address: A.toUpperCase().replace('0X', '0x'), approved: (1250n * E).toString(), cgps: [141], grants: [grant('2024-07-13')] },
    { title: 'T', token: 'CELO', kind: 'transfer', approved: (5n * E).toString(), cgps: [3], grants: [grant('2023-01-01')] },
  ];

  it('puts every token of one recipient in a single entry, CELO first', () => {
    const allowances = { [allowanceKey('USDm', A)]: 100n * E, [allowanceKey('CELO', A)]: 0n };
    const { rows } = buildFundState({ balances: {}, allowances, ledger: multi });
    const groups = groupByRecipient(rows);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({ title: 'PG', tokens: ['CELO', 'USDm'], status: 'open', cgps: [141] });
    expect(groups[0].grants.map((g) => g.token)).toEqual(['CELO', 'USDm']);
    expect(groups[1]).toMatchObject({ title: 'T', tokens: ['CELO'], status: 'transferred' });
  });
});
