import React, { useMemo, useState } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import symbol from '../images/celo_symbol.png';
import symbol_black from '../images/celo_symbol_black.png';
import {
  COMMUNITY_FUND_EXPLORER,
  contract_celo_available_color,
  contract_celo_color,
  contract_celo_spent_color,
  initiative_available_celo_color,
  initiative_spent_celo_color,
  pending_drafts_celo_color,
} from '../data/data';
import { formatWei } from '../lib/format';

const Tooltip = ({ id, data }) => (
  <strong className="chart-tooltip">
    {id}: {data.exact} <img className="symbol-hover" alt="CELO" src={symbol_black} />
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

export default function StatusPage({ state }) {
  const [chartType, setChartType] = useState('Lifetime');
  const layers = useMemo(() => ['arcs', 'arcLabels', centeredMetric(chartType)], [chartType]);
  const celo = state.tokens.CELO;

  return (
    <>
      <a href={COMMUNITY_FUND_EXPLORER} target="_blank" rel="noopener noreferrer" className="tooltip">
        <span className="tooltiptext">View Governance Contract</span>
        <h4>
          <p className="amount-disclaimer">Contract Balance | Funds Available</p>
          {formatWei(celo.balance)} <img className="symbol" alt="CELO" src={symbol} />
          <span> | </span>
          {formatWei(celo.available)} <img className="symbol" alt="CELO" src={symbol} />
        </h4>
      </a>

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
            tooltip={Tooltip}
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

      <div className="legend-right">
        <table>
          <tbody>
            <tr><td>Contract Celo</td><td style={{ backgroundColor: contract_celo_color }} /></tr>
            <tr><td>Contract Celo Available</td><td style={{ backgroundColor: contract_celo_available_color }} /></tr>
            <tr><td>Open Allowances</td><td style={{ backgroundColor: initiative_available_celo_color }} /></tr>
          </tbody>
        </table>
      </div>
      <div className="legend-left">
        <table>
          <tbody>
            <tr><td style={{ backgroundColor: contract_celo_spent_color }} /><td>Contract Celo Lifetime Spent</td></tr>
            <tr><td style={{ backgroundColor: initiative_spent_celo_color }} /><td>Claimed by Initiatives</td></tr>
            <tr><td style={{ backgroundColor: pending_drafts_celo_color }} /><td>Pending Proposals</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
