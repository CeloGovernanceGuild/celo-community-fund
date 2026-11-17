import React, { useEffect, useState } from 'react';
import logo from './images/celo_logo.png';
import './App.css';
import { COMMUNITY_FUND_EXPLORER } from './data/data';
import { AUDIT_BLOCK, drafts, ledger, proposals } from './data';
import { fetchFundBalances } from './lib/celo';
import { buildFundState } from './lib/fund';
import { GUILD, SocialLinks } from './components/Credits';
import OverviewPage from './pages/OverviewPage';
import LedgerPage from './pages/LedgerPage';
import BalancesPage from './pages/BalancesPage';
import ProposalsPage from './pages/ProposalsPage';
import AboutPage from './pages/AboutPage';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';

const PAGES = [
  { path: 'overview', label: 'Overview', Component: OverviewPage },
  { path: 'ledger', label: 'Ledger', Component: LedgerPage },
  { path: 'balances', label: 'Balances', Component: BalancesPage },
  { path: 'proposals', label: 'Proposals', Component: ProposalsPage },
  { path: 'about', label: 'About', Component: AboutPage },
];

const currentPath = () => window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'overview';

function App() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(false);
  const [path, setPath] = useState(currentPath);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const onHashChange = () => {
      setPath(currentPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    fetchFundBalances(ledger)
      .then(({ balances, allowances }) => {
        if (!cancelled) setState(buildFundState({ balances, allowances, ledger, proposals, drafts }));
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [attempt]);

  const page = PAGES.find((p) => p.path === path) ?? PAGES[0];

  useEffect(() => {
    document.title = page.path === 'overview' ? 'Celo Community Fund' : `${page.label} | Celo Community Fund`;
  }, [page]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="banner" aria-label="Data source">
        Live on-chain data, checked against every executed governance proposal.{' '}
        <a href={`${REPO}/blob/main/docs/audit.md`} target="_blank" rel="noopener noreferrer">Read the audit</a>
      </aside>

      <header className="site-header">
        <div className="container">
          <a className="brand" href="#/overview" aria-label="Celo Community Fund, overview">
            <img src={logo} alt="Celo" />
            <span>Community Fund</span>
          </a>
          <nav className="nav" aria-label="Main">
            {PAGES.map((p) => (
              <a key={p.path} href={`#/${p.path}`} aria-current={p === page ? 'page' : undefined}>{p.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <div className="container">
          {state && <page.Component state={state} />}
          {!state && !error && <p className="empty" role="status">Reading the fund from the Celo network...</p>}
          {!state && error && (
            <div className="card" role="alert">
              <h1 className="section-title">The on-chain data could not be loaded</h1>
              <p className="muted">The Celo network did not answer. Nothing is wrong with the fund; try again in a moment.</p>
              <div className="actions">
                <button className="button primary" type="button" onClick={() => setAttempt((n) => n + 1)}>Try again</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div>
            <h2>Celo Community Fund</h2>
            <p>
              Grants come from an audit of every executed governance proposal (snapshot at block {AUDIT_BLOCK}).
              Balances and remaining allowances are read live.
            </p>
          </div>
          <div>
            <h2>Sources</h2>
            <ul>
              <li><a className="link-out" href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer">Open the fund contract on Celoscan</a></li>
              <li><a href="https://github.com/celo-org/governance" target="_blank" rel="noopener noreferrer">Celo governance proposals (CGPs)</a></li>
              <li><a href="https://mondo.celo.org/governance" target="_blank" rel="noopener noreferrer">Vote on Mondo</a></li>
              <li><a href={`${REPO}/blob/main/docs/audit.md`} target="_blank" rel="noopener noreferrer">Audit report</a></li>
            </ul>
          </div>
          <div>
            <h2>Project</h2>
            <ul>
              <li><a href={REPO} target="_blank" rel="noopener noreferrer">Source code on GitHub</a></li>
              <li className="footer-credit">
                <span>Maintained by the {GUILD.name}</span>
                <SocialLinks name={GUILD.name} links={GUILD.links} />
              </li>
              <li>Originally built by 0xzoz (w3sc). <a href="#/about">See who is behind this</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
