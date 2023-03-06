import { PeraWalletConnect } from '@perawallet/connect'
import { SignerTransaction } from '@perawallet/connect/dist/util/model/peraWalletModels'
const peraWallet = new PeraWalletConnect()

export const peraService = {
  connect: async (handleDisconect: () => void) => {
    return peraWallet
      .connect()
      .then((accounts) => {
        peraWallet.connector?.on('disconnect', () => {
          handleDisconect()
        })
        return { addr: accounts[0] }
      })
  },
  signTransaction: async (txs: SignerTransaction[][], signerAddress?: string | undefined) => {
    return await peraWallet.signTransaction(txs, signerAddress)
  },
  disconnect: async () => {
    peraWallet.disconnect()
  },
  reconnectSession: async (handleDisconect: () => void) => {
    return peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector?.on('disconnect', () => {
          handleDisconect()
        })
        return { addr: accounts[0] }
      })
  }
}
