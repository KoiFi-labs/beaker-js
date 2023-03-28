import { Text, Container, Grid, Button } from '@nextui-org/react'
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

  return (
    <Container css={{ p: '8px', mw: '992px' }}>
      <Grid.Container css={{ p: '8px' }}>
        <Grid
          xs={12} sm={10} css={{
            d: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text h1>USD Stable</Text>
          <Text h4>Provide liquidity and earn fees.</Text>
        </Grid>
        <Grid
          xs={12} sm={2} css={{
            d: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
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
              zIndex: 1
            }}
            onPress={() => { router.push('/stable/addLiquidity') }}
          >
            Add liquidity pool
          </Button>
        </Grid>
      </Grid.Container>
      <Grid.Container>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='Stable pool'
            value='USDC/USDT'
            icon={<FaCoins size={40} />}
            m={8}
          />
        </Grid>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='APR'
            value={`${pool.apr} %`}
            icon={<BiCalculator size={40} />}
            m={8}
          />
        </Grid>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='Total liquidity'
            value={`$${abbreviateNumber(pool.total)}`}
            icon={<AiOutlineGlobal size={40} />}
            m={8}
          />
        </Grid>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='Volume 24H'
            value={`$${abbreviateNumber(1532)}`}
            icon={<BiData size={40} />}
            m={8}
          />
        </Grid>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='Fees 24H'
            value={`$${abbreviateNumber(pool.volume * 0.003)}`}
            icon={<BiDollar size={40} />}
            m={8}
          />
        </Grid>
        <Grid xs={12} sm={4} md={2}>
          <ItemDetailCard
            title='Transactions 24H'
            value='12.3K'
            icon={<BiTransfer size={40} />}
            m={8}
          />
        </Grid>
      </Grid.Container>
    </Container>
  )
}
