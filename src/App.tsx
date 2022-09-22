import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import { Types, AptosClient } from 'aptos';

// Create an AptosClient to interact with devnet.
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

function App() {
  // Retrieve aptos.account on initial render and store it.
  const [address, setAddress] = React.useState<string | null>(null);
  React.useEffect(() => {
    window.aptos.connect();
    window.aptos.account().then((data: { address: string }) => setAddress(data.address));
  }, []);
  // Use the AptosClient to retrieve details about the account.
  const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  React.useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);


  const btnhandler = () => {
    if ('aptos' in window) {
      return window.aptos;
    } else {
      window.open('https://petra.app/', `_blank`);
    }
  };

  return (
    <div className="App">
      <Card className="text-center">
        <Card.Body>
          <Button onClick={btnhandler} variant="primary">
            Connect to wallet
          </Button>
        </Card.Body>
      </Card>
      <p><code>{address}</code></p>
      <p><code>{account?.authentication_key}</code></p>
    </div>
  );
}

export default App;
