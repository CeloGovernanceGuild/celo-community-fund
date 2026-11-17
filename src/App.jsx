import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import Modal from 'react-modal';
import logo from './images/celo_logo.png';
import symbol from './images/celo_symbol.png';
import symbol_black from './images/celo_symbol_black.png';
import './App.css';
import Table from './components/Table';
import { CloseIcon, GitHubIcon, InfoIcon } from './components/Icons';
import {
  COMMUNITY_FUND_EXPLORER,
  REPL_RATE,
  contract_celo_color,
  contract_celo_spent_color,
  contract_celo_available_color,
  pending_drafts_celo_color,
  initiative_spent_celo_color,
  initiative_available_celo_color,
} from './data/data';
import { drafts, initiatives } from './data';
import { fetchFundBalances } from './lib/celo';
import { buildFundState } from './lib/fund';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const fmt = (n) => n.toLocaleString('en-US');

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Approved',
    accessor: 'approved',
    Cell: ({ row, value }) => <span style={row.original.draft ? { color: '#E70532' } : undefined}>{fmt(value)}</span>,
  },
  {
    Header: 'Available',
    accessor: 'available',
    Cell: ({ value }) => fmt(value),
  },
  {
    Header: 'Proposal',
    accessor: 'proposal',
    Cell: ({ value }) => (value ? <a href={value} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A'),
  },
];

const CustomTooltip = ({ id, value }) => (
  <strong style={{ background: '#fff', color: '#000', padding: '5px 9px', borderRadius: 2, fontSize: 12 }}>
    {id}: {fmt(value)} <img className="symbol-hover" alt="CELO" src={symbol_black} />
  </strong>
);

const centeredMetric = (label) => function CenteredMetric({ centerX, centerY }) {
  return (
    <text x={centerX} y={centerY - 10} textAnchor="middle" dominantBaseline="central" style={{ fill: '#fff' }}>
      {label}
      <tspan x={centerX} y={centerY + 10} textAnchor="middle" dominantBaseline="central" style={{ fill: '#fff' }}>
        Status
      </tspan>
    </text>
  );
};

function App() {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [chartType, setChartType] = useState('Lifetime');

  useEffect(() => {
    let cancelled = false;
    fetchFundBalances(initiatives)
      .then(({ balance, allowances }) => {
        if (!cancelled) setState(buildFundState({ balance, allowances, initiatives, drafts }));
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError('Could not load on-chain data. Please try again later.');
      });
    return () => { cancelled = true; };
  }, []);

  const layers = useMemo(() => ['arcs', 'arcLabels', centeredMetric(chartType)], [chartType]);


  return (
    <div className="App">
      <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)} style={customStyles} contentLabel="Community Fund details">
        <div className="modal">
          <button onClick={() => setIsOpen(false)} aria-label="Close"><CloseIcon /></button>
          <h2 className="modal-title">Celo Community Fund</h2>

          <div>
            <p>The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.</p>
            <p>The Community Fund receives assets from three sources:</p>
            <ul>
              <li>The Community Fund obtains a desired epoch reward defined as a fraction of the total desired epoch rewards (governable, initially planned to be 25%). This amount is subject to adjustment up or down in the event of under- or over-spending against the epoch rewards target schedule. The Community Fund epoch rewards may be redirected to bolster the Reserve.</li>
              <li>The Community Fund is the default destination for slashed assets.</li>
              <li>The Community Fund also receives the 'base' portion of transaction fees.</li>
            </ul>
          </div>

          <div>
            <hr />
            <h3>Est Replenish Rate: ~{fmt(REPL_RATE)} CELO daily</h3>
            <hr />
            <p>* All values below in CELO</p>
          </div>
          <div className="modal-table">
            <Table columns={columns} data={state?.table ?? []} />
          </div>
        </div>
      </Modal>

      <header className="App-header">
        <div>
          <img className="celo-logo" src={logo} alt="Celo" />
          <a className="github" href="https://github.com/CeloGovernanceGuild/celo-community-fund" target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>
          <button className="info" onClick={() => setIsOpen(true)} aria-label="Info"><InfoIcon /></button>
        </div>

        <div className="App-header">
          <div className="header">
            <h3>Community Fund Status</h3>
            <a href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer" className="tooltip">
              <span className="tooltiptext">View Governance Contract</span>
              <h4>
                <p className="amount-disclaimer">Contract Balance | Funds Available</p>
                {state ? (
                  <>
                    {fmt(state.balance)} <img className="symbol" alt="CELO" src={symbol} />
                    <span> | </span>
                    {fmt(state.fundsAvailable)} <img className="symbol" alt="CELO" src={symbol} />
                  </>
                ) : (
                  error ?? 'Loading...'
                )}
              </h4>
            </a>
          </div>

          {state && (
            <>
              <div className="toggle" role="group" aria-label="Chart view">
                {['Lifetime', 'Current'].map((type) => (
                  <button
                    key={type}
                    className={type === chartType ? 'toggle-option selected' : 'toggle-option'}
                    aria-pressed={type === chartType}
                    onClick={() => setChartType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="pie-chart">
                <div style={{ height: '50vh', width: '100%', color: 'black', textAlign: 'center' }}>
                  <ResponsiveSunburst
                    layers={layers}
                    data={state.charts[chartType]}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    id="name"
                    value="loc"
                    cornerRadius={2}
                    tooltip={CustomTooltip}
                    borderColor={{ theme: 'background' }}
                    colors={[contract_celo_color, contract_celo_spent_color]}
                    childColor={(parent, child) => child.data.color}
                    enableArcLabels={true}
                    arcLabel={(d) => `${d.percentage.toFixed(0)}%`}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="legend-right">
          <table>
            <tbody>
              <tr>
                <td>Contract Celo</td>
                <td style={{ backgroundColor: contract_celo_color }} />
              </tr>
              <tr>
                <td>Contract Celo Available</td>
                <td style={{ backgroundColor: contract_celo_available_color }} />
              </tr>
              <tr>
                <td>Initiative Celo Available</td>
                <td style={{ backgroundColor: initiative_available_celo_color }} />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="legend-left">
          <table>
            <tbody>
              <tr>
                <td style={{ backgroundColor: contract_celo_spent_color }} />
                <td>Contract Celo Lifetime Spent</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: initiative_spent_celo_color }} />
                <td>Initiative Celo Spent</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: pending_drafts_celo_color }} />
                <td>Draft Proposals Celo</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer-container">
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
