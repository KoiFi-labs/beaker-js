import { Table, Text } from '@nextui-org/react'
import React from 'react'
import { Product } from '../../../../interfaces'
import { useRouter } from 'next/router'

export default function ProductsTable ({ products } : { products: Product[] }) {
  const router = useRouter()
  const columns = [
    { name: 'MY INVESTMENT PRODUCT', uid: 'name' },
    { name: 'VALUE', uid: 'value' }
  ]

  const renderCell = (myProduct: Product, columnKey: React.Key) => {
    const cellValue = myProduct[columnKey as keyof Product]
    switch (columnKey) {
      case 'name':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {cellValue.toString()}
          </Text>
        )
      case 'value':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {Number(cellValue).toFixed(4).toString()}
          </Text>
        )
    }
  }

  return (
    <Table
      aria-label='Example table with custom cells'
      css={{
        height: 'auto',
        minWidth: '100%',
        zIndex: 2
      }}
      bordered
      selectionMode='single'
      onSelectionChange={(key: Object) => { router.push(`product/${Object.values(key)[0]}`) }}
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
      <Table.Body items={products}>
        {(item: Product) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
