import algosdk from 'algosdk'

const kmdToken = 'a'.repeat(64)
const kmdHost = 'http://localhost'
const kmdPort = '4002'
const kmdWallet = 'unencrypted-default-wallet'
const kmdPassword = ''

export async function getAccounts (): Promise<algosdk.Account[]> {
  const kmdClient = new algosdk.Kmd(kmdToken, kmdHost, kmdPort)

  const wallets = await kmdClient.listWallets()

  let walletId
  for (const wallet of wallets.wallets) {
    if (wallet.name === kmdWallet) walletId = wallet.id
  }

  if (walletId === undefined) throw Error('No wallet named: ' + kmdWallet)

  const handleResp = await kmdClient.initWalletHandle(walletId, kmdPassword)
  const handle = handleResp.wallet_handle_token

  const addresses = await kmdClient.listKeys(handle)
  const acctPromises = []
  for (const addr of addresses.addresses) {
    acctPromises.push(kmdClient.exportKey(handle, kmdPassword, addr))
  }
  const keys = await Promise.all(acctPromises)

  // Don"t need to wait for it
  kmdClient.releaseWalletHandle(handle)

  return keys.map((k) => {
    const addr = algosdk.encodeAddress(k.private_key.slice(32))
    const acct = { sk: k.private_key, addr } as algosdk.Account
    return acct
  })
}
