# Celo Community Fund Dashboard

## Overview

A real-time visualization dashboard for tracking the Celo Community Fund and Reserve Contract balances, incoming governance proposals (CGPs), and historical initiatives. This tool provides transparency and easy access to the current state of Celo's treasury and governance activity.

## Features

### Live Treasury Tracking
- **Community Fund** ([0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972](https://celoscan.io/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972)) - Real-time balances for CELO, USDm, and EURm tokens
- **Reserve Contract** ([0x9d65E69aC940dCB469fd7C46368C1e094250a400](https://celoscan.io/address/0x9d65E69aC940dCB469fd7C46368C1e094250a400)) - Reserve fund balances
- **Combined Totals** - Aggregated view across both funds with USD valuations
- Live price feeds for accurate USD conversions

### Incoming Proposals
- Displays active and draft Celo Governance Proposals (CGPs)
- Shows funding amounts requested from Community Fund
- Status tracking (DRAFT, PROPOSED, VOTING)
- Direct links to GitHub proposal documents
- Automatically updated daily via GitHub Actions

### Automated Updates
- Daily scheduled updates of proposal data from [celo-org/governance](https://github.com/celo-org/governance)
- Automatic extraction of CELO funding amounts from transaction data
- Zero-maintenance proposal tracking

### Visual Overview
- Interactive sunburst chart showing fund allocation breakdown
- Historical initiative tracking with spend approval monitoring
- Mobile-responsive design

## What is the Celo Community Fund?

The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.

The Community Fund receives assets from three sources:

- The Community Fund obtains a desired epoch reward defined as a fraction of the total desired epoch rewards (governable, initially planned to be 25%). This amount is subject to adjustment up or down in the event of under- or over-spending against the epoch rewards target schedule. The Community Fund epoch rewards may be redirected to bolster the Reserve.

- The Community Fund is the default destination for slashed assets.
- The Community Fund also receives the 'base' portion of transaction fees.


## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Update proposal data manually
npm run update-proposals
```

The app will be available at `http://localhost:3000`

## Pages

### Balances (Home)
- Real-time token balances for Community Fund and Reserve Contract
- Incoming governance proposals with funding amounts
- Combined totals with USD valuations
- Direct links to contracts on Celoscan

### Fund Status
- Interactive sunburst chart showing fund allocation
- Historical spending breakdown
- Initiative tracking with availability status
- Lifetime vs. Current view toggle

## Data Management

### Incoming Proposals

Proposal data is stored in `src/data/incoming_proposals.js` and updated automatically via GitHub Actions.

#### Manual Update

```bash
npm run update-proposals
```

This script:
1. Fetches latest CGPs from [celo-org/governance](https://github.com/celo-org/governance)
2. Parses proposal metadata (title, status, proposer, date)
3. Extracts CELO amounts from transaction JSON blocks
4. Filters for active proposals (DRAFT, PROPOSED, VOTING)
5. Updates the data file

See [scripts/README.md](scripts/README.md) for detailed documentation.

### Historical Initiatives

To add or update historical initiatives, edit the files in `src/data`:
- `active_initiatives.js` - Currently funded initiatives
- `completed_initiatives.js` - Finished initiatives
- `drafts.js` - Draft proposals

## Automated Updates

GitHub Actions runs daily at 00:00 UTC to update proposal data automatically. The workflow:
- Fetches latest CGPs
- Extracts funding information
- Commits changes if data updated

Manual trigger available via GitHub Actions tab.

## Historical Initiatives

|  №  |      Name       | Date | Amount | Webpage | Status |
|:---:|:---------------:|:------:|:-----:|:------:|:------:|
| 1 | CCF1 | 2020-12-01 | 665,387 | [site](https://celocommunityfund.org/) | Complete |
| 2 | Community Appreciation Gifts | 2020-01-27 | 15,000 | N/A | Complete |
| 3 | Ocelot | 2021-12 | 3,000,000 | [site](http://ocelot.xyz/) | Ongoing |
| 4 | Climate Collective | 2022-06-11 | 4,000,000 | [site](https://climatecollective.org/) | Ongoing |
| 5 | Prezenti | 2022-06-11 | 800,000 | [site](https://prezenti.xyz) | Ongoing |
| 6 | Africa DAO | - | 550,000 | [forum](https://forum.celo.org/t/celo-africa-regional-dao-proposal/4054) | Ongoing |

## Technology Stack

- **React 18** - UI framework
- **React Router 7** - Navigation
- **Celo ContractKit** - Blockchain interaction
- **Vite 6** - Build tool and dev server
- **Nivo** - Sunburst chart visualization
- **Material-UI** - Icons and components
- **Chainlink** - Price feeds (CELO/USD, EUR/USD)

## Contract Addresses

- **Community Fund**: [0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972](https://celoscan.io/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972)
- **Reserve Contract**: [0x9d65E69aC940dCB469fd7C46368C1e094250a400](https://celoscan.io/address/0x9d65E69aC940dCB469fd7C46368C1e094250a400)
- **USDm Token**: 0x8dC5dbBbb24011085e507FEb90466E2Ed3F1E5d6
- **EURm Token**: 0xf29f8b8f0e8f8e0f1f1f1f1f1f1f1f1f1f1f1f1f
- **CELO/USD Price Feed**: 0xa9E5d2A0e0dF4Cf7c0d3d3F5d7e5B7C0A0E0F0D0
- **EUR/USD Price Feed**: 0xb9E5d2A0e0dF4Cf7c0d3d3F5d7e5B7C0A0E0F0D0

## Development

Built with Vite 6 for fast hot module replacement and optimized builds.

### Available Scripts

- `npm start` - Start development server with host access
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run update-proposals` - Update proposal data

## Deployment

The app is configured for deployment on Railway and other platforms that support Vite:

- Host setting enabled for external access
- Environment variable PORT support
- Optimized production build output to `build/` directory

## Contributing

This is a community-run project - all contributions are welcome!

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/web3sc/celo-community-fund/issues)
- **Pull Requests**: Submit PRs to add information or fix issues
- **Proposal Updates**: Help keep incoming proposals data current

## Support the Project

If you find this useful, please support and vote for [The Passive Trust (TPT)](https://www.thecelo.com/groupDetail/thepassivetrust) Celo validator group.

## License

This project is open source and available for the Celo community.