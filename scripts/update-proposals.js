/**
 * Script to fetch and update incoming Celo Governance Proposals (CGPs)
 * Runs periodically to keep proposal data up-to-date
 *
 * Usage: node scripts/update-proposals.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const COMMUNITY_FUND_ADDRESS = '0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972';
const GITHUB_API_BASE = 'https://api.github.com/repos/celo-org/governance/contents/CGPs';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/celo-org/governance/main/CGPs';

// Status mapping based on CGP conventions
const STATUS_KEYWORDS = {
  'DRAFT': ['draft', 'wip', 'work in progress'],
  'PROPOSED': ['proposed', 'submitted'],
  'VOTING': ['voting', 'active'],
  'APPROVED': ['approved', 'passed'],
  'REJECTED': ['rejected', 'failed'],
  'EXECUTED': ['executed', 'implemented']
};

/**
 * Make HTTPS GET request
 */
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Celo-Community-Fund-Tracker',
        ...headers
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch list of CGP files from GitHub
 */
async function fetchCGPList() {
  try {
    const data = await httpsGet(GITHUB_API_BASE);
    const files = JSON.parse(data);

    // Filter for CGP markdown files and sort by number (most recent first)
    const cgpFiles = files
      .filter(f => f.name.match(/^cgp-\d+\.md$/i))
      .map(f => ({
        name: f.name,
        number: parseInt(f.name.match(/\d+/)[0])
      }))
      .sort((a, b) => b.number - a.number);

    return cgpFiles;
  } catch (error) {
    console.error('Error fetching CGP list:', error.message);
    return [];
  }
}

/**
 * Parse CGP markdown content
 */
function parseCGPContent(content, cgpNumber) {
  const lines = content.split('\n');

  const proposal = {
    id: `cgp-${String(cgpNumber).padStart(4, '0')}`,
    title: '',
    status: 'DRAFT',
    proposer: '',
    dateSubmitted: null,
    fundingRequested: {
      amount: 0,
      token: 'CELO',
      usdEquivalent: null
    },
    summary: '',
    githubUrl: `https://github.com/celo-org/governance/blob/main/CGPs/cgp-${String(cgpNumber).padStart(4, '0')}.md`,
    mondoUrl: null
  };

  // Extract title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    proposal.title = titleMatch[1].replace(/^CGP-?\d+:\s*/i, '').trim();
  }

  // Extract status
  const statusMatch = content.match(/status:\s*(\w+)/i);
  if (statusMatch) {
    const statusText = statusMatch[1].toLowerCase();
    for (const [status, keywords] of Object.entries(STATUS_KEYWORDS)) {
      if (keywords.some(kw => statusText.includes(kw))) {
        proposal.status = status;
        break;
      }
    }
  }

  // Extract author/proposer
  const authorMatch = content.match(/author[s]?:\s*(.+)$/im);
  if (authorMatch) {
    proposal.proposer = authorMatch[1].trim();
  }

  // Extract date
  const dateMatch = content.match(/created:\s*(\d{4}-\d{2}-\d{2})/i);
  if (dateMatch) {
    proposal.dateSubmitted = dateMatch[1];
  }

  // Extract summary (first paragraph after title, or discussions-to section)
  const summaryMatch = content.match(/##\s+Summary\s*\n\n(.+?)(?=\n##|\n$)/s) ||
                       content.match(/discussions-to:\s*(.+?)(?=\n\w+:|\n##|\n$)/is);
  if (summaryMatch) {
    proposal.summary = summaryMatch[1].trim().replace(/\n/g, ' ').slice(0, 400);
  }

  return proposal;
}

/**
 * Fetch mainnet.json from CGP folder and extract CELO amount
 */
async function extractCommunityFundAmountFromJSON(cgpNumber) {
  try {
    const fileName = `cgp-${String(cgpNumber).padStart(4, '0')}`;
    const url = `${GITHUB_RAW_BASE}/${fileName}/mainnet.json`;

    const data = await httpsGet(url);
    const transactions = JSON.parse(data);
    let totalAmount = 0;

    // Parse transactions array
    const txArray = Array.isArray(transactions) ? transactions : [transactions];

    for (const tx of txArray) {
      // Check if this transaction involves the GoldToken (CELO) contract
      if (tx.contract && tx.contract.toLowerCase() === 'goldtoken') {
        // Check for approve, transfer, or increaseAllowance functions
        const isRelevantFunction = ['approve', 'transfer', 'increaseallowance', 'transfercollateralasset']
          .some(fn => tx.function?.toLowerCase().includes(fn));

        if (isRelevantFunction && tx.args && Array.isArray(tx.args)) {
          // For most CELO transactions, the amount is the second argument
          // args[0] = recipient address, args[1] = amount in wei
          const amountArg = tx.args[1] || tx.args[0];

          if (amountArg) {
            const amountStr = String(amountArg);

            // Check if this looks like a wei amount (ends with many zeros)
            if (/^\d{18,}$/.test(amountStr)) {
              // Convert from wei to CELO (divide by 10^18)
              const amountWei = BigInt(amountStr);
              const amountCelo = Number(amountWei / BigInt(10**18));

              // For approve/increaseAllowance, this is the funding amount
              // For transfer, add to total
              if (amountCelo > 0) {
                totalAmount = Math.max(totalAmount, amountCelo);
              }
            }
          }
        }
      }
    }

    return totalAmount;
  } catch (error) {
    // mainnet.json might not exist yet for drafts
    return 0;
  }
}

/**
 * Extract CELO amount mentioned in markdown for verification
 */
function extractAmountFromMarkdown(content) {
  // Look for common patterns like "Request: X CELO" or "X $CELO"
  const patterns = [
    /Request[:\s]+([0-9,]+(?:\.[0-9]+)?)\s*\$?CELO/i,
    /([0-9,]+(?:\.[0-9]+)?)\s*\$CELO/i,
    /Funding[:\s]+([0-9,]+(?:\.[0-9]+)?)\s*CELO/i
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(amount)) {
        return Math.round(amount);
      }
    }
  }
  return null;
}

