import { Table, Text, Row, Col, Tooltip } from '@nextui-org/react'
import React from 'react'
import { IconButton } from '../../../../src/components/IconButton/IconButton'
import { DeleteIcon } from '../../../../public/icons/DeleteIcon'
import Link from 'next/link'
import { Product } from '../../../../interfaces'
import { useRouter } from 'next/router'

export default function ProductsTable ({ products } : { products: Product[] }) {
  const router = useRouter()
  const columns = [
    { name: 'PRODUCT', uid: 'name' },
    { name: 'MY STAKE', uid: 'value' },
    { name: 'ACTIONS', uid: 'actions' }
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

      case 'actions':
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Link href={'/product/delete/' + myProduct.id} legacyBehavior>
                <a onClick={() => {}}>
                  <Tooltip content='Remove NFT product liquidity'>
                    <IconButton>
                      <DeleteIcon size={20} fill='#FF0080' />
                    </IconButton>
                  </Tooltip>
                </a>
              </Link>
            </Col>
          </Row>
        )
    }
  }

  return (
    <Table
      aria-label='Example table with custom cells'
      css={{
        height: 'auto',
        minWidth: '100%',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);',
        m: '16px 0',
        borderRadius: '16px'
      }}
      selectionMode='single'
      onSelectionChange={(key: Object) => { router.push(`product/${Object.values(key)[0]}`) }}
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === 'actions'}
            align={column.uid === 'actions' ? 'center' : 'start'}
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
