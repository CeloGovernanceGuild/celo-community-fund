import React from 'react';
import { useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './images/celo_logo.png';
import symbol from './images/celo_symbol.png';
import './App.css';
import Table from './components/Table';
import Modal from 'react-modal';
import { useCelo } from '@celo/react-celo';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { GitHub } from '@mui/icons-material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Balances from './pages/Balances';
import {
  GOVERNANCE_ADDRESS,
  MENTO_RESERVE_ADDRESS,
  USDM_TOKEN,
  EURM_TOKEN,
  CELO_USD_FEED,
  EUR_USD_FEED,
  REPL_RATE,
  contract_celo_color,
  contract_celo_spent_color,
  contract_celo_available_color,
  pending_drafts_celo_color,
  initiate_spent_celo_color,
  initiative_available_celo_color,
  chartData } from './data/data';
import { initiatives } from './data/active_initiatives';
import { drafts } from './data/drafts';




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


function App() {
  const { kit } = useCelo();
  const [initativeAvailable, setInitiativeAvailable] = React.useState(0)
  const [currentData, setCurrentData] = React.useState(JSON.parse(JSON.stringify(chartData)));
  const [table, setTable] = React.useState([])
  const [communityFundCelo, setCommunityFundCelo] = React.useState(0)
  const [communityFundUSDm, setCommunityFundUSDm] = React.useState(0)
  const [communityFundEURm, setCommunityFundEURm] = React.useState(0)
  const [mentoReserveCelo, setMentoReserveCelo] = React.useState(0)
  const [mentoReserveUSDm, setMentoReserveUSDm] = React.useState(0)
  const [mentoReserveEURm, setMentoReserveEURm] = React.useState(0)
  const [celoPrice, setCeloPrice] = React.useState(0)
  const [eurPrice, setEurPrice] = React.useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [chartType, setChartType] = React.useState('Lifetime')
  const [chart, setChart] = React.useState(chartData)
  
  let fundData = initiatives;
  let draftsData = drafts;

 
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Approved',
        accessor: 'approved',
        Cell: ({row, value}) => (row.original.draft) ? <span style={{color:'#E70532'}}>{row.original.approved}</span> : <span>{value}</span>, 
      },
      {
        Header: 'Available',
        accessor: 'available',
      },
      {
        Header: 'Proposal',
        accessor: 'proposal',
        Cell: props => <a href={props.value}>Link</a>
      },
    ],
    []
  )






  const populateData = useCallback(async () => {
    let celo = await kit.contracts.getGoldToken()
    let tableData = [];
    let initative_available = 0;

    //Community Fund CELO balance
    let community_fund = await celo.balanceOf(GOVERNANCE_ADDRESS)
    let community_fund_celo_result = getCeloValue(community_fund.c[0])
    setCommunityFundCelo(community_fund_celo_result)

    //ERC-20 ABI for balanceOf function
    const ERC20_ABI = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ];

    //Community Fund USDm (Mento Dollar) balance
    try {
      const web3 = kit.connection.web3
      const usdmContract = new web3.eth.Contract(ERC20_ABI, USDM_TOKEN)
      let usdm_balance = await usdmContract.methods.balanceOf(GOVERNANCE_ADDRESS).call()
      let usdm_result = Math.round(Number(usdm_balance) / 10**18)
      setCommunityFundUSDm(usdm_result)
    } catch (e) {
      console.error('Error fetching USDm balance:', e)
      setCommunityFundUSDm(0)
    }

    //Community Fund EURm (Mento Euro) balance
    try {
      const web3 = kit.connection.web3
      const eurmContract = new web3.eth.Contract(ERC20_ABI, EURM_TOKEN)
      let eurm_balance = await eurmContract.methods.balanceOf(GOVERNANCE_ADDRESS).call()
      let eurm_result = Math.round(Number(eurm_balance) / 10**18)
      setCommunityFundEURm(eurm_result)
    } catch (e) {
      console.error('Error fetching EURm balance:', e)
      setCommunityFundEURm(0)
    }

    //Chainlink AggregatorV3Interface ABI for latestRoundData
    const CHAINLINK_ABI = [
      {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
          { internalType: 'uint80', name: 'roundId', type: 'uint80' },
          { internalType: 'int256', name: 'answer', type: 'int256' },
          { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
          { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
          { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ];

    //Fetch CELO/USD price from Chainlink
    try {
      const web3 = kit.connection.web3
      const celoUsdFeed = new web3.eth.Contract(CHAINLINK_ABI, CELO_USD_FEED)
      const roundData = await celoUsdFeed.methods.latestRoundData().call()
      // Chainlink price feeds return prices with 8 decimals
      const price = Number(roundData.answer) / 10**8
      setCeloPrice(price)
    } catch (e) {
      console.error('Error fetching CELO/USD price:', e)
      setCeloPrice(0)
    }

    //Fetch EUR/USD price from Chainlink
    try {
      const web3 = kit.connection.web3
      const eurUsdFeed = new web3.eth.Contract(CHAINLINK_ABI, EUR_USD_FEED)
      const roundData = await eurUsdFeed.methods.latestRoundData().call()
      // Chainlink price feeds return prices with 8 decimals
      const price = Number(roundData.answer) / 10**8
      setEurPrice(price)
    } catch (e) {
      console.error('Error fetching EUR/USD price:', e)
      setEurPrice(0)
    }

    //Mento Treasury Reserve CELO balance
    try {
      let mento_celo_balance = await celo.balanceOf(MENTO_RESERVE_ADDRESS)
      let mento_celo_result = getCeloValue(mento_celo_balance.c[0])
      setMentoReserveCelo(mento_celo_result)
    } catch (e) {
      console.error('Error fetching Mento Reserve CELO balance:', e)
      setMentoReserveCelo(0)
    }

    //Mento Treasury Reserve USDm balance
    try {
      const web3 = kit.connection.web3
      const usdmContract = new web3.eth.Contract(ERC20_ABI, USDM_TOKEN)
      let mento_usdm_balance = await usdmContract.methods.balanceOf(MENTO_RESERVE_ADDRESS).call()
      let mento_usdm_result = Math.round(Number(mento_usdm_balance) / 10**18)
      setMentoReserveUSDm(mento_usdm_result)
    } catch (e) {
      console.error('Error fetching Mento Reserve USDm balance:', e)
      setMentoReserveUSDm(0)
    }

    //Mento Treasury Reserve EURm balance
    try {
      const web3 = kit.connection.web3
      const eurmContract = new web3.eth.Contract(ERC20_ABI, EURM_TOKEN)
      let mento_eurm_balance = await eurmContract.methods.balanceOf(MENTO_RESERVE_ADDRESS).call()
      let mento_eurm_result = Math.round(Number(mento_eurm_balance) / 10**18)
      setMentoReserveEURm(mento_eurm_result)
    } catch (e) {
      console.error('Error fetching Mento Reserve EURm balance:', e)
      setMentoReserveEURm(0)
    }

    await Promise.all(fundData.map( async(fund) => {
      
      //Update Commmunity Fund CELO Available
      if(fund.title === 'Community Fund'){
        fund.amount = community_fund_celo_result
        fund.available = community_fund_celo_result - initativeAvailable;
        fund.color = contract_celo_available_color
      }else if(fund.title !== 'Drafts'){
        let allowance_available = await celo.allowance(GOVERNANCE_ADDRESS, fund.address)
        let available = getCeloValue(allowance_available.c[0])
        fund.available = available
        fund.used = fund.approved - fund.available
        fund.color = initiative_available_celo_color
        initative_available = initative_available + available 
        setInitiativeAvailable(initative_available)
      }else if(fund.title === 'Drafts'){
        fund.available = fund.amount
        fund.color = pending_drafts_celo_color
        initative_available = initative_available + fund.available 
      }

      //Add available funds to chart
      if(chartData.children[0].children.find((child) => child.name === fund.title) === undefined){
        chartData.children[0].children.push((fund.color !== undefined) ? { name: fund.title, color:fund.color, loc: fund.available } :{ name: fund.title, loc: fund.available })
        currentData.children[0].children.push((fund.color !== undefined) ? { name: fund.title, color:fund.color, loc: fund.available } :{ name: fund.title, loc: fund.available })
      }

      //Add utilized funds to chart
      if(chartData.children[1].children.find((child) => child.name  === fund.title + ' Spent' ) === undefined && fund.title !== 'Drafts' && fund.title !== 'Community Fund'){
        chartData.children[1].children.push({ name: fund.title + ' Spent', color: initiate_spent_celo_color, loc: fund.used })
      }

      //Add funds to table
      if(fund.title !== 'Drafts' && fund.title !== 'Community Fund'){
        tableData.push({ name: fund.title, approved: fund.approved.toLocaleString(), available: fund.available.toLocaleString(), proposal: fund.proposal })
      }

    }));

    //Add Drafts to table
    draftsData.forEach((draft) => {
      tableData.push({ name: draft.title, approved: draft.value.toLocaleString(), available: 0, proposal: draft.proposal, draft:true  })
    })

    //Update Community Fund CELO Utilized
    chartData.children[0].children.find((child) => child.name === 'Community Fund').loc = community_fund_celo_result - initative_available
    currentData.children[0].children.find((child) => child.name === 'Community Fund').loc = community_fund_celo_result - initative_available
    tableData.unshift({ name: 'Community Fund', approved: community_fund_celo_result.toLocaleString(), available: (community_fund_celo_result - initative_available).toLocaleString(), proposal: fundData[fundData.length - 1].proposal })
    setInitiativeAvailable(initative_available)
    setChart(chartData)
    setTable(tableData)
  } , [kit]);

  useEffect(() => {
    if (kit) {
      populateData().then(() => {populateData()})
    }
  }, [kit, populateData]);



  function getCeloValue(amount){
    return Math.round(amount / 10**4)
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function changeChartType(){
    if(chartType === 'Lifetime'){
      setChart(currentData)
      setChartType('Current')
    }else{
      setChart(chartData)
      setChartType('Lifetime')
    }
  }

  return (
    <div className="App">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className='modal'>
          <button onClick={closeModal}><CloseIcon/></button>
          <h2 className='modal-title'>Celo Community Fund</h2>
          
          <div>
            <p>The Community Fund provides for general upkeep of the Celo platform. CELO holders decide how to allocate these funds through governance proposals. Funds might be used to pay bounties for bugs or vulnerabilities, security audits, or grants for protocol development.</p>
            <p> The Community Fund receives assets from three sources:</p>
            <ul>
              <li>The Community Fund obtains a desired epoch reward defined as a fraction of the total desired epoch rewards (governable, initially planned to be 25%). This amount is subject to adjustment up or down in the event of under- or over-spending against the epoch rewards target schedule. The Community Fund epoch rewards may be redirected to bolster the Reserve.</li>
              <li>The Community Fund is the default destination for slashed assets.</li>
              <li>The Community Fund also receives the 'base' portion of transaction fees.</li>
            </ul>
          </div>

          <div>
            <hr/>
            <h3>Est Replenish Rate: ~{REPL_RATE.toLocaleString()} CELO daily</h3>
            <hr/>
            <p>* All values below in CELO</p>

          </div>
        <div className="modal-table">
        <Table columns={columns} data={table}/>
        </div>  
        </div>

      </Modal>
      <Router>
        <header className="App-header">
          <div>
            <img className='celo-logo' src={logo} alt="Celo" />
            <a className='github' href="https://github.com/web3sc/celo-community-fund"><GitHub /></a>
            <button className='info' onClick={openModal}><InfoIcon /></button>
          </div>

          <Navigation />

          <Routes>
            <Route
              path="/"
              element={
                <Balances
                  communityFundCelo={communityFundCelo}
                  communityFundUSDm={communityFundUSDm}
                  communityFundEURm={communityFundEURm}
                  mentoReserveCelo={mentoReserveCelo}
                  mentoReserveUSDm={mentoReserveUSDm}
                  mentoReserveEURm={mentoReserveEURm}
                  celoPrice={celoPrice}
                  eurPrice={eurPrice}
                />
              }
            />
            <Route
              path="/status"
              element={
                <>
                  <div className='header'>
                    <h3>Community Fund Status</h3>
                    <a href='https://explorer.celo.org/mainnet/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972' target='_blank' rel="noreferrer" className='tooltip'>
                      <span className="tooltiptext">View Governance Contract</span>
                      <h4>
                        <p className='amount-disclaimer'>Contract Balance | Funds Available</p>
                        {communityFundCelo.toLocaleString() + '  '}
                        <span><img className='symbol' alt="Celo Currency Symbol" src={symbol}></img></span>
                        <span> | </span>
                        {'  ' + (communityFundCelo - initativeAvailable).toLocaleString() + ' '}
                        <span><img className='symbol' alt="Celo Symbol" src={symbol}></img></span>
                      </h4>
                    </a>
                    <Home
                      chart={chart}
                      chartType={chartType}
                      changeChartType={changeChartType}
                      communityFundCelo={communityFundCelo}
                      initativeAvailable={initativeAvailable}
                    />
                  </div>
                  <div className='legend-right'>
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
                          <td>Intitative Celo Available</td>
                          <td style={{ backgroundColor: initiative_available_celo_color }} />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className='legend-left'>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ backgroundColor: contract_celo_spent_color }} />
                          <td>Contract Celo Lifetime Spent</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: initiate_spent_celo_color }} />
                          <td>Intiative Celo Spent</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: pending_drafts_celo_color }} />
                          <td>Draft Proposals Celo</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className='footer-container'>
                    <a className='footer' href="https://www.web3socialcapital.xyz">Made with <span role="img">❤️</span> by <span className='w3text'>w3sc</span></a>
                    <p className='donate'>If you find this valuable please support us by voting for the validator group - <a className='TPT' href='https://www.thecelo.com/groupDetail/thepassivetrust'>The Passive Trust</a></p>
                  </div>
                </>
              }
            />
          </Routes>
        </header>
      </Router>
    </div>
  );
}

export default App;
