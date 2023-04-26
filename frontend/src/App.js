import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dictionary, setDictionary] = useState({});
  const socket = new WebSocket('ws://localhost:8000/');
  useEffect(() => {
    socket.onmessage = function (event) {
      const receivedData = JSON.parse(event.data);
      console.log("RECIE", receivedData)
      setDictionary(receivedData.Binance.BTC);
    }
    return () => {
      socket.close();
    }
  }, [socket]);
  const sendMessage = () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("get_data");
    }
  };
  console.log(dictionary)
  return (
    <div className="App">
      <h1>Dictionary</h1>
      <button onClick={sendMessage}>jkes</button>
      <ul>
        Bid Price: {dictionary.Bid_Price}
        <br />
        Bid Quantity: {dictionary.Bid_Quantity}
        <br />
        Ask Price: {dictionary.Ask_Price}
        <br />
        Ask Quantity: {dictionary.Ask_Quantity}
      </ul>
    </div>
  );
}

export default App;
