import { useState } from "react"
import { Button, Container, Text, Loading, Spacer } from "@nextui-org/react"
import { useSandbox } from "../../src/contexts/useSandbox"
import algosdk  from "algosdk";
import fs from "fs"
import { config } from "../../config"
import { getAccounts } from "../../src/services/sandbox";


export default function Home() {
    const { sandboxAccountAddress, isConnectedToSandboxWallet } = useSandbox()
    const [ appResponse, setAppResponse] = useState<string | null>()
    const [ txId, setTxId] = useState<string | null>()
    const [ loading, setLoading ] =  useState<boolean>(false)
    const acct = sandboxAccountAddress
    const client = new algosdk.Algodv2(config.network.token, config.network.server, config.network.port);

    const createAsset = async (assetName: string, unitName: string) => {
        const sp = client.getTransactionParams().do();
        let params = await client.getTransactionParams().do();
        let addr = acct.addr;
        let note = undefined;
        let assetMetadataHash = undefined;
        let defaultFrozen = false;
        let decimals = 6;
        let totalIssuance = 1000000000000;
        let assetURL = "http://someurl";
        let manager = acct.addr;
        let reserve = acct.addr;
        let freeze = acct.addr;
        let clawback = acct.addr;
        let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
            addr,
            note,
            totalIssuance,
            decimals,
            defaultFrozen,
            manager,
            reserve,
            freeze,
            clawback,
            unitName,
            assetName,
            assetURL,
            assetMetadataHash,
            params);

        let rawSignedTxn = txn.signTxn(acct.sk)
        let tx = (await client.sendRawTransaction(rawSignedTxn).do());
        let assetID = null;
        const ptx = await algosdk.waitForConfirmation(client, tx.txId, 2);
        assetID = ptx["asset-index"];
        return assetID;
    }



    const pondCall = async () => {
        //  setLoading(true)
          setAppResponse(null)
          setTxId(null)


        // const sp = await client.getTransactionParams().do();


        //     // Parse the json file into an object, pass it to create an ABIContract object
        //     const contract = new algosdk.ABIContract(buff);

        //     const appId = 20


        //     const commonParams = {
        //       appID: appId,
        //       sender: "WNOMN7MTAE3BH4N43S5DISYK3M7AWFVGTPV757A76WPVI3ZG4MDDYGMAYU",
        //       suggestedParams: sp,
        //       signer: algosdk.makeBasicAccountTransactionSigner(acct),
        //     };

        //     const comp = new algosdk.AtomicTransactionComposer();

        //     // create asset transfer transaction

        //     console.log("Creating asset transfer transaction")
        //     const assetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        //         from: "WNOMN7MTAE3BH4N43S5DISYK3M7AWFVGTPV757A76WPVI3ZG4MDDYGMAYU",
        //         to: "H6BBCRN4QVZCFSF4DQ7TT36GX66BJZTMLVK3ORJ6W5MXBQELQGPFB2XYGE",
        //         amount: 1000000,
        //         assetIndex: 17,
        //         suggestedParams: {...sp, fee: 1000},
        //     })
        //     console.log("Created asset transfer transaction", assetTransferTxn)

        //     // get account info


        //     comp.addMethodCall({
        //         method: contract.getMethodByName("swap"),
        //         methodArgs: [
        //           {
        //             txn: assetTransferTxn,
        //             signer: algosdk.makeBasicAccountTransactionSigner(acct),
        //           },
        //           17,
        //           18
        //         ],
        //         ...commonParams,
        //       });
        //     const results = await comp.execute(client, 2);
        //     for (const result of results.methodResults) {
        //         setAppResponse(result.returnValue as string)
        //         setTxId(result.txID)
        //     }
        //     setLoading(false)
    }




    return (
        <Container fluid display="flex" direction="column" alignItems="center" css={{height: "80vh"}}>
            <Spacer y={5}/>
            <Text h2>
            Let s test an app call to a local network
            </Text>
            {isConnectedToSandboxWallet ? <Text>Address:  {sandboxAccountAddress?.addr}</Text> : null }
            <Spacer y={3}/>

            {/* <Button onPress={helloAppCall} disabled={!isConnectedToSandboxWallet} bordered>
                {loading ? <Loading/> : "App call to Hello Beaker!"}
            </Button> */}

            <Button onPress={pondCall} disabled={!isConnectedToSandboxWallet} bordered>
                {loading ? <Loading/> : "Deploy pond!"}
            </Button>

            <Text h2 color="secondary">{appResponse}</Text>

            {txId ? <Text color="KondorPrimary">TransactionId: {txId}</Text> : null}

        </Container>
    )
}
