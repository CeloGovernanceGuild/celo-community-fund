import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import logo from './images/celo_logo.png';
import './App.css';
import { CloseIcon, GitHubIcon, InfoIcon } from './components/Icons';
import { REPL_RATE } from './data/data';
import { AUDIT_BLOCK, drafts, ledger, proposals } from './data';
import { fetchFundBalances } from './lib/celo';
import { buildFundState } from './lib/fund';
import StatusPage from './pages/StatusPage';
import LedgerPage from './pages/LedgerPage';
import BalancesPage from './pages/BalancesPage';
import ProposalsPage from './pages/ProposalsPage';

Modal.setAppElement('#root');

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const PAGES = [
  { path: 'status', label: 'Fund Status', Component: StatusPage },
  { path: 'ledger', label: 'Ledger', Component: LedgerPage },
  { path: 'balances', label: 'Balances', Component: BalancesPage },
  { path: 'proposals', label: 'Proposals', Component: ProposalsPage },
];

const currentPath = () => window.location.hash.replace(/^#\/?/, '') || 'status';

function App() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onHashChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchFundBalances(ledger)
      .then(({ balances, allowances }) => {
        if (!cancelled) setState(buildFundState({ balances, allowances, ledger, proposals, drafts }));
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError('Could not load on-chain data. Please try again later.');
      });
    return () => { cancelled = true; };
  }, []);

  const page = PAGES.find((p) => p.path === path) ?? PAGES[0];

  return (
    <div className="App">
      <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} style={modalStyles} contentLabel="About the Community Fund">
        <div className="modal">
          <button onClick={() => setIsOpen(false)} aria-label="Close"><CloseIcon /></button>
          <h2 className="modal-title">Celo Community Fund</h2>
          <p>The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.</p>
          <p>The Community Fund receives assets from three sources:</p>
          <ul>
            <li>The Community Fund receives a share of epoch rewards, paid from CeloUnreleasedTreasury since the L2 migration.</li>
            <li>The Community Fund is the default destination for slashed assets.</li>
            <li>The Community Fund also receives the 'base' portion of transaction fees.</li>
          </ul>
          <hr />
          <h3>Regular inflow: ~{REPL_RATE} CELO daily</h3>
          <p>Since the L2 migration, large grants are funded from the Reserve or the treasury in the same proposal that approves them.</p>
          <hr />
          <p>
            Every grant comes from an on-chain audit of all executed governance proposals (snapshot at block {AUDIT_BLOCK}).
            Remaining allowances and balances are read live. Amounts are tracked to the wei and shown in whole units.
            See the <a href="https://github.com/CeloGovernanceGuild/celo-community-fund/blob/main/docs/audit.md" target="_blank" rel="noopener noreferrer">audit report</a>.
          </p>
        </div>
      </Modal>

      <header className="App-header">
        <img className="celo-logo" src={logo} alt="Celo" />
        <a className="github" href="https://github.com/CeloGovernanceGuild/celo-community-fund" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
        <button className="info" onClick={() => setIsOpen(true)} aria-label="Info"><InfoIcon /></button>

        <h3 className="title">Community Fund Status</h3>
        <nav className="nav" aria-label="Pages">
          {PAGES.map((p) => (
            <a key={p.path} href={`#/${p.path}`} className={p === page ? 'nav-link active' : 'nav-link'} aria-current={p === page ? 'page' : undefined}>
              {p.label}
            </a>
          ))}
        </nav>

        {state ? <page.Component state={state} /> : <p className="loading">{error ?? 'Loading...'}</p>}

        <div className={page.path === 'status' ? 'footer-container' : 'footer-container static'}>
          <a className="footer" href="https://www.web3socialcapital.xyz" target="_blank" rel="noopener noreferrer">
            Made with <span role="img" aria-label="love">❤️</span> by <span className="w3text">w3sc</span>
          </a>
          <p className="donate">If you find this valuable please support us by voting for the validator group - <a className="TPT" href="https://www.thecelo.com/groupDetail/thepassivetrust" target="_blank" rel="noopener noreferrer">The Passive Trust</a></p>
        </div>
      </header>
    </div>
  );
}

export default App;
