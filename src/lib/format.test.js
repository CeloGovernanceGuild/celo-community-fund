import { describe, expect, it } from 'vitest';
import { formatUsd, formatWei, formatWhole, parseUnits18 } from './format.js';

describe('formatWei', () => {
  it('keeps every decimal and groups thousands', () => {
    expect(formatWei(6472791755488920000000n)).toBe('6,472.79175548892');
    expect(formatWei(1n)).toBe('0.000000000000000001');
    expect(formatWei('1000000000000000000000000')).toBe('1,000,000');
    expect(formatWei(-1500000000000000000n)).toBe('-1.5');
  });
});

describe('formatWhole', () => {
  it('drops decimals without rounding up and never shows a dust amount as zero', () => {
    expect(formatWhole(6472791755488920000000n)).toBe('6,472');
    expect(formatWhole(11705089545000000000000000n)).toBe('11,705,089');
    expect(formatWhole(780000000000000000n)).toBe('<1');
    expect(formatWhole(1n)).toBe('<1');
    expect(formatWhole(0n)).toBe('0');
    expect(formatWhole(-1150459758713017190426292n)).toBe('-1,150,459');
  });
});

describe('parseUnits18', () => {
  it('parses decimal strings exactly', () => {
    expect(parseUnits18('0.000000000000000001')).toBe(1n);
    expect(parseUnits18('1234.5')).toBe(1234500000000000000000n);
  });
});

describe('formatUsd', () => {
  it('converts at an 8 decimal price to the cent', () => {
    expect(formatUsd(10n ** 24n, 5904000n)).toBe('$59,040.00');
    expect(formatUsd(1n, null)).toBe(null);
  });
});
