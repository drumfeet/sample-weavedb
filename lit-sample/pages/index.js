import { useState, useEffect } from "react"
import SDK from "weavedb-sdk"
import { Button, ChakraProvider } from "@chakra-ui/react"
import LitJsSdk from "@lit-protocol/sdk-browser"

let db, lit
export default function Home() {
  const [user, setUser] = useState(null)
  const [msgDecrypted, setMsgDecrypted] = useState()
  const [message, setMessage] = useState("this is a sample message")

  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "polygon",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ]

  const addNewMessage = async (encryptedData, encryptedSymmetricKey) => {
    const COLLECTION_NAME = "people"
    const docId = user.linkedAccount

    db.set(
      {
        date: db.ts(),
        user_address: db.signer(),
        lit: {
          encryptedData: encryptedData,
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            encryptedSymmetricKey,
            "base16"
          ),
          accessControlConditions: accessControlConditions,
        },
      },
      COLLECTION_NAME,
      docId,
      user
    )

    console.log("addNewMessage")
  }

  const handleEncrypt = async () => {
    lit = new LitJsSdk.LitNodeClient()
    await lit.connect()

    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "polygon",
    })

    console.log("message", message)
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      message
    )
    console.log("encryptedString", encryptedString)
    console.log("symmetricKey", symmetricKey)

    const encryptedSymmetricKey = await lit.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: "polygon",
    })

    const blobToDataURI = (blob) => {
      console.log("blobToDataURI blob", blob)
      return new Promise((resolve, reject) => {
        var reader = new FileReader()

        reader.onload = (e) => {
          var data = e.target.result
          resolve(data)
        }
        reader.readAsDataURL(blob)
      })
    }
    const encryptedData = await blobToDataURI(encryptedString)
    console.log("encryptedData", encryptedData)

    console.log("user", user)
    addNewMessage(encryptedData, encryptedSymmetricKey)

    console.log("handleBtnClick")
  }

  const handleDecrypt = async () => {
    const COLLECTION_NAME = "people"
    const docId = user.linkedAccount

    const tx = await db.get(COLLECTION_NAME, docId)
    console.log("tx", tx)
    const { encryptedData, encryptedSymmetricKey, accessControlConditions } =
      tx.lit
    console.log("encryptedData", encryptedData)
    console.log("encryptedSymmetricKey", encryptedSymmetricKey)
    console.log("accessControlConditions", accessControlConditions)

    lit = new LitJsSdk.LitNodeClient()
    await lit.connect()

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "polygon" })

    const symmetricKey = await lit.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain: "polygon",
      authSig,
    })
    console.log("symmetricKey", symmetricKey)

    const dataURItoBlob = (dataURI) => {
      var byteString = window.atob(dataURI.split(",")[1])
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      var blob = new Blob([ab], { type: mimeString })

      return blob
    }

    const decryptedString = await LitJsSdk.decryptString(
      dataURItoBlob(encryptedData),
      symmetricKey
    )
    console.log("decryptedString", decryptedString)
    setMsgDecrypted(decryptedString)
  }

  useEffect(() => {
    ;(async () => {
      db = await new SDK({
        contractTxId: "QLy7G0W_eBd2G61YquujxDCbfnbQE5Q9vXwUGhi4sTs",
      })
      await db.initializeWithoutWallet()
    })()
  }, [])

  return (
    <ChakraProvider>
      {user === null ? (
        <div
          onClick={async () => {
            const { identity } = await db.createTempAddress()
            setUser(identity)
          }}
        >
          Login
        </div>
      ) : (
        <>
          <Button onClick={handleEncrypt}>Encrypt Msg</Button>
          <br />
          <br />
          <Button onClick={handleDecrypt}>Decrypt Msg</Button>
          <br />
          <br />
          {msgDecrypted}
        </>
      )}
    </ChakraProvider>
  )
}
