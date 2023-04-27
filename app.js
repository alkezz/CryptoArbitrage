const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const PORT = 8000;
const cors = require('cors')
const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const axios = require('axios')

app.use(cors())
app.get('/coins', (req, res) => {
    axios.get('https://api.binance.us/api/v3/exchangeInfo')
        .then(response => {
            const coins = response.data.symbols.filter(symbol => symbol.quoteAsset === 'USD')
                .map(symbol => symbol.baseAsset);
            const promises = coins.map(coin => {
                return axios.get(`https://api.binance.us/api/v3/ticker/24hr?symbol=${coin}USD`)
                    .then(response => response.data);
            });
            Promise.all(promises)
                .then(data => {
                    const tickerData = { Binance: {} };
                    data.forEach((coinData, index) => {
                        const coin = coins[index];
                        tickerData.Binance[coin] = coinData;
                    });
                    res.json(tickerData);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Error fetching ticker data');
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error fetching coin list');
        });
});

app.listen(PORT, () => {
    console.log('Server started on port 8000');
});
// const priceObj = {
//     "Binance": {
//         "BTC": {
//             "Best_Bid_Price": 0,
//             "Best_Bid_Quantity": 0,
//             "Best_Ask_Price": 0,
//             "Best_Ask_Quantity": 0
//         },
//         "ETH": {
//             "Best_Bid_Price": 0,
//             "Best_Bid_Quantity": 0,
//             "Best_Ask_Price": 0,
//             "Best_Ask_Quantity": 0
//         },
//     },
//     "Coinbase": {
//         "Bid_Price": 0,
//         "Bid_Quantity": 0,
//         "Ask_Price": 0,
//         "Ask_Quantity": 0
//     },
//     "Gate": {
//         "Bid_Price": 0,
//         "Bid_Quantity": 0,
//         "Ask_Price": 0,
//         "Ask_Quantity": 0
//     }
// };

// wss.on('connection', (socket) => {
//     console.log("Successfully connected")

//     socket.on('message', (message) => {
//         try {
//             const data = JSON.parse(message);
//             const { get_prices } = data;

//             if (get_prices === true) {
//                 const binanceWs = new WebSocket('wss://stream.binance.us:9443/ws/btcusd@bookTicker');
//                 const ethWs = new WebSocket('wss://stream.binance.us:9443/ws/ethusd@bookTicker');
//                 ethWs.on('message', (data) => {
//                     try {
//                         const ethData = JSON.parse(data);
//                         priceObj.Binance.ETH.Best_Bid_Price = ethData.b;
//                         priceObj.Binance.ETH.Best_Bid_Quantity = ethData.B;
//                         priceObj.Binance.ETH.Best_Ask_Price = ethData.a;
//                         priceObj.Binance.ETH.Best_Ask_Quantity = ethData.A;
//                         // socket.send(JSON.stringify(priceObj));
//                         ethWs.close();
//                     } catch (error) {
//                         console.error(error);
//                     }
//                 });
//                 binanceWs.on('message', (data) => {
//                     try {
//                         const binanceData = JSON.parse(data);
//                         priceObj.Binance.BTC.Best_Bid_Price = binanceData.b;
//                         priceObj.Binance.BTC.Best_Bid_Quantity = binanceData.B;
//                         priceObj.Binance.BTC.Best_Ask_Price = binanceData.a;
//                         priceObj.Binance.BTC.Best_Ask_Quantity = binanceData.A;
//                         socket.send(JSON.stringify(priceObj));
//                         binanceWs.close();
//                     } catch (error) {
//                         console.error(error);
//                     }
//                 });
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     });

//     socket.on('close', () => {
//         console.log('WebSocket client disconnected');
//     });
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
