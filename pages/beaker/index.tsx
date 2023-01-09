import { useState } from 'react'
import { Button, Container, Text, Loading, Spacer } from '@nextui-org/react'
import { useSandbox } from '../../src/contexts/useSandbox'
import fs from "fs"


import algosdk, { decodeAddress, Transaction } from "algosdk";

const algod_token =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algod_host = "http://127.0.0.1";
const algod_port = "4001";



export default function Home() {
    const { sandboxAccountAddress, isConnectedToSandboxWallet } = useSandbox()
    const [ appResponse, setAppResponse] = useState<string | null>()
    const [ txId, setTxId] = useState<string | null>()
    const [ loading, setLoading ] =  useState<boolean>(false)

    const helloAppCall = async () => {
            // Create a client to communicate with local node
          setLoading(true)
          setAppResponse(null)
          setTxId(null)
          const client = new algosdk.Algodv2(algod_token, algod_host, algod_port);
          
            // Get account from sandbox
          const acct = sandboxAccountAddress 

            // Read in the local contract.json file
            const buff = {
                "name": "HelloBeaker",
                "methods": [
                    {
                        "name": "hello",
                        "args": [
                            {
                                "type": "string",
                                "name": "name"
                            }
                        ],
                        "returns": {
                            "type": "string"
                        }
                    }
                ],
                "networks": {}
            }          
            // Parse the json file into an object, pass it to create an ABIContract object
            const contract = new algosdk.ABIContract(buff);
          
            const appId = 2
          
            const sp = await client.getTransactionParams().do();
            const commonParams = {
              appID: appId,
              sender: acct.addr,
              suggestedParams: sp,
              signer: algosdk.makeBasicAccountTransactionSigner(acct),
            };
          
            const comp = new algosdk.AtomicTransactionComposer();

            comp.addMethodCall({
              method: contract.getMethodByName("hello"),
              methodArgs: ["Koifi"],
              ...commonParams,
            });

            const results = await comp.execute(client, 2);
            for (const result of results.methodResults) {
                setAppResponse(result.returnValue as string)
                setTxId(result.txID)
            }
            setLoading(false)
    }


    return (
        <Container fluid display="flex" direction="column" alignItems="center" css={{height: "80vh"}}>
            <Spacer y={5}/>
            <Text h2>
            Let's test an app call to a local network
            </Text> 
            {isConnectedToSandboxWallet ? <Text>Address:  {sandboxAccountAddress?.addr}</Text> : null }
            <Spacer y={3}/>

            <Button onPress={helloAppCall} disabled={!isConnectedToSandboxWallet} bordered>
                {loading ? <Loading/> : "App call to Hello Beaker!"} 
            </Button>
                
            <Text h2 color="secondary">{appResponse}</Text>
            
            {txId ? <Text color="primary">TransactionId: {txId}</Text> : null}
               
        </Container>
    )
}
