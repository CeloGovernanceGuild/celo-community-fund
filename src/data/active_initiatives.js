// Active initiatives: spend approvals granted by governance that may still hold an allowance.
//
// To add one:
//   1. Take the spender address from the proposal's mainnet.json
//   2. Set `approved` to the CELO amount approved by governance
//   3. Link the governance proposal
//
// Initiative flow: Draft -> Active Initiative -> Completed Initiative

export const activeInitiatives = [
  {
    title: "Ocelot",
    address: "0x0D8b5f1CD567656b6Ad4c88e8F082F1f694e5Bb5",
    approved: 3000000,
    proposal: "https://celo.stake.id/#/proposal/43",
  },
  {
    title: "Climate Collective",
    address: "0x275D5828bF7e5aaf51Bf8EF2f0668ac4a98F0d23",
    approved: 4000000,
    proposal: "https://celo.stake.id/#/proposal/60",
  },
  {
    title: "Community Appreciation Gifts",
    address: "0x5374cF78F82E3610f9678bD7AF617785FF6c578a",
    approved: 15000,
    proposal: "https://celo.stake.id/#/proposal/25",
  },
  {
    title: "CCF1",
    address: "0x2f90Bb1CAF4079192481B1A7F3088220d291456D",
    approved: 665387,
    proposal: "https://celo.stake.id/#/proposal/18",
  },
  {
    title: "Africa DAO",
    address: "0xc59533fd060e38230100F3577eF5ad9467ae2594",
    approved: 550000,
    proposal: "https://celo.stake.id/#/proposal/85",
  },
  {
    // First round (800,000, proposal 61) plus second round (1,600,000, proposal 89), same spender.
    title: "Prezenti",
    address: "0xda2069f47D252121c2288301D6EF50B87220A693",
    approved: 2400000,
    proposal: "https://celo.stake.id/#/proposal/89",
  },
  {
    title: "Chainlink",
    address: "0x46421b8EF42b67Ae4E24BE599bD78144e5e12088",
    approved: 5980313,
    proposal: "https://celo.stake.id/#/proposal/88",
  },
  {
    title: "Latam DAO",
    address: "0x38DBAB5C651F352C8f5F765fDA292E9B92d850Ff",
    approved: 903000, // ~605K USD at the 90 day average CELO price
    proposal: "https://celo.stake.id/#/proposal/96",
  },
  {
    title: "Celo Tribe",
    address: "0x81bC5B8F34CF959105c793F776971FA8A7BB2a25",
    approved: 70000,
    proposal: "https://celo.stake.id/#/proposal/101",
  },
  {
    title: "Asia DAO",
    address: "0xF737369f79291d8e4aB273bBE5A4669381Cb4715",
    approved: 333030,
    proposal: "https://celo.stake.id/#/proposal/120",
  },
  {
    title: "Europe DAO",
    address: "0x4763a32d5256EDA615fd5c07b0e333C7Baa4D628",
    approved: 440000,
    proposal: "https://celo.stake.id/#/proposal/115",
  },
  {
    title: "Mobile First Community",
    address: "0xA7AF94d898fc31A43D163201cE44b4Fa944a79EE",
    approved: 120000,
    proposal: "https://celo.stake.id/#/proposal/123",
  },
];
