import React, { useEffect, useState } from 'react';
import logo from './images/celo_logo.png';
import './App.css';
import { COMMUNITY_FUND_EXPLORER } from './data/data';
import { AUDIT_BLOCK, drafts, ledger, proposals, proposers } from './data';
import { fetchFundBalances } from './lib/celo';
import { buildFundState } from './lib/fund';
import { GUILD } from './components/Credits';
import OverviewPage from './pages/OverviewPage';
import LedgerPage from './pages/LedgerPage';
import BalancesPage from './pages/BalancesPage';
import ProposalsPage from './pages/ProposalsPage';
import HowPage from './pages/HowPage';
import AboutPage from './pages/AboutPage';

const REPO = 'https://github.com/CeloGovernanceGuild/celo-community-fund';

// `fund`: the page needs the fund balances and allowances. The others render straight away, so
// a slow or failing RPC never hides them (How it works reads its own rules and has fallbacks).
const PAGES = [
  { path: 'overview', label: 'Overview', Component: OverviewPage, fund: true },
  { path: 'ledger', label: 'Ledger', Component: LedgerPage, fund: true },
  { path: 'balances', label: 'Balances', Component: BalancesPage, fund: true },
  { path: 'proposals', label: 'Proposals', Component: ProposalsPage, fund: true },
  { path: 'how', label: 'How it works', Component: HowPage, fund: false },
  { path: 'about', label: 'About', Component: AboutPage, fund: false },
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
      // "#/about?credits" jumps to the credits card; every other navigation starts at the top.
      const target = window.location.hash.includes('?credits') ? 'credits-title' : null;
      setTimeout(() => {
        const el = target && document.getElementById(target);
        if (el) el.scrollIntoView({ block: 'start' });
        else window.scrollTo(0, 0);
      }, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    fetchFundBalances(ledger, proposers)
      .then(({ balances, allowances, deposits }) => {
        if (!cancelled) setState(buildFundState({ balances, allowances, ledger, proposals, drafts, deposits }));
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
          {(state || !page.fund) && <page.Component state={state} />}
          {page.fund && !state && !error && <p className="empty" role="status">Reading the fund from the Celo network...</p>}
          {page.fund && !state && error && (
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
              <li>Maintained by the <a href="#/about?credits">{GUILD.name}</a></li>
              <li>
                Originally built by <a href="https://github.com/0xzoz" target="_blank" rel="noopener noreferrer">0xzoz</a>{' '}
                (<a href="https://www.web3socialcapital.xyz" target="_blank" rel="noopener noreferrer">w3sc</a>).
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
