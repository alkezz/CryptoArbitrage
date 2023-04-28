import React, { useState, useEffect } from 'react';
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
function App() {
  const [binanceTickerData, setBinanceTickerData] = useState(null);
  const [gateioTickerData, setGateIoTickerData] = useState(null)
  const [bitfinexTickerData, setBitfinexTickerData] = useState(null)
  const [allCoins, setAllCoins] = useState(null)
  const [isClicked, setIsClicked] = useState(false)
  const getData = async () => {
    const binanceRes = await fetch('http://localhost:8000/coins')
    const binanceData = await binanceRes.json()
    setBinanceTickerData(binanceData.Binance)
    const gateIORes = await fetch('http://localhost:8000/gateio')
    const gateIOData = await gateIORes.json()
    setGateIoTickerData(gateIOData.GateIO)
    const bitfinexRes = await fetch('http://localhost:8000/bitfinex')
    const bitfinexData = await bitfinexRes.json()
    setBitfinexTickerData(bitfinexData)
  }
  console.log(bitfinexTickerData, "BITFINEX")
  useEffect(() => {
    const getAllCoins = async () => {
      const res = await fetch('http://localhost:8000/all-coins')
      const data = await res.json()
      setAllCoins(data)
    }
    getAllCoins()
  }, [])
  console.log(gateioTickerData)
  let mainEle
  let loadingEle
  if (!binanceTickerData) {
    if (isClicked)
      loadingEle = (
        <div>
          <CircularProgress />
        </div>
      )
  } else {
    mainEle = (
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>Coins</th>
              <th>Binance</th>
              <th>Gate.IO</th>
              <th>Bitfinex</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(allCoins).map((row, index) => {
              let binancePrice = 0;
              let gateIOPrice = 0;
              let bitfinexPrice = 0;
              if (binanceTickerData && gateioTickerData && bitfinexTickerData) {
                console.log("PRICE", bitfinexTickerData[`${row}USD`])
                binancePrice = binanceTickerData[row] ? binanceTickerData[row].askPrice : 0;
                gateIOPrice = gateioTickerData[row] ? gateioTickerData[row].price : 0
                bitfinexPrice = bitfinexTickerData[`${row}USD`] ? bitfinexTickerData[`${row}USD`].lastPrice : 0
              } else {
                binancePrice = <CircularProgress sx={{ color: "red" }} />
                gateIOPrice = <CircularProgress sx={{ color: "red" }} />
                bitfinexPrice = <CircularProgress sx={{ color: "red" }} />
              }
              return (
                <tr key={index}>
                  <td>{row}/USD</td>
                  <td>{binancePrice}</td>
                  <td>{gateIOPrice}</td>
                  <td>{bitfinexPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <>
      <br />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button className='get-data-button' id='get-data-button' onClick={(e) => { getData(); setIsClicked(true) }}>Get Data</button>
        <br />
        {loadingEle}
      </div>
      <br />
      <div className='main-container'>
        {mainEle}
      </div>
    </>
  )
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
}

export default App;
