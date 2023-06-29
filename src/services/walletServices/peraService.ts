import { PeraWalletConnect } from '@perawallet/connect'
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels'
const peraWallet = new PeraWalletConnect()

export const peraService = {
  connect: async (handleDisconect: () => void) => {
    try {
      return peraWallet
        .connect()
        .then((accounts) => {
          peraWallet.connector?.on('disconnect', () => {
            handleDisconect()
          })
          return { addr: accounts[0] }
        })
    } catch (error) {
      console.log('error en connect...')
    }
  },
  signTransaction: async (txs: SignerTransaction[][], signerAddress?: string | undefined) => {
    return await peraWallet.signTransaction(txs, signerAddress)
  },
  disconnect: async () => {
    peraWallet.disconnect()
  },
  reconnectSession: async (handleDisconect: () => void) => {
    try {
      return peraWallet
        .reconnectSession()
        .then((accounts) => {
          peraWallet.connector?.on('disconnect', () => {
            handleDisconect()
          })
          return { addr: accounts[0] }
        })
    } catch (error) {
      console.log(error)
    }
  }
}
