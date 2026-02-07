import React from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst'
import { useTheme } from '@nivo/core'
import MultiSwitch from 'react-multi-switch-toggle'
import symbol_black from '../images/celo_symbol_black.png';
import {
  contract_celo_color,
  contract_celo_spent_color
} from '../data/data';

function Home({
  chart,
  chartType,
  changeChartType,
  communityFundCelo,
  initativeAvailable
}) {

  const CustomTooltip = ({ id, value }) => {
    const theme = useTheme()

    return (
      <strong style={{ ...theme.tooltip.container }}>
        {id}: {value.toLocaleString() + ' ' }<span><img className='symbol-hover' alt="Celo Currency Symbol" src={symbol_black}></img></span>
      </strong>
    )
  }

  const CenteredMetric = ({ nodes, centerX, centerY}) => {
    return (
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fill: '#fff' }}
      >
        {chartType}
        <tspan x={centerX} y={centerY + 10} textAnchor="middle" dominantBaseline="central" style={{ fill: '#fff' }}>
          Status
        </tspan>
      </text>
    )
  }

  return (
    <>
      <div className='toggle'>
        <MultiSwitch
          texts={[
            'Lifetime',
            'Current'
          ]}
          selectedSwitch={0}
          bgColor={'white'}
          onToggleCallback={changeChartType}
          fontColor={'black'}
          selectedFontColor={'#1e311b'}
          selectedSwitchColor={'#FCFF52'}
          eachSwitchWidth={110}
          height={'30px'}
          fontSize={'16px'}
        />
      </div>
      <div className='pie-chart'>
        <div className='chart-text' style={{ height: '50vh', width: '100%', color: 'black', textAlign:'center' }}>
          <ResponsiveSunburst
            layers={['arcs', 'arcLabels', CenteredMetric]}
            data={chart}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="loc"
            cornerRadius={2}
            tooltip={CustomTooltip}
            borderColor={{ theme: 'background' }}
            colors={[contract_celo_color, contract_celo_spent_color]}
            childColor={(parent, child) => {
              return child.data.color
            }}
            enableArcLabels={true}
            arcLabel={(d) => parseFloat(d.formattedValue).toFixed(0) + '%'}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  1.4
                ]
              ]
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
