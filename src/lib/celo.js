import { createPublicClient, erc20Abi, formatEther, http } from "viem";
import { celo } from "viem/chains";
import { CELO_TOKEN, GOVERNANCE_ADDRESS } from "../data/data.js";

const client = createPublicClient({ chain: celo, transport: http() });

const toCelo = (wei) => Math.round(Number(formatEther(wei)));

const readCelo = (functionName, args) =>
  client.readContract({ address: CELO_TOKEN, abi: erc20Abi, functionName, args }).then(toCelo);

/**
 * Reads the governance contract's CELO balance and the remaining
 * spend allowance of each initiative, in whole CELO. Initiatives without
 * an address were one-off transfers and have no allowance.
 */
export async function fetchFundBalances(initiatives) {
  const [balance, ...remaining] = await Promise.all([
    readCelo("balanceOf", [GOVERNANCE_ADDRESS]),
    ...initiatives.map((initiative) =>
      initiative.address ? readCelo("allowance", [GOVERNANCE_ADDRESS, initiative.address]) : 0
    ),
  ]);

  const allowances = Object.fromEntries(initiatives.map((initiative, i) => [initiative.title, remaining[i]]));
  return { balance, allowances };
}
