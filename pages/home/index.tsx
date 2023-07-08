import { Text, Grid, Spacer, User, Table, Switch, Container } from '@nextui-org/react'
import { Asset, config } from '../../config'
import { CustomButton } from '../../src/components/CustomButton/CustomButton'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const columns = [
  { name: 'ASSET', uid: 'asset' },
  { name: 'BALANCE', uid: 'balance' },
  { name: 'ID', uid: 'id' },
  { name: 'ACTIONS', uid: 'actions' }
]

const assets = config.assetList

type TableItemType = Asset & {
  balance: number
}

const defaultItem = {
  id: 0,
  name: '',
  icon: '',
  symbol: '',
  balance: 0,
  decimals: 6
}

export default function Home () {
  const { balances }: { balances: Balance[]} = useWallet()
  const [tableItems, setTableItems] = useState<TableItemType[]>([defaultItem])
  const [hideZeroBalance, setHideZeroBalance] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const assetsWithBalance = assets.map(asset => {
      const balance = balances.find(a => a.assetId === asset.id)?.amount || 0
      return { ...asset, balance }
    })
    hideZeroBalance ? setTableItems(assetsWithBalance.filter(a => a.balance > 0)) : setTableItems(assetsWithBalance)
  }, [balances, hideZeroBalance])

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
          <Text size={14} css={{ tt: 'capitalize' }}>
            {asset.id}
          </Text>
        )
      case 'balance':
        return (
          <Container css={{ d: 'flex', justifyContent: 'flex-start', p: 0 }}>
            <Text size={14} css={{ tt: 'capitalize' }}>
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
              Trade
            </CustomButton>
          </Container>
        )
      default:
        return <Text>default</Text>
    }
  }

  return (
    <div>
      <Grid.Container>
        <Grid
          xs={12} sm={9} css={{
            d: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text h1>Home</Text>
          <Text h4>Visualize your portfolio of assets in detail.</Text>
        </Grid>
      </Grid.Container>
      <Spacer y={2} />
      <Container css={{ p: 0, d: 'flex', justifyContent: 'flex-end' }}>
        <Text> Hide zero balance assets</Text>
        <Spacer x={0.5} />
        <Switch checked={hideZeroBalance} onChange={() => { setHideZeroBalance(!hideZeroBalance) }} />
      </Container>
      <Spacer y={1.5} />
      <Table
        aria-label='Example table with custom cells'
        css={{
          height: 'auto',
          minWidth: '100%',
          p: 0,
          zIndex: 2
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
        <Table.Body items={tableItems}>
          {(item: TableItemType) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  )
}
