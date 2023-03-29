import { Text, Grid, Button, Spacer } from '@nextui-org/react'
import React from 'react'
import ItemDetailCard from '../../src/components/ItemDetailCard/ItemDetailCard'
import { abbreviateNumber } from '../../src/utils/utils'
import { BiTransfer, BiDollar, BiCalculator, BiData } from 'react-icons/bi'
import { FaCoins } from 'react-icons/fa'
import { AiOutlineGlobal } from 'react-icons/ai'
import { useRouter } from 'next/router'

export default function Stable () {
  const router = useRouter()
  const pool = {
    pool: 'USDC/USDT',
    total: 1200420,
    volume: 562330,
    apr: 12
  }

  const data = [
    {
      title: 'Stable pool',
      value: 'USDC/USDT',
      icon: <FaCoins size={40} />
    },
    {
      title: 'APR',
      value: `${pool.apr} %`,
      icon: <BiCalculator size={40} />
    },
    {
      title: 'Total liquidity',
      value: `$${abbreviateNumber(pool.total)}`,
      icon: <AiOutlineGlobal size={40} />
    },
    {
      title: 'Volume 24H',
      value: `$${abbreviateNumber(1532)}`,
      icon: <BiData size={40} />
    },
    {
      title: 'Fees 24H',
      value: `$${abbreviateNumber(pool.volume * 0.003)}`,
      icon: <BiDollar size={40} />
    },
    {
      title: 'Transactions 24H',
      value: '12.3K',
      icon: <BiTransfer size={40} />
    }
  ]

  return (
    <>
      <Grid.Container>
        <Grid
          xs={12} sm={9} css={{
            d: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text h1>USD Stable</Text>
          <Text h4>Provide liquidity and earn fees.</Text>
        </Grid>
        <Grid
          xs={12} sm={3} css={{
            d: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Button
            rounded
            bordered
            css={{
              width: '100%',
              color: '$white',
              bgColor: '$black',
              borderColor: '$kondorPrimary',
              zIndex: 1,
              m: '4px 0px'
            }}
            onPress={() => { router.push('/stable/addLiquidity') }}
          >
            Add liquidity pool
          </Button>
          <Button
            rounded
            bordered
            css={{
              width: '100%',
              color: '$white',
              bgColor: '$black',
              borderColor: '$kondorPrimary',
              zIndex: 1,
              m: '4px 0px'
            }}
            onPress={() => { router.push('/stable/myPosition') }}
          >
            My position
          </Button>
        </Grid>
      </Grid.Container>
      <Spacer y={2} />
      <Grid.Container>
        {data.map((item, index) => (
          <Grid xs={12} sm={4} md={2} key={index}>
            <ItemDetailCard title={item.title} value={item.value} icon={item.icon} m={8} />
          </Grid>
        ))}
      </Grid.Container>
    </>
  )
}
