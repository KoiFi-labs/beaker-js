import React, { createContext, useContext, useState } from 'react'
import ConnectWithSandboxModal from '../components/modules/Modals/ConnecWithSandboxModal';

const SandboxContext = createContext({})

type Props = {
  children: JSX.Element | JSX.Element[];
};

type Account = {
  addr: string,
  sk: number[]
}

export const SandboxProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const [sandboxAccountAddress, setSandboxAccountAddress] = useState<Account | null>()
  const [connectWithSandboxModalIsVisble, setConnectWithSandboxModalIsVisible] = useState<boolean>(false)
  const [isConnectedToSandboxWallet, setIsConnectedToSandboxWallet] = useState<boolean>(false);


  const handleDisconnectSandboxWalletClick = () => {
    setSandboxAccountAddress(null);
    setIsConnectedToSandboxWallet(false)
  }

  console.log('isConnectedToSandboxWallet2', isConnectedToSandboxWallet)
  console.log('sandboxAccountAddress2', sandboxAccountAddress)

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
