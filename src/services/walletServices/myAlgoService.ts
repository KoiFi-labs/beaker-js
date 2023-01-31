import MyAlgoWalletConnect from '@randlabs/myalgo-connect'

export const myAlgoService = {
  connect: async () => {
  const myAlgoWallet = window!== undefined ?  new MyAlgoWalletConnect() : null
    if(!myAlgoWallet) throw new Error('myAlgo not initialized')
    return myAlgoWallet
      .connect()
      .then(a => {console.log(a); return a})
      .then((accounts) => ({
            addr: accounts[0].address
        }))
    }
  }
