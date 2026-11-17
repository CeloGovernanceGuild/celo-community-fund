// Addresses
export const CELO_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438";
export const TOKEN_ADDRESSES = {
  CELO: CELO_TOKEN,
  USDm: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  EURm: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
};
export const GOVERNANCE_ADDRESS = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972";
export const RESERVE_ADDRESS = "0x9d65E69aC940dCB469fd7C46368C1e094250a400";

// Chainlink price feeds on Celo (8 decimals)
export const CELO_USD_FEED = "0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e";
export const EUR_USD_FEED = "0x3D207061Dbe8E2473527611BFecB87Ff12b28dDa";

// Explorer links
export const EXPLORER = "https://celoscan.io";
export const COMMUNITY_FUND_EXPLORER = `${EXPLORER}/address/${GOVERNANCE_ADDRESS}`;

// Regular CELO inflow to the fund (CELO per day). After the L2 migration the fund
// receives about 30 CELO/day from CeloUnreleasedTreasury; large grants are topped
// up from the Reserve or the treasury in the same proposal that approves them.
// Measured over 2026-02..2026-11, see docs/audit.md (finding 8).
export const REPL_RATE = 30;
