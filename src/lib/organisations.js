import { CAMPS, ORGANISATIONS, RECIPIENTS } from '../data/organisations.js';
import { TOKENS } from './fund.js';

/** Same key as groupByRecipient: the lower-case address, or `transfer:<title>` for direct transfers. */
export const recipientKey = (group) => group.key ?? (group.address ? group.address.toLowerCase() : `transfer:${group.title}`);

export const campLabel = (key) => CAMPS.find((c) => c.key === key)?.label ?? 'Unassigned';

/** The organisation behind one recipient, with its camp and family. Unmapped recipients stay visible as themselves. */
export function organisationOf(group, recipients = RECIPIENTS, organisations = ORGANISATIONS) {
  const name = recipients[recipientKey(group)];
  const org = name ? organisations[name] : null;
  return org ? { name, ...org } : { name: group.title, camp: 'unassigned', family: 'Unassigned' };
}

/**
 * One entry per organisation, adding up its recipients per token. Amounts of different tokens are
 * never added together. Each entry keeps its recipients so the page can list them underneath.
 */
export function groupByOrganisation(groups, recipients = RECIPIENTS, organisations = ORGANISATIONS) {
  const orgs = new Map();
  for (const group of groups) {
    const org = organisationOf(group, recipients, organisations);
    if (!orgs.has(org.name)) {
      orgs.set(org.name, { key: `org:${org.name}`, title: org.name, camp: org.camp, family: org.family, note: org.note, recipients: [] });
    }
    orgs.get(org.name).recipients.push(group);
  }
  return [...orgs.values()].map((org) => {
    const positions = TOKENS.map((token) => {
      const list = org.recipients.flatMap((r) => r.positions.filter((p) => p.token === token));
      if (list.length === 0) return null;
      const sum = (field) => list.reduce((total, p) => total + p[field], 0n);
      return { token, approved: sum('approved'), paidOut: sum('paidOut'), remaining: sum('remaining') };
    }).filter(Boolean);
    const status = positions.some((p) => p.remaining > 0n)
      ? 'open'
      : org.recipients.every((r) => r.status === 'transferred') ? 'transferred' : 'fully claimed';
    return {
      ...org,
      positions,
      status,
      tokens: positions.map((p) => p.token),
      cgps: [...new Set(org.recipients.flatMap((r) => r.cgps))].sort((a, b) => a - b),
      lastGrant: org.recipients.map((r) => r.lastGrant).sort().at(-1) ?? '',
    };
  });
}

/** Paid out per camp for one token, in camp order, ready for SegmentedBar. */
export function paidOutByCamp(groups, token, recipients = RECIPIENTS, organisations = ORGANISATIONS) {
  const totals = Object.fromEntries(CAMPS.map((c) => [c.key, 0n]));
  for (const group of groups) {
    const { camp } = organisationOf(group, recipients, organisations);
    if (!(camp in totals)) continue;
    for (const p of group.positions) if (p.token === token) totals[camp] += p.paidOut;
  }
  return CAMPS.map((c) => ({ key: c.key, label: c.label, wei: totals[c.key] }));
}
