import { describe, expect, it } from 'vitest';
import { ledger } from '../data/ledger.js';
import { CAMPS, ORGANISATIONS, RECIPIENTS } from '../data/organisations.js';
import { buildFundState } from './fund.js';
import { groupByOrganisation, organisationOf, paidOutByCamp } from './organisations.js';

const E = 10n ** 18n;
const A = '0x00000000000000000000000000000000000000aa';
const B = '0x00000000000000000000000000000000000000bb';
const C = '0x00000000000000000000000000000000000000cc';
const recipients = { [A]: 'Org One', [B]: 'Org One', [C]: 'Org Two', 'transfer:T': 'Org Two' };
const organisations = { 'Org One': { camp: 'community', family: 'F1' }, 'Org Two': { camp: 'companies', family: 'F2' } };
const groups = [
  { key: A, title: 'a', status: 'open', cgps: [2], lastGrant: '2024-01-01', positions: [{ token: 'CELO', approved: 100n * E, paidOut: 60n * E, remaining: 40n * E }] },
  { key: B, title: 'b', status: 'fully claimed', cgps: [1], lastGrant: '2025-01-01', positions: [
    { token: 'CELO', approved: 10n * E, paidOut: 10n * E, remaining: 0n },
    { token: 'USDm', approved: 5n * E, paidOut: 5n * E, remaining: 0n },
  ] },
  { key: C, title: 'c', status: 'fully claimed', cgps: [3], lastGrant: '2023-01-01', positions: [{ token: 'CELO', approved: 7n * E, paidOut: 7n * E, remaining: 0n }] },
  { key: 'transfer:T', title: 'T', status: 'transferred', cgps: [4], lastGrant: '2022-01-01', positions: [{ token: 'CELO', approved: 3n * E, paidOut: 3n * E, remaining: 0n }] },
  { key: '0x00000000000000000000000000000000000000dd', title: 'Nobody', status: 'fully claimed', cgps: [5], lastGrant: '2021-01-01', positions: [{ token: 'CELO', approved: E, paidOut: E, remaining: 0n }] },
];

describe('organisations data', () => {
  it('maps every recipient in the generated ledger to a known organisation', () => {
    const state = buildFundState({ balances: {}, allowances: {}, ledger });
    const missing = state.groups.filter((g) => !RECIPIENTS[g.key]).map((g) => `${g.key} (${g.title})`);
    expect(missing).toEqual([]);
    const unknown = [...new Set(Object.values(RECIPIENTS))].filter((name) => !ORGANISATIONS[name]);
    expect(unknown).toEqual([]);
  });

  it('puts every organisation in a known camp', () => {
    const camps = new Set(CAMPS.map((c) => c.key));
    expect(Object.entries(ORGANISATIONS).filter(([, o]) => !camps.has(o.camp))).toEqual([]);
  });
});

describe('groupByOrganisation', () => {
  it('adds up recipients per token and keeps them underneath', () => {
    const orgs = groupByOrganisation(groups, recipients, organisations);
    const one = orgs.find((o) => o.title === 'Org One');
    expect(one.recipients.map((r) => r.title)).toEqual(['a', 'b']);
    expect(one.positions).toEqual([
      { token: 'CELO', approved: 110n * E, paidOut: 70n * E, remaining: 40n * E },
      { token: 'USDm', approved: 5n * E, paidOut: 5n * E, remaining: 0n },
    ]);
    expect(one).toMatchObject({ camp: 'community', status: 'open', cgps: [1, 2], lastGrant: '2025-01-01' });
  });

  it('marks an organisation transferred only when every recipient was a transfer', () => {
    const two = groupByOrganisation(groups, recipients, organisations).find((o) => o.title === 'Org Two');
    expect(two.status).toBe('fully claimed');
  });

  it('keeps an unmapped recipient visible as its own organisation', () => {
    expect(organisationOf(groups[4], recipients, organisations)).toEqual({ name: 'Nobody', camp: 'unassigned', family: 'Unassigned' });
  });
});

describe('paidOutByCamp', () => {
  it('adds up what each camp was paid in one token, in camp order', () => {
    const segments = paidOutByCamp(groups, 'CELO', recipients, organisations);
    expect(segments.map((s) => s.key)).toEqual(CAMPS.map((c) => c.key));
    expect(segments.find((s) => s.key === 'community').wei).toBe(70n * E);
    expect(segments.find((s) => s.key === 'companies').wei).toBe(10n * E);
  });
});
