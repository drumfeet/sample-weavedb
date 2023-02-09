import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import WeaveDB from "weavedb-sdk";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });
const arweave_wallet = require("./wallet-mainnet.json")

export default function Home() {
  useEffect(() => {
    (async () => {
      const db = new WeaveDB({
        wallet: arweave_wallet,
        contractTxId: "gdZA53CmDBnxyeK437_4DtpbzW9qvXIKJZdYTaqyxDE",
      });

      await db.initializeWithoutWallet();
    })();
  }, []);

  return (
    <>
      <div>Home</div>
    </>
  );
}
