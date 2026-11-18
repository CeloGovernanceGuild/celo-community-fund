import React from 'react';

const ICONS = {
  x: {
    viewBox: '0 0 24 24',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  github: {
    viewBox: '0 0 16 16',
    path: 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z',
  },
  website: {
    viewBox: '0 0 24 24',
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z',
  },
};
const KIND_LABEL = { x: 'X', github: 'GitHub', website: 'website' };

export const GUILD = {
  name: 'Celo Governance Guild',
  entity: 'Celo Governance Guild Association, incorporated in Switzerland',
  links: [
    { kind: 'x', href: 'https://x.com/celogovernance' },
    { kind: 'github', href: 'https://github.com/CeloGovernanceGuild' },
  ],
};

// Guild members credited on the site. Add a member by adding an entry here.
export const MEMBERS = [
  {
    name: '0xzoz',
    role: 'Original author, 2023',
    links: [
      { kind: 'x', href: 'https://x.com/0xzoz' },
      { kind: 'github', href: 'https://github.com/0xzoz' },
    ],
  },
  {
    name: '0xGoldo',
    role: 'Guild member',
    links: [
      { kind: 'x', href: 'https://x.com/0x_chrono' },
      { kind: 'github', href: 'https://github.com/0xGoldo' },
    ],
  },
  {
    name: '0xj4an',
    role: 'Rebuild and maintenance: on-chain audit, ledger, redesign',
    links: [
      { kind: 'x', href: 'https://x.com/0xj4an' },
      { kind: 'github', href: 'https://github.com/0xj4an-Work' },
      { kind: 'website', href: 'https://0xj4an.xyz' },
    ],
  },
];

/** Round icon links. Each one names who and where it goes for screen readers and on hover. */
export function SocialLinks({ name, links }) {
  return (
    <span className="social">
      {links.map((l) => {
        const icon = ICONS[l.kind];
        const label = `${name} on ${KIND_LABEL[l.kind]}`.replace(' on website', ' website');
        return (
          <a key={l.kind} className="social-link" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
            <svg viewBox={icon.viewBox} width="18" height="18" fill="currentColor" aria-hidden="true"><path d={icon.path} /></svg>
          </a>
        );
      })}
    </span>
  );
}

export function CreditsCard() {
  return (
    <section className="card" aria-labelledby="credits-title">
      <div className="card-head">
        <div>
          <p className="eyebrow">Maintained by</p>
          <h2 className="section-title" id="credits-title">{GUILD.name}</h2>
          <p className="small muted">Legal entity: {GUILD.entity}</p>
        </div>
        <SocialLinks name={GUILD.name} links={GUILD.links} />
      </div>
      <table className="table credits">
        <thead>
          <tr><th>Guild member</th><th>Role on this site</th><th className="num">Links</th></tr>
        </thead>
        <tbody>
          {MEMBERS.map((m) => (
            <tr key={m.name}>
              <td><strong>{m.name}</strong></td>
              <td className="muted">{m.role}</td>
              <td className="num"><SocialLinks name={m.name} links={m.links} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
