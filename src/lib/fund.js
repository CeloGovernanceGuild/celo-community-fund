import { COMMUNITY_FUND_EXPLORER } from '../data/data.js';
import { parseUnits18 } from './format.js';

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

  // How the fund's CELO balance is split. `available` is clamped at zero for the bar only.
  const celo = tokens.CELO;
  const composition = [
    { key: 'available', label: 'Available', wei: celo.available > 0n ? celo.available : 0n },
    { key: 'committed', label: 'Open allowances', wei: celo.open },
    { key: 'pending', label: 'Pending proposals', wei: celo.reserved },
  ];

  return { rows, groups: groupByRecipient(rows), pending, tokens, composition, explorer: COMMUNITY_FUND_EXPLORER };
}

/**
 * One entry per recipient: a spender that was granted several tokens (for example CELO and USDm
 * in the same proposal) is a single line with one position per token. Direct transfers have no
 * spender address and are grouped by title.
 */
export function groupByRecipient(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.address ? row.address.toLowerCase() : `transfer:${row.title}`;
    if (!groups.has(key)) {
      groups.set(key, { key, title: row.title, kind: row.kind, address: row.address, positions: [] });
    }
    groups.get(key).positions.push(row);
  }
  return [...groups.values()].map((group) => {
    const positions = group.positions.sort((a, b) => TOKENS.indexOf(a.token) - TOKENS.indexOf(b.token));
    const grants = positions
      .flatMap((p) => p.grants.map((g) => ({ ...g, token: p.token })))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : TOKENS.indexOf(a.token) - TOKENS.indexOf(b.token)));
    const status = positions.some((p) => p.remaining > 0n)
      ? 'open'
      : group.kind === 'transfer' ? 'transferred' : 'fully claimed';
    return {
      ...group,
      positions,
      grants,
      status,
      tokens: positions.map((p) => p.token),
      cgps: [...new Set(positions.flatMap((p) => p.cgps))].sort((a, b) => a - b),
      lastGrant: grants.at(-1)?.date ?? '',
    };
  });
}
