import Transaction from 'algosdk/dist/types/transaction'
import { TransactionSigner } from 'algosdk/dist/types/signer'
import { peraService } from './walletServices/peraService'

export const mySigner:(addr: string) => Promise<TransactionSigner> = async (addr) => {
  return async (txnGroup: Transaction[], indexesToSign: number[]) => {
    const txsToSign = txnGroup.map((txn) => ({ txn, signers: [addr] }))
    return await peraService.signTransaction([txsToSign], addr)
  }
}
