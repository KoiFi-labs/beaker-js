import React, { createContext, useContext, useEffect, useState } from 'react'
import { PeraWalletConnect } from '@perawallet/connect';


const PeraContext = createContext({})

type Props = {
    children: JSX.Element | JSX.Element[];
};

export const PeraProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const peraWallet = new PeraWalletConnect();
  const [peraAccountAddress, setAccountAddress] = useState([])
  const isConnectedToPeraWallet = peraAccountAddress?.length;

  const handleDisconnectPeraWalletClick = () => {
    peraWallet.disconnect();
    setAccountAddress([]);

  }

  const handleConnectPeraWalletClick = () =>{
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectPeraWalletClick);
        setAccountAddress(newAccounts[0] as unknown as never[]);
      }, (error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error)
        }
      });
  }

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      peraWallet.connector?.on("disconnect", handleDisconnectPeraWalletClick);
      if (accounts.length) setAccountAddress(peraAccountAddress[0])
    });
  }, []);


  return (
    <PeraContext.Provider value={{ peraAccountAddress, handleConnectPeraWalletClick, handleDisconnectPeraWalletClick, isConnectedToPeraWallet }}>
    {children}
    </PeraContext.Provider>
  )
}

export const usePera = (): any => useContext(PeraContext)
