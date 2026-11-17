// Addresses
export const CELO_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438";
export const GOVERNANCE_ADDRESS = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972";

// Explorer links
export const COMMUNITY_FUND_EXPLORER = `https://celoscan.io/address/${GOVERNANCE_ADDRESS}`;

// Regular CELO inflow to the fund (CELO per day). After the L2 migration the fund
// receives about 30 CELO/day from CeloUnreleasedTreasury; large grants are topped
// up from the Reserve or the treasury in the same proposal that approves them.
// Measured over 2026-02..2026-11, see docs/audit.md (finding 8).
export const REPL_RATE = 30;

// Colors
export const contract_celo_color = "#FCFF52";
export const contract_celo_spent_color = "#FF9A51";
export const contract_celo_available_color = "#56DF7C";
export const pending_drafts_celo_color = "#9B9B9B";
export const initiative_spent_celo_color = "#B490FF";
export const initiative_available_celo_color = "#7CC0FF";
