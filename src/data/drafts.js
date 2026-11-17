// Draft initiatives: funding proposals expected to go to governance that are
// not executed yet. Their amounts are reserved from the funds available.
//
// As of the governance audit (see docs/audit.md) there are no pending funding
// proposals: every live proposal on-chain changes parameters only.
//
// To add one:
//   1. Set `amount` to the CELO amount being requested
//   2. Link the proposal (CGP or forum post)
//   3. Add the spender address once it is known
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative

export const drafts = [];
