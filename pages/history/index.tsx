import TransactionsTable from '../../src/components/modules/Tables/TransactionsTable'
import { Container, Spacer } from '@nextui-org/react'
import useTransactions from '../../src/hooks/useTransactions'
import TableFilter from '../../src/components/modules/TableFilter/TableFilter'

export default function Home () {
  const { transactions } = useTransactions()

  return (
    <Container css={{ p: '16px', width: '100%', d: 'flex' }}>
      <TableFilter />
      <Spacer />
      {transactions.length ? <TransactionsTable items={transactions} /> : null}
    </Container>
  )
}
