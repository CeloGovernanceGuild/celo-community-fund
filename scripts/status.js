// Prints the live Community Fund ledger: `npm run status`. Amounts are exact.
import { drafts, ledger, proposals, proposers } from "../src/data/index.js";
import { fetchFundBalances } from "../src/lib/celo.js";
import { TOKENS, buildFundState } from "../src/lib/fund.js";
import { formatWei } from "../src/lib/format.js";

const { balances, allowances, deposits } = await fetchFundBalances(ledger, proposers);
const state = buildFundState({ balances, allowances, ledger, proposals, drafts, deposits });

for (const token of TOKENS) {
  const t = state.tokens[token];
  console.log(`------- ${token} -------`);
  console.log(`Balance:          ${formatWei(t.balance)}`);
  console.log(`Open allowances:  ${formatWei(t.open)}`);
  console.log(`Pending:          ${formatWei(t.reserved)}`);
  console.log(`Proposal deposits: ${formatWei(t.deposits)}`);
  console.log(`Available:        ${formatWei(t.available)}`);
  console.log(`Approved total:   ${formatWei(t.approved)}`);
  console.log(`Paid out:         ${formatWei(t.claimed)}`);
}

console.log("------- Open allowances -------");
for (const r of state.rows.filter((r) => r.status === "open")) {
  console.log(`${r.title} [${r.token}] approved ${formatWei(r.approved)}, claimed ${formatWei(r.claimed)}, remaining ${formatWei(r.remaining)}`);
}
console.log("------- Pending -------");
for (const p of state.pending) console.log(`${p.title}: ${formatWei(p.amount)} ${p.token}`);
console.log("Inflow rates vary: see the audit's separate epoch-payment and sequencer-distribution records.");
