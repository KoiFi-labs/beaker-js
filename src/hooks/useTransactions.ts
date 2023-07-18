import { useEffect, useState } from 'react'
import { useWallet } from '../contexts/useWallet'
import { getTransactions } from '../services/algoClient'
import { Transaction } from '../../interfaces'
const useTransactions = () => {
  const { account } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (account?.addr) {
      getTransactions(account.addr)
        .then(txs => setTransactions(txs))
    }
  }, [account])

  return { transactions }
}

export default useTransactions
