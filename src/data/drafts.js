// Manual drafts: funding requests discussed on the forum that have no CGP yet.
// CGPs are picked up automatically from celo-org/governance (src/data/proposals.js),
// so only add here what is not in that repository. Amounts are reserved from the
// funds available.
//
// Shape: { title, token: "CELO" | "USDm" | "EURm", amount: "1234.5" (exact decimal string), proposal: "<forum url>" }
//
// Initiative flow: Draft -> CGP (proposals.js) -> executed grant (ledger.js)

export const drafts = [];
