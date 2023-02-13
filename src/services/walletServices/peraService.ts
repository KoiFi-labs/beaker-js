import { PeraWalletConnect } from "@perawallet/connect";
const peraWallet = new PeraWalletConnect();

export const peraService = {
  connect: async () => {
    return peraWallet
      .connect()
      .then(a => {console.log(a); return a})
      .then((accounts) => ({
            addr: accounts[0]
        }))
    },
  disconnect: async () => {
    peraWallet.disconnect()
  }
}
