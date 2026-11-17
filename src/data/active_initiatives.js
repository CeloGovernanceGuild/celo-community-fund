// Active initiatives: spenders that still hold a CELO allowance from the Community Fund.
//
// Generated from the governance audit at Celo block 83009701 (see docs/audit.md).
// `approved` is the total CELO allowance (or transfer) authorized by governance for
// this spender: the sum of allowance increases across its proposals, read on-chain
// as allowance after minus allowance before each execution.
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative

export const activeInitiatives = [
  {
    title: "CCF1",
    address: "0x2f90Bb1CAF4079192481B1A7F3088220d291456D",
    approved: 665387,
    cgps: [17],
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0017.md",
  },
  {
    title: "Community Appreciation Gifts",
    address: "0x5374cF78F82E3610f9678bD7AF617785FF6c578a",
    approved: 15000,
    cgps: [20],
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0020.md",
  },
  {
    title: "Africa DAO",
    address: "0xc59533fd060e38230100F3577eF5ad9467ae2594",
    approved: 550000,
    cgps: [68],
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0068.md",
  },
  {
    title: "CeloPG H2 2024 (second spender)",
    address: "0xdd817A3d583bB0B97579C5959B4c929504F688D7",
    approved: 1250000,
    cgps: [141],
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0141.md",
  },
  {
    title: "CICLOPS",
    address: "0xd71efa410B6EaAB0bAc3b515B393C886BE70F09E",
    approved: 69426799,
    cgps: [158, 202, 231, 237, 248],
    proposal: "https://github.com/celo-org/governance/blob/main/CGPs/cgp-0248.md",
  },
];
