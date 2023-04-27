import React, { useState, useEffect } from 'react';
import axios from 'axios'
function App() {
  const [binanceTickerData, setBinanceTickerData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('http://localhost:8000/coins')
      const data = await res.json()
      console.log("DATA", data)
      setBinanceTickerData(data.Binance)
    }
    getData()
  }, []);
  console.log(binanceTickerData)
  if (!binanceTickerData) return null
  return (
    <div style={{ backgroundColor: "rgb(20,20,20)", color: "white" }}>
      <table>
        <thead>
          <tr>
            <th>Coins</th>
            <th>Binance</th>
            &nbsp;
            &nbsp;
            &nbsp;
            &nbsp;
            <th>Coinbase</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(binanceTickerData).map(row => (
            <tr>
              <td>{row}/USD</td>
              <td>{binanceTickerData[row].askPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    // <>
    //   <div style={{ display: "flex" }}>
    //     <h2>Binance</h2>
    //     {tickerData && Object.keys(tickerData).map(coin => (
    //       <>
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         <div key={coin} style={{ border: "1px solid black", height: "fit-content", padding: "8px" }}>
    //           <h2>{coin}</h2>
    //           <p>Ask Price: {tickerData[coin].askPrice}</p>
    //           <p>Ask Quantity: {tickerData[coin].askQty}</p>
    //           <p>Bid Price: {tickerData[coin].bidPrice}</p>
    //           <p>Bid Quantity: {tickerData[coin].bidQty}</p>
    //           <p>Volume: {tickerData[coin].volume}</p>
    //           <p>24h Change: {tickerData[coin].priceChangePercent}%</p>
    //         </div>
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //         &nbsp;
    //       </>
    //     ))}
    //     <h1>Gate.IO</h1>
    //   </div>
    //   <div style={{ display: "flex" }}>
    //     <h2>Coinbase</h2>
    //   </div>
    //   <div style={{ display: "flex" }}>
    //     <h2>Gate.IO</h2>
    //   </div>
    // </>
  );
}

export default App;
