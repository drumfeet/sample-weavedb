import { useEffect, useState } from "react";
import SDK from "weavedb-client";
// const SDK = require("weavedb-node-client")

let clientGetOwner = 1;
let clientGetInfo = 1;
let clientGetVersion = 1;
let getDataNft = 0;
let sdk;
const contractTxId = "gdZA53CmDBnxyeK437_4DtpbzW9qvXIKJZdYTaqyxDE";

export default function Home() {
  const [ok, setOK] = useState(false);
  const [owner, setOwner] = useState();
  const [info, setInfo] = useState();
  const [version, setVersion] = useState();

  useEffect(() => {
    (async () => {
      sdk = new SDK({
        contractTxId,
        rpc: "https://grpc.weavedb-node.xyz",
      });

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
        console.log("getVersion()", await sdk.getVersion());
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
