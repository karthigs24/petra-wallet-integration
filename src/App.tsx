import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import { Types, AptosClient } from 'aptos';

// Create an AptosClient to interact with devnet.
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

function App() {
  const [find, setFind] = React.useState(false);
  // const [, set] = React.useState<string | null>(null);
  /** Convert string to hex-encoded utf-8 bytes. */
  function stringToHex(text: string) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
  }
  // Retrieve aptos.account on initial render and store it.
  const [address, setAddress] = React.useState<string | null>(null);
  // React.useEffect(() => {
  //   window.aptos.connect();
  //   window.aptos.account().then((data: { address: string }) => setAddress(data.address));
  // }, []);
  // Use the AptosClient to retrieve details about the account.
  const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  React.useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
    let sample = JSON.stringify(client.getAccount(address));
    console.log(sample);
  }, [address]);


  // Check for the module; show publish instructions if not present.
  const [modules, setModules] = React.useState<Types.MoveModuleBytecode[]>([]);
  console.log("modules", modules);
  React.useEffect(() => {
    if (!address) return;
    client.getAccountModules(address).then(setModules);
  }, [address]);

  modules.map(async(r, i) => {
    if (r.abi?.name === "message") {
      console.log("ok");
      // setFind(true);
      const message = "Mars";
      console.log(message);
      const transaction = {
        type: "entry_function_payload",
        function: `${address}::message::set_message`,
        arguments: [stringToHex(message)],
        type_arguments: [],
      };
      console.log("trans", transaction);

      try {
        // setIsSaving(true);
        await window.aptos.signAndSubmitTransaction(transaction);
      } finally {
        setIsSaving(false);
      }
    }
    console.log("map", r.abi?.name);
  });
  const transfer = () => {
    const message = "Mars";
    console.log(message);
    const transaction = {
      type: "entry_function_payload",
      function: `${address}::message::set_message`,
      arguments: [stringToHex(message)],
      type_arguments: [],
    };
    console.log("trans", transaction);
    const example = window.aptos.signAndSubmitTransaction(transaction);
    console.log("try", example);
    try {
      // setIsSaving(true);
      console.log("befor try");
      // const example = await window.aptos.signAndSubmitTransaction(transaction);
      // console.log("try", example);
    } catch (err) {
      // setIsSaving(false);
      console.log("catch", err);
    }
  }

  const hasModule = modules.some((m) => m.abi?.name === 'Message');
  console.log("sample", hasModule);
  const publishInstructions = (
    <pre>
      Run this command to publish the module:
      <br />
      aptos move publish --package-dir ~/aptos-core/aptos-move/move-examples/hello_blockchain --named-addresses hello_blockchain={address}
    </pre>
  );

  // Call set_message with the textarea value on submit.
  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);
  const handleSubmit = async (e: any) => {
    // e.preventDefault();
    if (!ref.current) return;

    const message = ref.current.value;
    console.log(message);
    const transaction = {
      type: "entry_function_payload",
      function: `0xab0adbde9f55f69f23ceb27198f179141ba681e81b1b507dd1a8e6f72e4e78a3::message::set_message`,
      arguments: [stringToHex(message)],
      type_arguments: [],
    };
    console.log(transaction);

    try {
      setIsSaving(true);
      await window.aptos.signAndSubmitTransaction(transaction);
    } finally {
      setIsSaving(false);
    }
  };

  // Get the message from account resources.
  const [resources, setResources] = React.useState<Types.MoveResource[]>([]);
  React.useEffect(() => {
    if (!address) return;
    client.getAccountResources(address).then(setResources);
  }, [address]);
  const resourceType = `${address}::message::MessageHolder`;
  const resource = resources.find((r) => r.type === resourceType);
  const data = resource?.data as { message: string } | undefined;
  const message = data?.message;

  // Retrieve aptos.account on initial render and store it.
  // const urlAddress = window.location.pathname.slice(1);
  // const isEditable = !urlAddress;
  // const [address, setAddress] = React.useState<string | null>(null);
  // React.useEffect(() => {
  //   if (urlAddress) {
  //     setAddress(urlAddress);
  //   } else {
  //     window.aptos.account().then((data: { address: string }) => setAddress(data.address));
  //   }
  // }, [urlAddress]);

  const btnhandler = () => {
    if ('aptos' in window) {
      window.aptos.connect();
      window.aptos.account().then((data: { address: string }) => setAddress(data.address));
      return window.aptos;
    } else {
      window.open('https://petra.app/', `_blank`);
    }
  };


  return (
    <div className="App">
      <Card className="text-center">
        <Card.Body>
          <Button onClick={() => btnhandler()} variant="primary">
            Connect to wallet
          </Button>
        </Card.Body>
      </Card>
      <p><code>{address}</code></p>
      <p><code>{account?.authentication_key}</code></p>
      {/* {!hasModule && publishInstructions} */}
      {find ? (
        <form onSubmit={handleSubmit}>
          <textarea ref={ref} />
          <input disabled={isSaving} type="submit" />
        </form>
      ) : publishInstructions}
      <Button onClick={() => handleSubmit("set_message")} variant="primary">
        submit
      </Button>
      <Button onClick={() => transfer()} variant="primary">
        trans
      </Button>
      {/* {hasModule ? (
        <form onSubmit={handleSubmit}>
          <textarea ref={ref} defaultValue={message} readOnly={!isEditable} />
          {isEditable && (<input disabled={isSaving} type="submit" />)}
          {isEditable && (<a href={address!}>Get public URL</a>)}
        </form>
      ) : publishInstructions} */}
      <textarea ref={ref} defaultValue={message} />
    </div>
  );
}

export default App;
