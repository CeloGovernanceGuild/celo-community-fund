// Addresses
export const CELO_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438";
export const TOKEN_ADDRESSES = {
  CELO: CELO_TOKEN,
  USDm: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  EURm: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
};
export const GOVERNANCE_ADDRESS = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972";
// Historical Celo Governance Reserve. It is distinct from the Community Fund and never enters its Available calculation.
export const RESERVE_ADDRESS = "0x9d65E69aC940dCB469fd7C46368C1e094250a400";

// How money reaches the fund and who signs off on proposals (see the About page and docs/audit.md)
export const OPERATIONS_SAFE = "0x7A1E98FC9a008107DbD1f430a05Ace8cf6f3FE19";
export const FEE_HANDLER = "0xcD437749E43A154C07F3553504c68fBfD56B8778";
export const SEQUENCER_FEE_VAULT = "0x4200000000000000000000000000000000000011";
export const UNRELEASED_TREASURY = "0x7A8c7a833565fc428cdFBa20FE03fAfb178A434f";
export const GOVERNANCE_APPROVER = "0x41822d8A191fcfB1cfcA5F7048818aCd8eE933d3";
export const REVENUE_REPORTS_URL = "https://forum.celo.org/t/initiating-ongoing-celo-chain-revenue-transactions/13494";
export const SECURITY_COUNCIL = "0x51a3a77baF58fef0309452CeaCB09221e556f223";

// Public references for the governance process (see the How it works page)
export const LINKS = {
  forum: "https://forum.celo.org/c/governance/",
  governanceRepo: "https://github.com/celo-org/governance",
  callIssues: "https://github.com/celo-org/governance/issues",
  createProposal: "https://docs.celo.org/learn/protocol/governance/create-governance-proposal",
  governanceDocs: "https://docs.celo.org/learn/protocol/governance/overview",
  calls: "https://luma.com/CeloGovernance",
  mondo: "https://mondo.celo.org/governance",
  celocli: "https://docs.celo.org/build/tools/libraries-sdks/cli",
};

// Chainlink price feeds on Celo (8 decimals)
export const CELO_USD_FEED = "0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e";
export const EUR_USD_FEED = "0x3D207061Dbe8E2473527611BFecB87Ff12b28dDa";

// Explorer links
export const EXPLORER = "https://celoscan.io";
export const COMMUNITY_FUND_EXPLORER = `${EXPLORER}/address/${GOVERNANCE_ADDRESS}`;
export const addressUrl = (address) => `${EXPLORER}/address/${address}`;
export const txUrl = (hash) => `${EXPLORER}/tx/${hash}`;
// Token page filtered to one holder: its balance and every transfer of that token in or out of it.
export const tokenHolderUrl = (token, holder) => `${EXPLORER}/token/${TOKEN_ADDRESSES[token]}?a=${holder}`;
