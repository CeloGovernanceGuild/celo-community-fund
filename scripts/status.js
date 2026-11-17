// Prints the current Community Fund status: `npm run status`
import { REPL_RATE } from "../src/data/data.js";
import { drafts, initiatives } from "../src/data/index.js";
import { fetchFundBalances } from "../src/lib/celo.js";
import { buildFundState } from "../src/lib/fund.js";

const fmt = (n) => n.toLocaleString("en-US");

const { balance, allowances } = await fetchFundBalances(initiatives);
const state = buildFundState({ balance, allowances, initiatives, drafts });

console.log("-------Community Fund-------");
console.log(`Contract Balance: ${fmt(state.balance)}`);
for (const fund of state.funds) console.log(`${fund.title}: ${fmt(fund.available)}`);
console.log("-------Drafts-------");
for (const draft of drafts) console.log(`${draft.title}: ${fmt(draft.amount)}`);
console.log("--------------------");
console.log(`Estimated Replenish Rate: ~${fmt(REPL_RATE)} per day`);
console.log(`Funds Available (after allowances and drafts): ${fmt(state.fundsAvailable)}`);
