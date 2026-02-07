// Incoming Celo Governance Proposals (CGPs)
// Source: https://github.com/celo-org/governance/tree/main/CGPs
// Mondo: https://mondo.celo.org/

export const incomingProposals = [
  {
    id: 'cgp-0225',
    title: 'Sustaining and Expanding MiniPay as Celo\'s Global Stablecoin Distribution Layer',
    status: 'DRAFT',
    proposer: 'Opera MiniPay (@opera_minipay)',
    dateSubmitted: '2026-02-05',
    fundingRequested: {
      amount: 950212,
      token: 'CELO',
      usdEquivalent: null,
      note: '⚠️ JSON amount (950,211 CELO) doesn\'t match markdown (212 CELO)'
    },
    summary: 'Funding request for MiniPay to continue as Celo\'s primary stablecoin distribution layer. Supports user acquisition, retention programs, and operational costs for H1 2026. Targets expanding user base and transaction volume across key markets.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0225.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0224',
    title: 'Celo Foundation Season 2 Funding Proposal',
    status: 'DRAFT',
    proposer: 'Celo Foundation',
    dateSubmitted: '2026-01-30',
    fundingRequested: {
      amount: 8880995,
      token: 'CELO',
      usdEquivalent: null
    },
    summary: 'Ecosystem treasury support for Celo Foundation initiatives in H1 2026, targeting builder and ecosystem growth, strategic partnerships, marketing and communications, ecosystem events, and regional support. Focus on expanding MiniPay ecosystem and increasing onchain transactions and TVL.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0224.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0223',
    title: 'Celo Governance Guild Season 2 Funding Request',
    status: 'PROPOSED',
    proposer: 'Celo Governance (@celogovernance)',
    dateSubmitted: '2026-02-01',
    fundingRequested: {
      amount: 532000,
      token: 'CELO',
      usdEquivalent: null
    },
    summary: 'Continuation funding for the Celo Governance Guild, a neutral operations body supporting governance infrastructure. Covers compensation for one lead coordinator and two guardians across 2026, plus initial legal entity setup costs.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0223.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0222',
    title: 'Stabila Season 2 Funding Request',
    status: 'PROPOSED',
    proposer: 'Michael (@MichaelCelo)',
    dateSubmitted: '2026-01-30',
    fundingRequested: {
      amount: 5622470,
      token: 'CELO',
      usdEquivalent: null
    },
    summary: 'Funding for focused DeFi liquidity and infrastructure initiatives (Jan-Jun 2026). Targets 50% TVL growth by June 30, 2026 through incentives for DEXs, Aave, Morpho, FX perpetuals trading, and emerging DeFi partnerships. Budget: $880k for protocol incentives, $70k for marketing/operations.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0222.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0221',
    title: 'Proxy Vote for MGP-13',
    status: 'DRAFT',
    proposer: '@mentoLabs',
    dateSubmitted: '2026-01-29',
    fundingRequested: {
      amount: 0,
      token: null,
      usdEquivalent: 0,
      note: 'Non Funding Proposal'
    },
    summary: 'Enables Celo community to vote on Mento Governance Proposal 13. Increases circuit breaker threshold from 10bps to 15bps and introduces 5bps spread fee for three USDm trading pairs. Aims to reduce operational downtime from price volatility while generating protocol revenue.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0221.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0220',
    title: 'cLabs Core Protocol Execution – Season 2 (H1 2026)',
    status: 'PROPOSED',
    proposer: 'cLabs Team',
    dateSubmitted: '2026-01-15',
    fundingRequested: {
      amount: 4355627,
      token: 'CELO',
      usdEquivalent: null,
      additionalTokens: '2 transactions: 1 for approval, 1 for transfer of 4,355,627 CELO'
    },
    summary: 'Supports cLabs protocol development for H1 2026. Delivers Jovian hardfork upgrade, Espresso integration for faster finality, Fusaka enablement, and security/scalability improvements. Budget covers ~12 engineering contributors plus infrastructure and community coordination.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0220.md',
    mondoUrl: null
  },
  {
    id: 'cgp-0219',
    title: 'Celo Communities Guild Season 2 Funding Request',
    status: 'PROPOSED',
    proposer: 'Goldo, 0xj4an-work, Anthony, Skdt',
    dateSubmitted: '2026-01-22',
    fundingRequested: {
      amount: 355022,
      token: 'CELO',
      usdEquivalent: null
    },
    summary: 'Continued funding for Celo Communities Guild to manage moderation, community engagement, and ecosystem coordination across Discord, Telegram, Reddit, and X for H1 2026. Covers four full-time moderators compensation, operational tools, and community incentive programs.',
    githubUrl: 'https://github.com/celo-org/governance/blob/main/CGPs/cgp-0219.md',
    mondoUrl: null
  }
];

// Helper function to format date
export const formatProposalDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to get status color
export const getStatusColor = (status) => {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return '#FFB74D'; // Orange
    case 'PROPOSED':
      return '#64B5F6'; // Blue
    case 'VOTING':
      return '#9575CD'; // Purple
    case 'APPROVED':
      return '#56DF7C'; // Green
    case 'REJECTED':
      return '#E57373'; // Red
    case 'EXECUTED':
      return '#FCFF52'; // Yellow
    default:
      return '#ccc'; // Gray
  }
};
