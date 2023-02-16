import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import WeaveDB from "weavedb-sdk";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

//replace these values below if necessary
const arweave_wallet = require("./wallet-mainnet.json");
const contractTxId = "gdZA53CmDBnxyeK437_4DtpbzW9qvXIKJZdYTaqyxDE";
const COLLECTION_NAME = "sample1";

let sdk;

export default function Home() {
  const [version, setVersion] = useState();

  useEffect(() => {
    (async () => {
      const _sdk = new WeaveDB({
        contractTxId,
      });
      sdk = _sdk;
      console.log("init WeaveDB..." + contractTxId);
      const addr = await sdk.arweave.wallets.jwkToAddress(arweave_wallet);
      console.log("addr", addr);
      await sdk.initializeWithoutWallet();
    })();
  }, []);

  const getVersion = async () => {
    const _version = await sdk.getVersion();
    setVersion(_version);
    console.log("WeaveDB version: " + _version);
  };

  const getCollection = async () => {
    const list = await sdk.get(COLLECTION_NAME);
    console.log(list);
  };

  const addDocEvm = async () => {
    const result = await sdk.add({ test1: "test1" }, COLLECTION_NAME);
    console.log("addDocEvm() result", result);
  };

  const addDocArweave = async () => {
    const result = await sdk.add({ test1: "test1" }, COLLECTION_NAME, {
      ar: arweave_wallet,
    });
    console.log("addDocArweave() result", result);
  };

  return (
    <>
      <div>Home</div>
      <div>
        <button onClick={getVersion}>getVersion</button>
      </div>
      <div>Version: {version}</div>
      <div>
        <button onClick={getCollection}>getCollection</button>
      </div>
      <div>
        <button onClick={addDocEvm}>addDocEvm</button>
      </div>
      <div>
        <button onClick={addDocArweave}>addDocArweave</button>
      </div>
    </>
  );
}
