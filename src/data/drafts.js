// Draft initiatives: proposals expected to go to governance.
// Their amounts are reserved from the funds available.
//
// To add one:
//   1. Set `amount` to the CELO amount being requested
//   2. Link the proposal (CGP or forum post), if available
//   3. Add the spender address once it is known
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative

export const drafts = [
  {
    title: "India DAO Chitty",
    amount: 270000,
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0064.md",
  },
  {
    title: "India DAO Monish",
    amount: 80000,
  },
  {
    title: "ImmuneFi Bug Bounty",
    amount: 1500000, // ~1M USD at the 90 day trailing CELO price
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0073.md",
  },
  {
    title: "Centrifuge Deployment",
    amount: 400000,
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0095.md",
  },
];
