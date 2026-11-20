// Who each ledger recipient belongs to. Edited by hand, like drafts.js: the audit names a recipient
// address, this file says which organisation it is and how that organisation is grouped. A new
// recipient in the ledger needs a line in RECIPIENTS (the tests fail until it has one).
//
// Camps are deliberately coarse:
// - companies: cLabs, the Celo Foundation, Celo Core Co. and programs run by or spun out of them.
// - community: grant stewards, guilds, regional and community DAOs, governance operations.
// - partners: companies paid for distribution, liquidity, acceleration or a service.
// - operations: money the protocol spends on itself (airdrop, oracle and approver gas, liquidity it owns).
// See docs/history.md for the reasoning behind each assignment.

export const CAMPS = [
  { key: 'companies', label: 'Celo companies & affiliates', note: 'cLabs, the Celo Foundation, Celo Core Co. and programs spun out of them' },
  { key: 'community', label: 'Community initiatives', note: 'Grant stewards, guilds, regional DAOs and governance operations' },
  { key: 'partners', label: 'External partners & vendors', note: 'Companies paid for distribution, liquidity, acceleration or a service' },
  { key: 'operations', label: 'Protocol & treasury operations', note: 'Airdrop, oracle and approver gas, and liquidity the fund owns' },
];

export const ORGANISATIONS = {
  'cLabs': { camp: 'companies', family: 'Core contributors' },
  'Celo Foundation': { camp: 'companies', family: 'Core contributors' },
  'Celo Core Co.': { camp: 'companies', family: 'Core contributors', note: 'cLabs and the Celo Foundation merged into Celo Core Co. in 2026' },
  'CICLOPS': { camp: 'companies', family: 'Spun-out programs', note: 'Infrastructure stewardship led from the Celo Foundation (CGP-158)' },
  'Stabila': { camp: 'companies', family: 'Spun-out programs', note: 'Stabila Foundation, a new entity created in CGP-132 for stablecoin and DeFi liquidity, run by Celo Foundation staff' },
  'Mento Reserve': { camp: 'companies', family: 'Spun-out programs', note: 'Liquidity Mento owns, sent to the Mento Reserve Safe (CGP-69)' },

  'Celo Community Fund stewards': { camp: 'community', family: 'Grant stewards', note: 'The first stewardship; Prezenti reopened the fund in 2022 (CGP-54)' },
  'Ocelot (Celo Ecosystem Treasury)': { camp: 'community', family: 'Grant stewards', note: 'A 5-of-9 multisig of ecosystem members (CGP-38)' },
  'Prezenti': { camp: 'community', family: 'Grant stewards' },
  'Climate Collective': { camp: 'community', family: 'Grant stewards' },
  'CeloPG': { camp: 'community', family: 'Grant stewards', note: 'Paid regional DAOs, Prezenti and governance work in 2024, then each left for its own budget' },
  'Community Appreciation Gifts': { camp: 'community', family: 'Grant stewards' },
  'Celo Governance Guild': { camp: 'community', family: 'Governance & network operations' },
  'Celo Communities Guild': { camp: 'community', family: 'Governance & network operations' },
  'Score Management Committee': { camp: 'community', family: 'Governance & network operations' },
  'Celo Africa DAO': { camp: 'community', family: 'Regional & community DAOs', note: 'Folded into the Celo Regional Council in 2025 (CGP-160)' },
  'CeLatam DAO': { camp: 'community', family: 'Regional & community DAOs', note: 'Folded into the Celo Regional Council in 2025 (CGP-160)' },
  'Celo Europe DAO': { camp: 'community', family: 'Regional & community DAOs', note: 'Folded into the Celo Regional Council in 2025 (CGP-160)' },
  'CeloColombia DAO': { camp: 'community', family: 'Regional & community DAOs', note: 'Folded into the Celo Regional Council in 2025 (CGP-160)' },
  'Celo Regional Council': { camp: 'community', family: 'Regional & community DAOs' },
  'Celo Korea': { camp: 'community', family: 'Regional & community DAOs' },
  'Celo Tribe': { camp: 'community', family: 'Regional & community DAOs' },
  'Mobile First Community': { camp: 'community', family: 'Regional & community DAOs' },

  'Opera (MiniPay)': { camp: 'partners', family: 'Distribution & liquidity', note: 'Built MiniPay with the Celo Foundation; a 160M CELO stake from the Unreleased Treasury replaced its grants in 2026 (CGP-232)' },
  'Credit Collective': { camp: 'partners', family: 'Distribution & liquidity' },
  'Chainlink SCALE': { camp: 'partners', family: 'Distribution & liquidity' },
  'Centrifuge': { camp: 'partners', family: 'Distribution & liquidity' },
  'Celo Camp (Upright)': { camp: 'partners', family: 'Accelerators' },
  'Outlier Ventures': { camp: 'partners', family: 'Accelerators' },
  'Red Beard Ventures': { camp: 'partners', family: 'Accelerators' },
  'Artemis': { camp: 'partners', family: 'Service providers' },
  'Oracle providers': { camp: 'partners', family: 'Service providers' },

  'Airdrop to USDm holders': { camp: 'operations', family: 'Protocol operations' },
  'Governance approvers': { camp: 'operations', family: 'Protocol operations' },
  'Fund-owned liquidity': { camp: 'operations', family: 'Liquidity' },
};

