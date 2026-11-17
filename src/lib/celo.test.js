import { afterEach, describe, expect, it, vi } from 'vitest';
import { decodeFunctionData, encodeAbiParameters, encodeFunctionResult, multicall3Abi } from 'viem';
import { ledger, proposers } from '../data/index.js';
import { fetchFundBalances } from './celo.js';

// Public RPCs such as Forno refuse JSON-RPC batches above a size limit. 100 is a common cap.
const BATCH_LIMIT = 100;
const MULTICALL3 = '0xca11bde05977b3631167028862be2a173976ca11';
const ONE = encodeAbiParameters([{ type: 'uint256' }], [1n]);

/** Answers every eth_call with 1 wei, the way a node would, and records the size of each request. */
function fakeNode() {
  const sizes = [];
  const answer = ({ id, method, params }) => {
    if (method !== 'eth_call') return { jsonrpc: '2.0', id, error: { code: -32601, message: `unexpected ${method}` } };
    const [{ to, data }] = params;
    if (to.toLowerCase() !== MULTICALL3) return { jsonrpc: '2.0', id, result: ONE };
    const { args: [calls] } = decodeFunctionData({ abi: multicall3Abi, data });
    const result = encodeFunctionResult({
      abi: multicall3Abi,
      functionName: 'aggregate3',
      result: calls.map(() => ({ success: true, returnData: ONE })),
    });
    return { jsonrpc: '2.0', id, result };
  };
  const fetch = vi.fn(async (_url, init) => {
    const body = JSON.parse(init.body);
    const requests = Array.isArray(body) ? body : [body];
    sizes.push(requests.length);
    if (requests.length > BATCH_LIMIT) {
      return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32005, message: 'batch too large' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }
    const out = requests.map(answer);
    return new Response(JSON.stringify(Array.isArray(body) ? out : out[0]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  });
  return { fetch, sizes };
}

afterEach(() => vi.unstubAllGlobals());

describe('fetchFundBalances', () => {
  it('reads every balance, allowance and deposit without exceeding the RPC batch limit', async () => {
    const node = fakeNode();
    vi.stubGlobal('fetch', node.fetch);

    const { balances, allowances, deposits } = await fetchFundBalances(ledger, proposers);

    expect(Object.values(balances).every((v) => v === 1n)).toBe(true);
    expect(Object.keys(allowances)).toHaveLength(ledger.filter((e) => e.kind === 'allowance').length);
    expect(deposits).toBe(BigInt(proposers.length));
    expect(Math.max(...node.sizes)).toBeLessThanOrEqual(BATCH_LIMIT);
  });
});
