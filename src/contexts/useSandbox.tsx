import React, { createContext, useContext, useEffect, useState } from 'react'
import algosdk from "algosdk"
import ConnectWithSandboxModal from '../components/modules/Modals/ConnecWithSandboxModal';

const token = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const server = 'http://127.0.0.1';
const port = "4001";


const SandboxContext = createContext({})

type Props = {
  children: JSX.Element | JSX.Element[];
};

type Account = {
  addr: string,
  sk: number[]
}

export const SandboxProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const sandboxWallet = new algosdk.Algodv2(token, server, port);
  const [sandboxAccountAddress, setSandboxAccountAddress] = useState<Account | null>()
  const [connectWithSandboxModalIsVisble, setConnectWithSandboxModalIsVisible] = useState<boolean>(false)
  const [isConnectedToSandboxWallet, setIsConnectedToSandboxWallet] = useState<boolean>(false);


  const handleDisconnectSandboxWalletClick = () => {
    setSandboxAccountAddress(null);
    setIsConnectedToSandboxWallet(false)
  }

  const handleConnectSandboxWalletClick = () =>{
    setConnectWithSandboxModalIsVisible(true)
  }

  return (
    <SandboxContext.Provider value={{ sandboxAccountAddress, handleConnectSandboxWalletClick, handleDisconnectSandboxWalletClick, isConnectedToSandboxWallet, setSandboxAccountAddress, setIsConnectedToSandboxWallet }}>
      <ConnectWithSandboxModal isVisible={connectWithSandboxModalIsVisble} onHide={() => setConnectWithSandboxModalIsVisible(false)}/>
    {children}
    </SandboxContext.Provider>
  )
}

export const useSandbox = (): any => useContext(SandboxContext)
