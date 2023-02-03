import { useEffect, useState } from "react";
import SDK from "weavedb-client";
// const SDK = require("weavedb-node-client")

let clientGetOwner = 1;
let clientGetInfo = 1;
let clientGetVersion = 0;
let getDataNft = 0;
let sdk;
const contractTxId = "SMVDZ9jRXO7Kb88D4rByayB3HbwzXYzzbaPJ9DnrB_s";

export default function Home() {
  const [ok, setOK] = useState(false);
  const [owner, setOwner] = useState();
  const [info, setInfo] = useState();
  const [version, setVersion] = useState();

  useEffect(() => {
    (async () => {
      sdk = new SDK({
        contractTxId,
        /*weavedb-node-client*/
        // rpc: "localhost:8080",
        // rpc: "lb.weavedb-node.xyz:443",

        /*weavedb-client*/
        rpc: "http://localhost:8080",
        // rpc: "http://lb.weavedb-node.xyz:80",
        // rpc: "https://lb.weavedb-node.xyz:443",
      });

      const list = await sdk.get("nft", ["tokenID", "desc"], true);
      console.log(list);

      if (clientGetOwner) {
        setOwner(await sdk.getOwner());
      }

      if (clientGetInfo) {
        await sdk
          .getInfo()
          .then((result) => {
            setVersion(result.version);
            console.log("getInfo()", result);
          })
          .catch((err) => {
            console.log("getInfo()", err);
          });
      }

      if (clientGetVersion) {
        await sdk.getVersion();
      }

      if (getDataNft) {
        const list = await sdk.get("nft", ["tokenID", "desc"], true);
        console.log(list);
      }
    })();
  }, []);

  return (
    <>
      <div>getOwner() owner : {owner}</div>
      <div>getInfo() version : {version}</div>
    </>
  );
}
