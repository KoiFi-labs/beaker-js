import styles from '../../styles/Home.module.css'
import { Button,  Spacer, Text, Badge, Container } from '@nextui-org/react'
import algosdk from "algosdk"
import { useEffect, useState } from 'react';
import AccountCreatedModal from '../../src/components/modules/Modals/AccountCreatedModal';
import { useSandbox } from '../../src/contexts/useSandbox';

const token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const server = 'http://127.0.0.1';
const port = "4001";
const client = new algosdk.Algodv2(token, server, port);


export default function Sandbox() {

    const [sandboxStatus, setSanboxStatus] = useState('disconnected')
    const [account, setAccount] = useState('')
    const [seed, setSeed] = useState([])
    const [accountCreatedModalVisible, setAccountCreatedModalVisible] = useState<boolean>(false)
    const { sandboxAccountAddress } = useSandbox()


    const handlerCreateWallet = (): void => {
        createAccount()
        setAccountCreatedModalVisible(true)
      }

    const verifySanboxStatus = async() => {
        try{
            await client.healthCheck().do()
            setSanboxStatus('success')
        }catch(error){
            setSanboxStatus('error')
        }
    }

    verifySanboxStatus()

    const isConnected = () => {
        return sandboxStatus === "success"
    }



    const createAccount = function() {
        try {  
            const myaccount = algosdk.generateAccount();
            console.log("Account Address = " + myaccount.addr);
            setAccount(myaccount.addr)
            let accountMnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
            console.log("Account Mnemonic = "+ accountMnemonic);
            setSeed(accountMnemonic.split(" ") as unknown as never[])
            return myaccount;
        }
        catch (err) {
            console.log("err", err);
        }
    };


    const getBalance = async () => {
        const res = await client.accountInformation(sandboxAccountAddress).do()
        console.log(res)
        return res
    }
    

    return (
        <div className={styles.container}>
        <main className={styles.main}>
            <Text h1 color="#ff4ecd"> Welcome to the Sandbox! </Text>
            <Button onClick={verifySanboxStatus}>Verify sandbox connection status</Button>
            <Spacer/>

            <Text>Sandbox connection status:   
                {isConnected() ? 
                    <Badge color="secondary">{sandboxStatus}</Badge> :
                    <Badge color="error">{sandboxStatus}</Badge>
                }
            </Text>
            <Spacer/>

            <Button onClick={handlerCreateWallet}>Create account</Button>
            <AccountCreatedModal isVisible={accountCreatedModalVisible} account={account} seed={seed} onHide={()=>{}} />

            {
                sandboxAccountAddress?.length ?  
                <Container>
                    <Text>Connected to: {sandboxAccountAddress + getBalance()}</Text>
                </Container>: 
                null
            }

        </main>
        </div>
    )
}