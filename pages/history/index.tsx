import TransactionsTable from '../../src/components/modules/Tables/TransactionsTable'
import { Container, Spacer, Text } from '@nextui-org/react'
import useTransactions from '../../src/hooks/useTransactions'
import TableFilter from '../../src/components/modules/TableFilter/TableFilter'

export default function History () {
  const { transactions } = useTransactions()

  return (
    <Container css={{ p: '0', width: '100%', d: 'flex' }}>
      <Text h1>History</Text>
      <TableFilter />
      <Spacer />
      {transactions.length ? <TransactionsTable items={transactions} /> : null}
    </Container>
  )
}
