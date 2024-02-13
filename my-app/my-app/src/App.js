import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5063/stockTickerHub') // Ensure this matches your server configuration
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log('Connection started!');
        newConnection.on("ReceiveUpdate", (updatedSymbol, value) => {
          setSymbols(currentSymbols =>
            currentSymbols.map(sym => sym.name === updatedSymbol ? { ...sym, value } : sym)
          );
        });
      })
      .catch((error) => console.error('Connection failed: ', error));

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const addSymbol = () => {
    if (symbol && connection) {
      const newSymbol = { name: symbol, value: 0 };
      setSymbols([...symbols, newSymbol]);
      connection.invoke("Subscribe", symbol)
        .catch(err => console.error(err));
      setSymbol('');
    }
  };

  const removeSymbol = (symbolToRemove) => {
    setSymbols(symbols.filter(sym => sym.name !== symbolToRemove));
    if (connection) {
      connection.invoke("Unsubscribe", symbolToRemove)
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        value={symbol}
        onChange={e => setSymbol(e.target.value)}
        placeholder="Enter Symbol"
      />
      <button onClick={addSymbol}>Add Symbol</button>
      <div className="grid">
        <div className="grid-header">
          <div className="grid-header-item">Symbol</div>
          <div className="grid-header-item">Value</div>
          <div className="grid-header-item">Actions</div>
        </div>
        {symbols.map((sym, index) => (
          <div key={index} className="grid-row">
            <div className="grid-item">{sym.name}</div>
            <div className="grid-item">{sym.value.toFixed(2)}</div>
            <div className="grid-item">
              <button onClick={() => removeSymbol(sym.name)}>Close</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
