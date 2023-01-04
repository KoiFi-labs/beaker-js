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

export const SandboxProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const sandboxWallet = new algosdk.Algodv2(token, server, port);
  const [sandboxAccountAddress, setAccountAddress] = useState([])
  const [connectWithSandboxModalIsVisble, setConnectWithSandboxModalIsVisble] = useState(false)
  const isConnectedToSandboxWallet = sandboxAccountAddress?.length;

  const handleDisconnectSandboxWalletClick = () => {
    setAccountAddress([]);
  }

  const handleConnectSandboxWalletClick = () =>{
    setConnectWithSandboxModalIsVisble(true)
  }



  return (
    <SandboxContext.Provider value={{ sandboxAccountAddress, handleConnectSandboxWalletClick, handleDisconnectSandboxWalletClick, isConnectedToSandboxWallet, setAccountAddress }}>
      <ConnectWithSandboxModal isVisible={connectWithSandboxModalIsVisble} onHide={() => {}}/>
    {children}
    </SandboxContext.Provider>
  )
}

export const useSandbox = (): any => useContext(SandboxContext)
