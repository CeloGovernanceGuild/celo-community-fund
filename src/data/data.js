
//Addresses
const CELO_TOKEN = "0x471EcE3750Da237f93B8E339c536989b8978a438";
const CEUR_TOKEN = "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73";
const USDM_TOKEN = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
const EURM_TOKEN = "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73";
const GOVERNANCE_ADDRESS = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972";
const MENTO_RESERVE_ADDRESS = "0x9d65E69aC940dCB469fd7C46368C1e094250a400";

//Chainlink Price Feed Addresses (Celo Mainnet)
const CELO_USD_FEED = "0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e";
const EUR_USD_FEED = "0x3D207061Dbe8E2473527611BFecB87Ff12b28dDa";

//Explorer Links
const community_fund_explorer = "https://explorer.celo.org/mainnet/address/0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972/coin-balances#address-tabs"

//colors
var contract_celo_color = "#FCFF52";
var contract_celo_spent_color = "#FF9A51";
var contract_celo_available_color = "#56DF7C";
var pending_drafts_celo_color = "#9B9B9B";
var initiate_spent_celo_color = "#B490FF";
var initiative_available_celo_color = "#7CC0FF";

//FUND
var community_fund= { title: "Community Fund", value: 0, amount:0, color: contract_celo_color,label:'',approved:0, address: GOVERNANCE_ADDRESS, proposal: community_fund_explorer, used:0}


//Estimated Replensh Rate
//Quick and dirty estimate based on current rate of spending by looking at one day
//TODO: Make this more accurate by looking at the 90 day average
const REPL_RATE = 18000;


const chartData = {
    "name": "Celo Community Fund",
    "color": "hsl(325, 70%, 50%)",
    "children": [
      {
        "name": "Contract Balance",
        "color": contract_celo_available_color,
        "children": [
  
        ]
      },
      {
        "name": "Contract Utilized ",
        "color": contract_celo_spent_color,
        "children": [
        ]
      },]
    }


export {CELO_TOKEN,
        CEUR_TOKEN,
        USDM_TOKEN,
        EURM_TOKEN,
        GOVERNANCE_ADDRESS,
        MENTO_RESERVE_ADDRESS,
        CELO_USD_FEED,
        EUR_USD_FEED,
        REPL_RATE,
        community_fund,
        contract_celo_color,
        contract_celo_spent_color,
        contract_celo_available_color,
        pending_drafts_celo_color,
        initiate_spent_celo_color,
        initiative_available_celo_color,
        chartData
    }