import { Table, Text, Grid, User, Container, Card } from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Asset } from '../../../../config'
import { CustomButton } from '../../CustomButton/CustomButton'
import { TextButton } from '../../TextButton/TextButton'

const columns = [
  { name: 'ASSET', uid: 'asset' },
  { name: 'BALANCE', uid: 'balance' },
  { name: 'ID', uid: 'id' },
  { name: 'ACTIONS', uid: 'actions' }
]

export type TableItemType = Asset & {
  balance: number
}

export default function AssetsTable ({ items }: { items: TableItemType[] }) {
  const router = useRouter()
  const [viewAll, setViewAll] = useState<boolean>(false)
  const itemsToRender = viewAll ? items : items.slice(0, 5)

  const renderCell = (asset: TableItemType, columnKey: React.Key) => {
    switch (columnKey) {
      case 'asset':
        return (
          <Grid.Container css={{ maxWidth: '300px' }}>
            <Grid xs={12} sm={0}>
              <User size='xs' src={asset?.icon} name={asset.symbol} css={{ p: 0 }}>
                {asset.name}
              </User>
            </Grid>
            <Grid xs={0} sm={12}>
              <User src={asset?.icon} name={asset.symbol} css={{ p: 0 }}>
                {asset.name}
              </User>
            </Grid>
          </Grid.Container>
        )
      case 'id':
        return (
          <Text size={16} weight='bold' css={{ tt: 'capitalize', color: '$kondorTextGray' }}>
            {asset.id}
          </Text>
        )
      case 'balance':
        return (
          <Container css={{ d: 'flex', justifyContent: 'flex-start', p: 0 }}>
            <Text size={16} weight='bold' css={{ tt: 'capitalize' }}>
              {`${asset.balance / (Math.pow(10, asset.decimals))} ${asset.symbol}`}
            </Text>
          </Container>
        )
      case 'actions':
        return (
          <Container css={{ p: 0, d: 'flex', justifyContent: 'flex-end' }}>
            <CustomButton
              onPress={() => { router.push('./swap') }}
              css={{ maxWidth: '90px', minWidth: '50px' }}
            >
              Swap
            </CustomButton>
          </Container>
        )
      default:
        return <Text>default</Text>
    }
  }

  return (
    <Card css={{ bgColor: '$kondorBlueCard' }}>
      <Table
        aria-label='Assets table'
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
              hideHeader={column.uid === 'actions'}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={itemsToRender}>
          {(item: TableItemType) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <Container css={{ width: '100%', d: 'flex', justifyContent: 'flex-end', p: '0px 20px 8px 32px' }}>
        <TextButton
          text={viewAll ? 'Hide assets' : 'View all'}
          color='$kondorTextBlue'
          onPress={() => { setViewAll(!viewAll) }}
        />
      </Container>
    </Card>
  )
}
