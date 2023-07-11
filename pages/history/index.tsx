import TransactionsTable from '../../src/components/modules/Tables/TransactionsTable'
import { Container } from '@nextui-org/react'
import useTransactions from '../../src/hooks/useTransactions'

export default function Home () {
  const { transactions } = useTransactions()

  return (
    <Container css={{ p: '16px', width: '100%', d: 'flex' }}>
      {transactions.length ? <TransactionsTable items={transactions} /> : null}
    </Container>
  )
}
