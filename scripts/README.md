# Proposal Update Scripts

This directory contains scripts for automatically updating incoming Celo Governance Proposals (CGPs) data.

## Overview

The `update-proposals.js` script fetches the latest CGPs from the [Celo Governance GitHub repository](https://github.com/celo-org/governance), parses them, and extracts the CELO amounts being requested from the Community Fund contract (`0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972`).

## Manual Usage

To manually update the proposals data:

```bash
npm run update-proposals
```

This will:
1. Fetch the latest 10 CGPs from GitHub
2. Parse each CGP's metadata (title, status, proposer, date, etc.)
3. Extract CELO transaction amounts from the JSON transaction blocks
4. Filter for active proposals (DRAFT, PROPOSED, or VOTING status)
5. Update `src/data/incoming_proposals.js` with the latest data

## Automated Updates

The script runs automatically every 24 hours via GitHub Actions (see `.github/workflows/update-proposals.yml`).

### GitHub Actions Workflow

- **Schedule**: Daily at 00:00 UTC
- **Manual Trigger**: Can be triggered manually from the Actions tab
- **Auto-commit**: If changes are detected, they are automatically committed and pushed

## How It Works

### 1. Fetching CGPs

The script uses the GitHub API to list all CGP files in the governance repository, then fetches the most recent ones.

### 2. Parsing Metadata

Each CGP markdown file is parsed to extract:
- Title
- Status (DRAFT, PROPOSED, VOTING, etc.)
- Proposer/Author
- Date submitted
- Summary

### 3. Extracting Transaction Amounts

The script looks for JSON transaction blocks in the CGP markdown. It specifically:
- Finds transactions involving the GoldToken (CELO) contract
- Identifies `approve`, `transfer`, or `increaseAllowance` functions
- Extracts the CELO amount from transaction arguments
- Converts from wei to CELO (dividing by 10^18)

**Important**: The script only counts actual fund transfers from the Community Fund contract, not approval transactions (which are separate governance operations).

### 4. Filtering Active Proposals

Only proposals with status DRAFT, PROPOSED, or VOTING are included. Approved, rejected, or executed proposals are excluded.

## Transaction Amount Logic

For each CGP, the script:
1. Parses the JSON transaction block
2. Identifies transactions involving the Community Fund contract
3. Extracts the CELO amount being requested
4. Handles cases where there are multiple transactions (e.g., approval + transfer)

**Example**: CGP-0220 (cLabs) has 2 transactions, but only 1 is a transfer of CELO. The script correctly identifies this and uses the transfer amount (4,355,627 CELO).

## Rate Limiting

The script includes a 500ms delay between requests to avoid hitting GitHub's rate limits.

## Error Handling

- Network errors are logged but don't crash the script
- Invalid JSON is caught and logged
- Missing or malformed CGPs are skipped

## Troubleshooting

If the script fails:

1. Check GitHub API rate limits:
   ```bash
   curl https://api.github.com/rate_limit
   ```

2. Verify the CGP format hasn't changed:
   - Visit https://github.com/celo-org/governance/tree/main/CGPs
   - Check a recent CGP's structure

3. Check the script output for specific errors:
   ```bash
   npm run update-proposals
   ```

## Future Improvements

Possible enhancements:
- Add support for Mondo API to get real-time proposal status
- Parse USD equivalent amounts from proposals
- Support for non-CELO token requests (e.g., USDm, EURm)
- Email notifications when new proposals are detected
- Integration with Celo blockchain to verify actual on-chain proposal status
