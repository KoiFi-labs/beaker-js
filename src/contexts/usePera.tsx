import React, { createContext, useContext, useEffect, useState } from 'react'
import { PeraWalletConnect } from '@perawallet/connect';


const PeraContext = createContext({})

type Props = {
    children: JSX.Element | JSX.Element[];
};

export const PeraProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const peraWallet = new PeraWalletConnect();
  const [accountAddress, setAccountAddress] = useState([])
  const isConnectedToPeraWallet = accountAddress?.length;



  const handleDisconnectWalletClick = () => {
    peraWallet.disconnect();
    setAccountAddress([]);

  }

  const handleConnectWalletClick = () =>{
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0] as unknown as never[]);
      }, (error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error)
        }
      });
  }

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
      if (accounts.length) setAccountAddress(accountAddress[0])
    });
  }, []);


  return (
    <PeraContext.Provider value={{ accountAddress, handleConnectWalletClick, handleDisconnectWalletClick, isConnectedToPeraWallet }}>
    {children}
    </PeraContext.Provider>
  )
}

export const usePera = (): any => useContext(PeraContext)
