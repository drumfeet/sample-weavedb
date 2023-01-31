import { useEffect } from "react";
// import SDK from "weavedb-client";
const SDK = require("weavedb-node-client")

let sdk;
const contractTxId = "SMVDZ9jRXO7Kb88D4rByayB3HbwzXYzzbaPJ9DnrB_s";

export default function Home() {
  useEffect(() => {
    (async () => {
      sdk = new SDK({
        contractTxId,

        /**/
        rpc: "localhost:8080",
        // rpc: "lb.weavedb-node.xyz:443",


        /**/
        // rpc: "http://localhost:8080",
        // rpc: "http://lb.weavedb-node.xyz:80",
        // rpc: "https://lb.weavedb-node.xyz:443",
      });
      console.log(sdk);

      await sdk
        .getInfo()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return <>Home</>;
}
