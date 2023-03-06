/* eslint-disable no-unused-vars */
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
    if (account) {
      algoService.getBalances(account.addr).then((balances) => {
        setBalances(balances)
      })
    }
    setBalances([])
  }, [account, isConnected])

  const { handleConnectSandboxWalletClick, handleDisconnectSandboxWalletClick, sandboxAccountAddress } = useSandbox()

  const reloadBalances = () => {
    if (account) {
      algoService.getBalances(account.addr).then((balances) => {
        setBalances(balances)
      })
    }
  }

  useEffect(() => {
    if (sandboxAccountAddress) {
      setAccount(sandboxAccountAddress)
      setWalletProvider(walletProvider)
      setIsConnected(true)
    } else {
      setAccount(null)
      setIsConnected(false)
      setWalletProvider(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxAccountAddress])

  useEffect(() => {
    peraService
      .reconnectSession(handleDisconnectWalletClick)
      .then((acc) => {
        setWalletProvider(walletProvider)
        setAccount({ addr: acc.addr })
        setIsConnected(true)
      })
  }, [])

  const handleDisconnectWalletClick = () => {
    switch (walletProvider) {
      case WALLET_PROVIDER.PERA:
        peraService.disconnect()
        break
      case WALLET_PROVIDER.SANDBOX:
        handleDisconnectSandboxWalletClick()
        break
    }
    setAccount(null)
    setIsConnected(false)
    setWalletProvider(null)
  }

  const handleConnectWalletClick = async (walletProvider: WALLET_PROVIDER) => {
    switch (walletProvider) {
      case WALLET_PROVIDER.PERA: {
        const peraAccount = await peraService.connect(handleDisconnectWalletClick)
        setWalletProvider(walletProvider)
        setAccount(peraAccount)
        setIsConnected(true)
        break
      }
      case WALLET_PROVIDER.MY_ALGO: {
        const myAlgoAccount = await myAlgoService.connect()
        setWalletProvider(walletProvider)
        setAccount(myAlgoAccount)
        setIsConnected(true)
        break
      }
      case WALLET_PROVIDER.SANDBOX:
        handleConnectSandboxWalletClick()
        break
    }
  }

  return (
    <WalletContext.Provider value={{ account, handleConnectWalletClick, handleDisconnectWalletClick, isConnected, balances, reloadBalances }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): any => useContext(WalletContext)
