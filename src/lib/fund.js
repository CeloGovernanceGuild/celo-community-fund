import {
  COMMUNITY_FUND_EXPLORER,
  contract_celo_available_color,
  contract_celo_spent_color,
  initiative_available_celo_color,
  initiative_spent_celo_color,
  pending_drafts_celo_color,
} from "../data/data.js";

/**
 * Derives the dashboard state from on-chain values.
 *
 * @param {object} args
 * @param {number} args.balance CELO held by the governance contract
 * @param {Record<string, number>} args.allowances remaining CELO allowance per initiative title
 * @param {Array} args.initiatives active + completed initiatives
 * @param {Array} args.drafts draft initiatives
 */
export function buildFundState({ balance, allowances, initiatives, drafts }) {
  const funds = initiatives.map((initiative) => {
    const available = allowances[initiative.title] ?? 0;
    return { ...initiative, available, spent: Math.max(0, initiative.approved - available) };
  });

  const initiativesAvailable = funds.reduce((sum, fund) => sum + fund.available, 0);
  const draftsTotal = drafts.reduce((sum, draft) => sum + draft.amount, 0);
  const fundsAvailable = balance - initiativesAvailable - draftsTotal;

  const balanceSlice = {
    name: "Contract Balance",
    color: contract_celo_available_color,
    children: [
      { name: "Community Fund", color: contract_celo_available_color, loc: Math.max(0, fundsAvailable) },
      ...funds.map((fund) => ({ name: fund.title, color: initiative_available_celo_color, loc: fund.available })),
      { name: "Drafts", color: pending_drafts_celo_color, loc: draftsTotal },
    ],
  };

  const utilizedSlice = {
    name: "Contract Utilized",
    color: contract_celo_spent_color,
    children: funds.map((fund) => ({
      name: `${fund.title} Spent`,
      color: initiative_spent_celo_color,
      loc: fund.spent,
    })),
  };

  const table = [
    { name: "Community Fund", approved: balance, available: fundsAvailable, proposal: COMMUNITY_FUND_EXPLORER },
    ...funds.map((fund) => ({
      name: fund.title,
      approved: fund.approved,
      available: fund.available,
      proposal: fund.proposal,
    })),
    ...drafts.map((draft) => ({
      name: draft.title,
      approved: draft.amount,
      available: 0,
      proposal: draft.proposal,
      draft: true,
    })),
  ];

  return {
    balance,
    fundsAvailable,
    initiativesAvailable,
    draftsTotal,
    funds,
    table,
    charts: {
      Lifetime: { name: "Celo Community Fund", children: [balanceSlice, utilizedSlice] },
      Current: { name: "Celo Community Fund", children: [balanceSlice] },
    },
  };
}
