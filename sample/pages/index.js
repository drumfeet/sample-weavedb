import { useEffect, useState } from "react";
import SDK from "weavedb-client";
// const SDK = require("weavedb-node-client")

let sdk;
const contractTxId = "f86Qw3vp6TlgxI3mABFnWDQNqR8mPVkVTBN04hwywqc";

export default function Home() {
  const [ok, setOK] = useState(false);
  const [version, setVersion] = useState();

  useEffect(() => {
    (async () => {
      sdk = new SDK({
        contractTxId,
        /**/
        // rpc: "localhost:8080",
        // rpc: "lb.weavedb-node.xyz:443",

        /**/
        rpc: "http://localhost:8080",
        // rpc: "http://lb.weavedb-node.xyz:80",
        // rpc: "https://lb.weavedb-node.xyz:443",
      });

      await sdk
        .getInfo()
        .then((result) => {
          setVersion(result.version);
          console.log(result.version);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <>
      <div>getInfo() version : {version}</div>
    </>
  );
}
