import React, { createContext, useContext, useEffect, useState } from 'react'
import { peraService } from '../services/walletServices/peraService'
import { myAlgoService } from '../services/walletServices/myAlgoService'
import { useSandbox } from './useSandbox'
import { algoService, Balance } from '../services/algoService'

const WalletContext = createContext({})

type Props = {
    children: JSX.Element | JSX.Element[];
};

export enum WALLET_PROVIDER {
    PERA = 'pera',
    MY_ALGO = 'myAlgo',
    SANDBOX = 'sandbox'
}

export type Account = {
    addr: string,
    sk?: Uint8Array
}



export const WalletProvider: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const [account, setAccount] = useState<Account | null>(null)
  const [walletProvider, setWalletProvider] = useState<WALLET_PROVIDER | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balance[]>([])



  useEffect(() => {
    if(account){
        algoService.getBalances(account.addr).then((balances) => {
          setBalances(balances)
        })
    }
    setBalances([])
  }, [account])

  
  const { handleConnectSandboxWalletClick, handleDisconnectSandboxWalletClick, sandboxAccountAddress } = useSandbox()

  useEffect(() => {
    if(sandboxAccountAddress){
      setAccount(sandboxAccountAddress),
      setWalletProvider(walletProvider),
      setIsConnected(true)
    } else {
      setAccount(null)
      setIsConnected(false)
      setWalletProvider(null)
    }
  }, [sandboxAccountAddress])

  const handleDisconnectWalletClick = () => {
    switch(walletProvider){
        case WALLET_PROVIDER.PERA:
            peraService.disconnect()
        case WALLET_PROVIDER.SANDBOX:
            handleDisconnectSandboxWalletClick()
    }
    setAccount(null)
    setIsConnected(false)
    setWalletProvider(null)
  }

  const handleConnectWalletClick = async (walletProvider: WALLET_PROVIDER) => {
        switch(walletProvider){
            case WALLET_PROVIDER.PERA:
                const peraAccount = await peraService.connect()
                setWalletProvider(walletProvider)
                setIsConnected(true)
                setAccount(peraAccount)
            case WALLET_PROVIDER.MY_ALGO:
                const myAlgoAccount = await myAlgoService.connect()
                setWalletProvider(walletProvider)
                setIsConnected(true)
                setAccount(myAlgoAccount)
            case WALLET_PROVIDER.SANDBOX:
              handleConnectSandboxWalletClick()
        }
  }

  return (
    <WalletContext.Provider value={{ account, handleConnectWalletClick, handleDisconnectWalletClick, isConnected, balances }}>
    {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): any => useContext(WalletContext)
