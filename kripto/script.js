const API_KEY = "d4b2cahr01qrv4asc6e0d4b2cahr01qrv4asc6eg";

let stocks = [
  "BINANCE:BTCUSDT","BINANCE:ETHUSDT","BINANCE:XRPUSDT","BINANCE:ADAUSDT","BINANCE:SOLUSDT",
  "AAPL","MSFT","NVDA","GOOGL","AMZN","META"
];

const stockTableBody = document.querySelector("#stockTable tbody");
const stockInput = document.getElementById("stockInput");
const addStockBtn = document.getElementById("addStock");
const clockEl = document.getElementById("clock");

let priceHistory = {};
let chartsPrice = {};


function updateClock(){
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();


stocks.forEach(symbol => createRow(symbol));

addStockBtn.addEventListener("click", ()=>{
  const symbol = stockInput.value.trim().toUpperCase();
  if(symbol && !stocks.includes(symbol)){
    stocks.push(symbol);
    createRow(symbol);
    stockInput.value="";
    fetchStockData();
  }
});

function getLogoURL(symbol){
  const cryptoLogos = {
    "BINANCE:BTCUSDT":"https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
    "BINANCE:ETHUSDT":"https://assets.coingecko.com/coins/images/279/thumb/ethereum.png",
    "BINANCE:XRPUSDT":"https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png",
    "BINANCE:ADAUSDT":"https://assets.coingecko.com/coins/images/975/thumb/cardano.png",
    "BINANCE:SOLUSDT":"https://assets.coingecko.com/coins/images/4128/thumb/solana.png"
  };

  const stockLogos = {
     "AAPL": "https://logo.clearbit.com/apple.com",
  "MSFT": "https://logo.clearbit.com/microsoft.com",
  "NVDA": "https://logo.clearbit.com/nvidia.com",
  "GOOGL": "https://logo.clearbit.com/abc.xyz",
  "AMZN": "https://logo.clearbit.com/amazon.com",
  "META": "https://logo.clearbit.com/meta.com",
  "TSLA": "https://logo.clearbit.com/tesla.com",
  "JPM": "https://logo.clearbit.com/jpmorganchase.com",
  "V": "https://logo.clearbit.com/visa.com",
  "UNH": "https://logo.clearbit.com/unitedhealthgroup.com",
  "MA": "https://logo.clearbit.com/mastercard.com",
  "PG": "https://logo.clearbit.com/pg.com",
  "JNJ": "https://logo.clearbit.com/jnj.com",
  "HD": "https://logo.clearbit.com/homedepot.com",
  "KO": "https://logo.clearbit.com/coca‑cola.com",
  "DIS": "https://logo.clearbit.com/disney.com",
  "PYPL": "https://logo.clearbit.com/paypal.com",
  "BAC": "https://logo.clearbit.com/bankofamerica.com",
  "WMT": "https://logo.clearbit.com/walmart.com",
  "NVDA": "https://logo.clearbit.com/nvidia.com",
  "CMCSA": "https://logo.clearbit.com/comcast.com",
  "ABNB": "https://logo.clearbit.com/airbnb.com",
  "ORCL": "https://logo.clearbit.com/oracle.com",
  "ADBE": "https://logo.clearbit.com/adobe.com",
  "CRM": "https://logo.clearbit.com/salesforce.com",
  "INTC": "https://logo.clearbit.com/intel.com",
  "CSCO": "https://logo.clearbit.com/cisco.com",
  "PFE": "https://logo.clearbit.com/pfizer.com",
  "T": "https://logo.clearbit.com/att.com",
  "XOM": "https://logo.clearbit.com/exxon.com",
  "CVX": "https://logo.clearbit.com/chevron.com",
  "AMGN": "https://logo.clearbit.com/amgen.com",
  "TXN": "https://logo.clearbit.com/texasinst.com",
  "GILD": "https://logo.clearbit.com/gilead.com",
  "LLY": "https://logo.clearbit.com/eli‑lilly.com",
  "MMM": "https://logo.clearbit.com/3m.com",
  "GE": "https://logo.clearbit.com/ge.com",
  "BA": "https://logo.clearbit.com/boeing.com",
  "CAT": "https://logo.clearbit.com/caterpillar.com",
  "UPS": "https://logo.clearbit.com/ups.com",
  "MDT": "https://logo.clearbit.com/medtronic.com",
  "UNP": "https://logo.clearbit.com/unionpacific.com",
  "HON": "https://logo.clearbit.com/honeywell.com",
  "NKE": "https://logo.clearbit.com/nike.com",
  "WBA": "https://logo.clearbit.com/walgreensbootsalliance.com",
  "BLK": "https://logo.clearbit.com/blackrock.com",
  "SPGI": "https://logo.clearbit.com/spglobal.com",
  "TMUS": "https://logo.clearbit.com/t‑mobile.com"
  };

  if(cryptoLogos[symbol]) return cryptoLogos[symbol];
  if(stockLogos[symbol]) return stockLogos[symbol];
  return "https://via.placeholder.com/24";
}

function createRow(symbol){
  priceHistory[symbol]=[];

  const tr = document.createElement("tr");
  tr.id=`row-${symbol}`;

  
  const tdSymbol = document.createElement("td"); 
  const img = document.createElement("img");
  img.src = getLogoURL(symbol); img.alt=symbol; img.width=24; img.height=24;
  tdSymbol.appendChild(img);
  tdSymbol.appendChild(document.createTextNode(symbol.replace("BINANCE:","")));
  tr.appendChild(tdSymbol);

  
  const tdPrice = document.createElement("td"); tdPrice.id=`price-${symbol}`; tr.appendChild(tdPrice);
  
  const tdChange = document.createElement("td"); tdChange.id=`change-${symbol}`; tr.appendChild(tdChange);
  
  const tdPercent = document.createElement("td"); tdPercent.id=`percent-${symbol}`; tr.appendChild(tdPercent);
  
  const tdChart = document.createElement("td"); 
  const canvasPrice = document.createElement("canvas"); 
  canvasPrice.id=`chart-${symbol}`; canvasPrice.width=100; canvasPrice.height=40;
  tdChart.appendChild(canvasPrice); tr.appendChild(tdChart);

  stockTableBody.appendChild(tr);

  
  chartsPrice[symbol]=new Chart(canvasPrice.getContext("2d"),{
    type:"line",
    data:{ labels:[], datasets:[{data:[], borderColor:'#4caf50', borderWidth:2, fill:false, tension:0.3}]},
    options:{ responsive:false, plugins:{legend:{display:false}}, scales:{x:{display:false},y:{display:false}}}
  });
}


async function fetchStockData(){
  for(const symbol of stocks){
    try{
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      const data = await res.json();

      if(data.c){
        priceHistory[symbol].push(data.c);
        if(priceHistory[symbol].length>10) priceHistory[symbol].shift();
      }

      const priceEl = document.getElementById(`price-${symbol}`);
      const changeEl = document.getElementById(`change-${symbol}`);
      const percentEl = document.getElementById(`percent-${symbol}`);

      priceEl.textContent = data.c ? parseFloat(data.c).toFixed(2) : "-";

      const trend = (data.d>0) ? "↑" : (data.d<0) ? "↓" : "-";
      changeEl.textContent = data.d ? parseFloat(data.d).toFixed(2)+" "+trend : "-";
      changeEl.className = (data.d>=0)?"positive":"negative";

      percentEl.textContent = data.dp ? parseFloat(data.dp).toFixed(2)+"%" : "-";
      percentEl.className = (data.dp>=0)?"positive":"negative";

      
      chartsPrice[symbol].data.labels = priceHistory[symbol].map((_,i)=>i+1);
      chartsPrice[symbol].data.datasets[0].data = priceHistory[symbol];
      chartsPrice[symbol].data.datasets[0].borderColor = (data.d>=0)?'#4caf50':'#f44336';
      chartsPrice[symbol].update();

    }catch(err){console.error(`Hata ${symbol}:`,err);}
  }
}

fetchStockData();
setInterval(fetchStockData,30000);
