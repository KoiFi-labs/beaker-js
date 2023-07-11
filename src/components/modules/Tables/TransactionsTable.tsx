import { Table, Text, Card } from '@nextui-org/react'
import React from 'react'
import { Transaction } from '../../../../interfaces'
import { abbreviateTransaction, abbreviateAddress } from '../../../utils/utils'

const columns = [
  { name: 'txID', uid: 'txId' },
  { name: 'AMOUNT', uid: 'amount' },
  { name: 'FROM', uid: 'sender' },
  { name: 'TO', uid: 'receiver' },
  { name: 'ASSET', uid: 'asset' }
]

export default function TransactionsTable ({ items }: { items: Transaction[] }) {
  const renderCell = (tx: Transaction, columnKey: React.Key) => {
    switch (columnKey) {
      case 'txId':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {abbreviateTransaction(tx.txId)}
          </Text>
        )
      case 'asset':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.asset}
          </Text>
        )
      case 'sender':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {abbreviateAddress(tx.sender)}
          </Text>
        )
      case 'receiver':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {abbreviateAddress(tx.receiver)}
          </Text>
        )
      case 'amount':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.amount}
          </Text>
        )
      default:
        return <Text>default</Text>
    }
  }

  console.log(items)
  return (
    <Card css={{ bgColor: '$kondorBlueCard' }}>
      <Table
        aria-label='Transactions table'
        headerLined
        shadow={false}
        lined
        css={{
          height: 'auto',
          minWidth: '100%',
          p: 0,
          zIndex: 2,
          bgColor: 'none'
        }}
        selectionMode='none'
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              align='start'
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={items}>
          {(item: Transaction) => (
            <Table.Row key={item.txId}>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Card>
  )
}
