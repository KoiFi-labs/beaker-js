import React, { createContext, useContext, useState } from 'react'
import MyAlgoWalletConnect from '@randlabs/myalgo-connect'

var MyAlgoContext = createContext({})

type Props = {
    children: JSX.Element | JSX.Element[];
};

export const MyAlgoProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {

  const loadMyAlgoWallet = () => {
    if (window!== undefined) {
      return new MyAlgoWalletConnect()
    } 
  }

  const [myAlgoAccountAddress, setMyAlgoAccountAddress] = useState([])
  const isConnectedToMyAlgoWallet = myAlgoAccountAddress?.length;

  const handleDisconnectMyAlgoWalletClick = () => {
    setMyAlgoAccountAddress([]);
  }

  const handleConnectMyAlgoWalletClick = () =>{
      loadMyAlgoWallet()?.connect()
      .then((newAccounts) => {
        console.log(newAccounts)
        setMyAlgoAccountAddress(newAccounts[0].address as unknown as never[]);
      });
  }
  return (
    <MyAlgoContext.Provider value={{ myAlgoAccountAddress, handleConnectMyAlgoWalletClick, handleDisconnectMyAlgoWalletClick, isConnectedToMyAlgoWallet }}>
    {children}
    </MyAlgoContext.Provider>
  )
}

export const useMyAlgo = (): any => useContext(MyAlgoContext)