/**
 * Fetch and parse a single CGP
 */
async function fetchCGP(cgpNumber) {
  try {
    const fileName = `cgp-${String(cgpNumber).padStart(4, '0')}.md`;
    const url = `${GITHUB_RAW_BASE}/${fileName}`;

    const content = await httpsGet(url);
    const proposal = parseCGPContent(content, cgpNumber);

    // Extract funding amount from mainnet.json in cgp-XXXX folder (source of truth)
    const jsonAmount = await extractCommunityFundAmountFromJSON(cgpNumber);

    // Also check markdown for comparison
    const mdAmount = extractAmountFromMarkdown(content);

    // Verify amounts match
    if (jsonAmount === 0 && mdAmount === null) {
      // No mainnet.json and no funding mentioned in markdown - Non Funding Proposal
      proposal.fundingRequested.amount = 0;
      proposal.fundingRequested.note = 'Non Funding Proposal';
    } else if (jsonAmount === 0 && mdAmount > 0) {
      // Markdown mentions funding but no mainnet.json exists - Missing JSON
      proposal.fundingRequested.amount = 0;
      proposal.fundingRequested.note = `⚠️ Missing mainnet.json (markdown mentions ${mdAmount.toLocaleString()} CELO)`;
    } else if (jsonAmount > 0 && mdAmount > 0 && Math.abs(jsonAmount - mdAmount) > 1) {
      // Both exist but don't match
      proposal.fundingRequested.amount = jsonAmount;
      proposal.fundingRequested.note = `⚠️ JSON amount (${jsonAmount.toLocaleString()} CELO) doesn't match markdown (${mdAmount.toLocaleString()} CELO)`;
    } else {
      // Use JSON amount (source of truth)
      proposal.fundingRequested.amount = jsonAmount;
    }

    return proposal;
  } catch (error) {
    console.error(`Error fetching CGP-${cgpNumber}:`, error.message);
    return null;
  }
}

/**
 * Main update function
 */
async function updateProposals() {
  console.log('🔍 Fetching latest CGPs from GitHub...');

  const cgpFiles = await fetchCGPList();
  if (cgpFiles.length === 0) {
    console.log('❌ No CGPs found');
    return;
  }

  console.log(`📋 Found ${cgpFiles.length} CGPs`);

  // Fetch the latest 10 CGPs (most recent proposals)
  const latestCGPs = cgpFiles.slice(0, 10);
  const proposals = [];

  for (const cgp of latestCGPs) {
    console.log(`   Fetching CGP-${cgp.number}...`);
    const proposal = await fetchCGP(cgp.number);

    if (proposal) {
      // Only include proposals that are DRAFT, PROPOSED, or VOTING
      if (['DRAFT', 'PROPOSED', 'VOTING'].includes(proposal.status)) {
        proposals.push(proposal);
        console.log(`   ✅ ${proposal.id}: ${proposal.fundingRequested.amount.toLocaleString()} CELO`);

        // Show warning if amounts don't match
        if (proposal.fundingRequested.note) {
          console.log(`      ${proposal.fundingRequested.note}`);
        }
      } else {
        console.log(`   ⏭️  ${proposal.id}: Skipped (status: ${proposal.status})`);
      }
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (proposals.length === 0) {
    console.log('❌ No active proposals found');
    return;
  }

  // Generate the data file content
  const fileContent = `// Incoming Celo Governance Proposals (CGPs)
// Source: https://github.com/celo-org/governance/tree/main/CGPs
// Mondo: https://mondo.celo.org/
// Last updated: ${new Date().toISOString()}

export const incomingProposals = ${JSON.stringify(proposals, null, 2)};

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
`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'incoming_proposals.js');
  fs.writeFileSync(outputPath, fileContent, 'utf8');

  console.log(`\n✅ Updated ${proposals.length} proposals`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`💰 Total funding: ${proposals.reduce((sum, p) => sum + p.fundingRequested.amount, 0).toLocaleString()} CELO`);
}

// Run the update
updateProposals().catch(error => {
  console.error('❌ Error updating proposals:', error);
  process.exit(1);
});
