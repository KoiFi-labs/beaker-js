import { Table, Text, Container, Row, Col, Tooltip, Grid } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { IconButton } from '../../src/components/IconButton/IconButton'
import { DeleteIcon } from '../../public/icons/DeleteIcon'
import { ChartIcon } from '../../public/icons/ChartIcon'
import Link from 'next/link'
import { getProducts } from '../../src/services/mock'
import { LinkButton } from '../../src/components/LinkButton/LinkButton'
import { Product } from '../../interfaces'

export default function MyProducts () {
  const [myProducts, setMyProducts] = React.useState<Product[]>([])

  useEffect(() => {
    const fetchMyProducts = async () => {
      const myProducts = await getProducts()
      setMyProducts(myProducts)
    }
    fetchMyProducts()
  }, [])

  const columns = [
    { name: 'PRODUCT', uid: 'name' },
    { name: 'MY STAKE', uid: 'value' },
    { name: 'ACTIONS', uid: 'actions' }
  ]

  const renderCell = (myProduct: Product, columnKey: React.Key) => {
    const cellValue = myProduct[columnKey as keyof Product]
    switch (columnKey) {
      case 'name':
      case 'value':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {Array.isArray(cellValue) ? cellValue.map(p => p.symbol).join(' / ') : cellValue}
          </Text>
        )

      case 'actions':
        return (
          <Row justify='center' align='center'>
            <Col css={{ d: 'flex' }}>
              <Link href={'/product/details/' + myProduct.id} legacyBehavior>
                <a onClick={() => {}}>
                  <Tooltip content='Details'>
                    <IconButton>
                      <ChartIcon size={20} fill='#979797' />
                    </IconButton>
                  </Tooltip>
                </a>
              </Link>
            </Col>
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
    <Container css={{ p: '0', mw: '992px' }}>
      <Grid.Container css={{ p: '8px' }}>
        <Grid
          xs={12} md={8} css={{
            d: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            '@sm': {
              alignItems: 'flex-start'
            }
          }}
        >
          <Text h1 css={{ color: '$kondorGray' }}>MyProducts</Text>
          <Text h4 css={{ color: '$kondorGray' }}>Manage your products</Text>
        </Grid>
        <Grid
          xs={12} md={4} css={{
            m: 0,
            p: 0,
            d: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '@sm': {
              justifyContent: 'flex-end'
            }
          }}
        >
          <Link href='/product/create'>
            <LinkButton css={{ p: '8px' }}>
              Create new product
            </LinkButton>
          </Link>
        </Grid>
      </Grid.Container>
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
        selectionMode='none'
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
        <Table.Body items={myProducts}>
          {(item: Product) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}
