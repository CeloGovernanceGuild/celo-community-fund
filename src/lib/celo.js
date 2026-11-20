import { createPublicClient, erc20Abi, http, parseAbi } from 'viem';
import { celo } from 'viem/chains';
import {
  CELO_USD_FEED,
  EUR_USD_FEED,
  GOVERNANCE_ADDRESS,
  GOVERNANCE_APPROVER,
  OPERATIONS_SAFE,
  RESERVE_ADDRESS,
  TOKEN_ADDRESSES,
} from '../data/data.js';
import { TOKENS, allowanceKey } from './fund.js';

// The fund alone needs 100+ reads (balances, an allowance per grant, a deposit per proposer). Sent as
// one JSON-RPC batch they go over what public RPCs such as Forno accept, and the whole site fails.
// Multicall3 packs the reads into a few eth_calls, and the HTTP batch is capped as a second guard.
const client = createPublicClient({
  chain: celo,
  batch: { multicall: true },
  transport: http(undefined, { batch: { batchSize: 20 } }),
});
const depositsAbi = parseAbi(['function refundedDeposits(address) view returns (uint256)']);
const feedAbi = parseAbi(['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)']);

const read = (token, functionName, args) =>
  client.readContract({ address: TOKEN_ADDRESSES[token], abi: erc20Abi, functionName, args });

const price = (address) =>
  client
    .readContract({ address, abi: feedAbi, functionName: 'latestRoundData' })
    .then((round) => round[1])
    .catch(() => null);

/** Fund balances, live allowances for every ledger entry and unclaimed proposal deposits, in wei. */
export async function fetchFundBalances(ledger, proposers = []) {
  const allowanceEntries = ledger.filter((e) => e.kind === 'allowance');
  const [balances, allowances, refundable] = await Promise.all([
    Promise.all(TOKENS.map((t) => read(t, 'balanceOf', [GOVERNANCE_ADDRESS]))),
    Promise.all(allowanceEntries.map((e) => read(e.token, 'allowance', [GOVERNANCE_ADDRESS, e.address]))),
    Promise.all(proposers.map((address) =>
      client.readContract({ address: GOVERNANCE_ADDRESS, abi: depositsAbi, functionName: 'refundedDeposits', args: [address] }))),
  ]);
  return {
    // Proposal deposits the proposers can still withdraw: in the balance, but not the fund's.
    deposits: refundable.reduce((total, amount) => total + amount, 0n),
    balances: Object.fromEntries(TOKENS.map((t, i) => [t, balances[i]])),
    allowances: Object.fromEntries(allowanceEntries.map((e, i) => [allowanceKey(e.token, e.address), allowances[i]])),
  };
}

/** CELO/USD from the Chainlink feed (8 decimals), or null when it cannot be read. */
export const fetchCeloPrice = () => price(CELO_USD_FEED);

/** Reserve balances and Chainlink USD prices (8 decimals) for the Balances page. */
export async function fetchMarket() {
  const [reserve, celoUsd, eurUsd] = await Promise.all([
    Promise.all(TOKENS.map((t) => read(t, 'balanceOf', [RESERVE_ADDRESS]))),
    price(CELO_USD_FEED),
    price(EUR_USD_FEED),
  ]);
  return {
    reserve: Object.fromEntries(TOKENS.map((t, i) => [t, reserve[i]])),
    prices: { CELO: celoUsd, USDm: 100000000n, EURm: eurUsd },
  };
}

const governanceAbi = parseAbi([
  'function stageDurations() view returns (uint256, uint256, uint256)',
  'function minDeposit() view returns (uint256)',
  'function concurrentProposals() view returns (uint256)',
]);
const signersAbi = parseAbi([
  'function getOwners() view returns (address[])',
  'function required() view returns (uint256)',
  'function getThreshold() view returns (uint256)',
]);

/**
 * Governance rules as they are on-chain right now. Every field is null when its read fails,
 * so the page can fall back to the last values checked by hand.
 */
export async function fetchGovernanceRules() {
  const call = (address, abi, functionName) => client.readContract({ address, abi, functionName }).catch(() => null);
  const [stages, deposit, concurrent, approvers, approvalsNeeded, safeOwners, safeThreshold] = await Promise.all([
    call(GOVERNANCE_ADDRESS, governanceAbi, 'stageDurations'),
    call(GOVERNANCE_ADDRESS, governanceAbi, 'minDeposit'),
    call(GOVERNANCE_ADDRESS, governanceAbi, 'concurrentProposals'),
    call(GOVERNANCE_APPROVER, signersAbi, 'getOwners'),
    call(GOVERNANCE_APPROVER, signersAbi, 'required'),
    call(OPERATIONS_SAFE, signersAbi, 'getOwners'),
    call(OPERATIONS_SAFE, signersAbi, 'getThreshold'),
  ]);
  const days = (seconds) => (seconds == null ? null : Number(seconds) / 86400);
  const count = (value) => (value == null ? null : Number(value));
  return {
    deposit,
    votingDays: days(stages?.[1]),
    executionDays: days(stages?.[2]),
    concurrent: count(concurrent),
    approvers: approvers?.length ?? null,
    approvalsNeeded: count(approvalsNeeded),
    safeOwners: safeOwners?.length ?? null,
    safeThreshold: count(safeThreshold),
  };
}
