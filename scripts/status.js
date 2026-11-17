// Prints the live Community Fund ledger: `npm run status`. Amounts are exact.
import { REPL_RATE } from "../src/data/data.js";
import { drafts, ledger, proposals } from "../src/data/index.js";
import { fetchFundBalances } from "../src/lib/celo.js";
import { TOKENS, buildFundState } from "../src/lib/fund.js";
import { formatWei } from "../src/lib/format.js";

const { balances, allowances } = await fetchFundBalances(ledger);
const state = buildFundState({ balances, allowances, ledger, proposals, drafts });

for (const token of TOKENS) {
  const t = state.tokens[token];
  console.log(`------- ${token} -------`);
  console.log(`Balance:          ${formatWei(t.balance)}`);
  console.log(`Open allowances:  ${formatWei(t.open)}`);
  console.log(`Pending:          ${formatWei(t.reserved)}`);
  console.log(`Available:        ${formatWei(t.available)}`);
  console.log(`Approved total:   ${formatWei(t.approved)}`);
  console.log(`Claimed total:    ${formatWei(t.claimed)}`);
}

console.log("------- Open allowances -------");
for (const r of state.rows.filter((r) => r.status === "open")) {
  console.log(`${r.title} [${r.token}] approved ${formatWei(r.approved)}, claimed ${formatWei(r.claimed)}, remaining ${formatWei(r.remaining)}`);
}
console.log("------- Pending -------");
for (const p of state.pending) console.log(`${p.title}: ${formatWei(p.amount)} ${p.token}`);
console.log(`Regular inflow: ~${REPL_RATE} CELO per day`);
