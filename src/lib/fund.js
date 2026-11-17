import {
  COMMUNITY_FUND_EXPLORER,
  contract_celo_available_color,
  contract_celo_spent_color,
  initiative_available_celo_color,
  initiative_spent_celo_color,
  pending_drafts_celo_color,
} from '../data/data.js';
import { formatWei, parseUnits18, toNumber } from './format.js';

export const TOKENS = ['CELO', 'USDm', 'EURm'];
// On-chain stages in which a proposal can still execute (null: CGP not submitted on-chain yet).
const LIVE_STAGES = new Set([null, 'Queued', 'Approval', 'Referendum', 'Execution']);

export const allowanceKey = (token, address) => `${token}:${address.toLowerCase()}`;

/**
 * Derives the dashboard state from on-chain values. All amounts are BigInt wei.
 *
 * @param {object} args
 * @param {Record<string, bigint>} args.balances fund balance per token
 * @param {Record<string, bigint>} args.allowances live allowance per `${token}:${spender}`
 * @param {Array} args.ledger generated ledger entries (src/data/ledger.js)
 * @param {Array} args.proposals generated pending proposals (src/data/proposals.js)
 * @param {Array} args.drafts manual drafts ({ title, amount: decimal string, token })
 */
export function buildFundState({ balances, allowances, ledger, proposals = [], drafts = [] }) {
  const rows = ledger.map((entry) => {
    const approved = BigInt(entry.approved);
    const remaining = entry.kind === 'allowance' ? allowances[allowanceKey(entry.token, entry.address)] ?? 0n : 0n;
    const status = remaining > 0n ? 'open' : entry.kind === 'transfer' ? 'transferred' : 'fully claimed';
    return { ...entry, approved, remaining, claimed: approved - remaining, status };
  });

  const pending = [
    ...proposals
      .filter((p) => LIVE_STAGES.has(p.stage))
      .flatMap((p) => p.requests.map((r) => ({ title: `CGP-${p.cgp}`, token: r.token, amount: BigInt(r.amount), url: p.url }))),
    ...drafts.map((d) => ({ title: d.title, token: d.token ?? 'CELO', amount: parseUnits18(d.amount), url: d.proposal })),
  ];

  const sum = (list, field) => list.reduce((total, item) => total + item[field], 0n);
  const tokens = Object.fromEntries(
    TOKENS.map((token) => {
      const tokenRows = rows.filter((r) => r.token === token);
      const balance = balances[token] ?? 0n;
      const open = sum(tokenRows, 'remaining');
      const reserved = sum(pending.filter((p) => p.token === token), 'amount');
      return [token, {
        balance,
        open,
        reserved,
        approved: sum(tokenRows, 'approved'),
        claimed: sum(tokenRows, 'claimed'),
        available: balance - open - reserved,
      }];
    })
  );

  const celo = tokens.CELO;
  const node = (name, color, wei) => ({ name, color, loc: toNumber(wei > 0n ? wei : 0n), exact: formatWei(wei) });
  const celoRows = rows.filter((r) => r.token === 'CELO');
  const balanceSlice = {
    name: 'Contract Balance',
    color: contract_celo_available_color,
    children: [
      node('Community Fund', contract_celo_available_color, celo.available),
      ...celoRows.filter((r) => r.remaining > 0n).map((r) => node(r.title, initiative_available_celo_color, r.remaining)),
      ...(celo.reserved > 0n ? [node('Pending proposals', pending_drafts_celo_color, celo.reserved)] : []),
    ],
  };
  const utilizedSlice = {
    name: 'Contract Utilized',
    color: contract_celo_spent_color,
    children: celoRows.filter((r) => r.claimed > 0n).map((r) => node(`${r.title} claimed`, initiative_spent_celo_color, r.claimed)),
  };

  return {
    rows,
    pending,
    tokens,
    explorer: COMMUNITY_FUND_EXPLORER,
    charts: {
      Lifetime: { name: 'Celo Community Fund', children: [balanceSlice, utilizedSlice] },
      Current: { name: 'Celo Community Fund', children: [balanceSlice] },
    },
  };
}
