import React from 'react';
import { formatWei, formatWhole } from '../lib/format';

/** Whole-unit amount; the exact value (to the wei) is in the hover title. */
export default function Amount({ wei }) {
  return <span title={formatWei(wei)}>{formatWhole(wei)}</span>;
}
