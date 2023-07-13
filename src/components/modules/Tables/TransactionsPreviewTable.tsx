import { Table, Text, Container } from '@nextui-org/react'
import React, { useState } from 'react'
import { TransactionPreview } from '../../../../interfaces'
import { abbreviateTransaction } from '../../../utils/utils'
import { TextButton } from '../../TextButton/TextButton'

const columns = [
  { name: 'ROW', uid: 'row' },
  { name: 'TO', uid: 'to' },
  { name: 'AMOUNT', uid: 'amount' },
  { name: 'ASSET ID', uid: 'assetId' },
  { name: 'TAGS', uid: 'tags' }
]

export default function TransactionsPreviewTable ({ items }: { items: TransactionPreview[] }) {
  const [viewAll, setViewAll] = useState<boolean>(false)
  const itemsToRender = viewAll ? items : items.slice(0, 7)

  const renderCell = (tx: TransactionPreview, columnKey: React.Key) => {
    switch (columnKey) {
      case 'to':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {abbreviateTransaction(tx.to)}
          </Text>
        )
      case 'assetId':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.assetId === 0 ? 'ALGO' : tx.assetId}
          </Text>
        )
      case 'tags':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.tags}
          </Text>
        )
      case 'amount':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.amount}
          </Text>
        )
      case 'row':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {tx.row}
          </Text>
        )
      default:
        return <Text>default</Text>
    }
  }

  return (
    <Container css={{ bgColor: '$kondorBlueCard', p: 0, borderRadius: '16px' }}>
      <Table
        aria-label='Transactions preview table'
        headerLined
        shadow={false}
        lined
        css={{
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
        <Table.Body
          items={itemsToRender}
        >
          {(item: TransactionPreview) => (
            <Table.Row key={item.row}>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Container css={{ width: '100%', d: 'flex', justifyContent: 'flex-end', p: '0px 20px 8px 32px' }}>
        <TextButton
          text={viewAll ? 'Hide transactions' : 'View all'}
          color='$kondorTextBlue'
          onPress={() => { setViewAll(!viewAll) }}
        />
      </Container>
    </Container>
  )
}