// Ledger recipient (lower-case address, or `transfer:<title>` for direct transfers) -> organisation.
export const RECIPIENTS = {
  '0x7bdee323f5227f214edfc3ae4bd4ebc032b59c82': 'Airdrop to USDm holders',
  '0x2f90bb1caf4079192481b1a7f3088220d291456d': 'Celo Community Fund stewards',
  'transfer:Oracle Funding': 'Oracle providers',
  '0x5374cf78f82e3610f9678bd7af617785ff6c578a': 'Community Appreciation Gifts',
  '0x0d8b5f1cd567656b6ad4c88e8f082f1f694e5bb5': 'Ocelot (Celo Ecosystem Treasury)',
  '0x275d5828bf7e5aaf51bf8ef2f0668ac4a98f0d23': 'Climate Collective',
  '0x9cf769bcce5e750534d88b251fb5b58da9776190': 'Climate Collective',
  '0xda2069f47d252121c2288301d6ef50b87220a693': 'Prezenti',
  '0xa5c9389a0ce1bfe24ff883e761ff313225c77d44': 'Prezenti',
  '0xfa3df877f98ac5ecd87456a7accaa948462412f0': 'Fund-owned liquidity',
  '0x87647780180b8f55980c7d3ffefe08a9b29e9ae1': 'Mento Reserve',
  '0xc59533fd060e38230100f3577ef5ad9467ae2594': 'Celo Africa DAO',
  '0x46421b8ef42b67ae4e24be599bd78144e5e12088': 'Chainlink SCALE',
  '0x38dbab5c651f352c8f5f765fda292e9b92d850ff': 'CeLatam DAO',
  '0x81bc5b8f34cf959105c793f776971fa8a7bb2a25': 'Celo Tribe',
  '0x4763a32d5256eda615fd5c07b0e333c7baa4d628': 'Celo Europe DAO',
  '0x5f411351e6566409f9b0b8d03873846e0c7201b3': 'Credit Collective',
  '0x9d7bc0ed7e53c9d8bddac8ce7dff77aba54022d5': 'Credit Collective',
  '0xf737369f79291d8e4ab273bbe5a4669381cb4715': 'Celo Korea',
  '0xa7af94d898fc31a43d163201ce44b4fa944a79ee': 'Mobile First Community',
  '0x34cbb11f19d9b6f1fc54d20b5e248db4a9b9afa2': 'Centrifuge',
  'transfer:Governance Approvers Gas': 'Governance approvers',
  'transfer:cLabs L2 Project': 'cLabs',
  'transfer:L2 Development Next Phase': 'cLabs',
  'transfer:cLabs Core Protocol Season 2': 'cLabs',
  '0x35ff861a0b6215cec71ea282b0d32afefa661795': 'cLabs',
  '0x6f62e32cae54d66e234f0d1e27be7e33896dc4ce': 'Opera (MiniPay)',
  '0x71f433514957d00287a9d33da759f1e0c1732381': 'CeloPG',
  '0x1b98202492bd78bb042523674eec19cd0ac50f96': 'CeloPG',
  '0xdd817a3d583bb0b97579c5959b4c929504f688d7': 'CeloPG',
  '0x85910be70d7ebf149918ed96ef8be175a0639c33': 'CeloPG',
  '0x9138ad934d63a81a3bd10e5e6a2511db13c1c1ca': 'Outlier Ventures',
  '0x083ab4a0c5d6cc899008bd5e8e1312379d629320': 'Red Beard Ventures',
  '0x91606ba0b9a5527bf384001b94ab908c9054c677': 'Celo Camp (Upright)',
  '0x9c257bdc314dc516e673728d70f45444f6e22412': 'Stabila',
  '0xd1a06a4477b9e4633e6e56d8f9eb9ccd39ce36bc': 'Artemis',
  '0x6c6dc3d4869d9812d80600b9f7f291e13ee73d49': 'CeloColombia DAO',
  '0xc733285e8e4db433d4cd641f99c46bf108dcb54f': 'Celo Governance Guild',
  '0xd71efa410b6eaab0bac3b515b393c886be70f09e': 'CICLOPS',
  '0x90860c778a8a69380376baab6ac7fec5daff4ab5': 'Celo Regional Council',
  '0x0b6a6666027d90fd56f4a2e1827296db4d590f4d': 'Celo Communities Guild',
  '0x68ce71d4ceca3003701ca6844d9a345925407455': 'Score Management Committee',
  '0x0f293b1548a55a7ba9541d4c27442e1591b068c9': 'Celo Foundation',
  '0xb0d0780eddc2fa35906c0b37b9b4dc7583c3dbb0': 'Celo Core Co.',
};
