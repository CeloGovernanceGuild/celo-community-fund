import { createPublicClient, erc20Abi, http, parseAbi } from 'viem';
import { celo } from 'viem/chains';
import { CELO_USD_FEED, EUR_USD_FEED, GOVERNANCE_ADDRESS, RESERVE_ADDRESS, TOKEN_ADDRESSES } from '../data/data.js';
import { TOKENS, allowanceKey } from './fund.js';

const client = createPublicClient({ chain: celo, transport: http(undefined, { batch: true }) });
const feedAbi = parseAbi(['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)']);

const read = (token, functionName, args) =>
  client.readContract({ address: TOKEN_ADDRESSES[token], abi: erc20Abi, functionName, args });

const price = (address) =>
  client
    .readContract({ address, abi: feedAbi, functionName: 'latestRoundData' })
    .then((round) => round[1])
    .catch(() => null);

/** Fund balances and live allowances for every ledger entry, in wei. */
export async function fetchFundBalances(ledger) {
  const allowanceEntries = ledger.filter((e) => e.kind === 'allowance');
  const [balances, allowances] = await Promise.all([
    Promise.all(TOKENS.map((t) => read(t, 'balanceOf', [GOVERNANCE_ADDRESS]))),
    Promise.all(allowanceEntries.map((e) => read(e.token, 'allowance', [GOVERNANCE_ADDRESS, e.address]))),
  ]);
  return {
    balances: Object.fromEntries(TOKENS.map((t, i) => [t, balances[i]])),
    allowances: Object.fromEntries(allowanceEntries.map((e, i) => [allowanceKey(e.token, e.address), allowances[i]])),
  };
}

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
