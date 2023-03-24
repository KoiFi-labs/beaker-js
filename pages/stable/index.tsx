import { Text, Container, Grid, Card } from '@nextui-org/react'
import Link from 'next/link'
import { LinkButton } from '../../src/components/LinkButton/LinkButton'
import React from 'react'
import ItemDetailCard from '../../src/components/ItemDetailCard/ItemDetailCard'
import { abbreviateNumber } from '../../src/utils/utils'
import { BiTransfer, BiDollar, BiCalculator, BiData } from 'react-icons/bi'
import { FaCoins } from 'react-icons/fa'
import { AiOutlineGlobal } from 'react-icons/ai'

export default function Pool () {
  const pool = {
    pool: 'USDC/USDT',
    total: 1200420,
    volume: 562330,
    apr: 12
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
          <Text h1>USD Stable</Text>
          <Text h4>Provide liquidity and earn fees.</Text>
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
          <Link href='/stable/addLiquidity'>
            <LinkButton css={{ p: '16px' }}>
              Add liquidity
            </LinkButton>
          </Link>
        </Grid>
      </Grid.Container>
      <Card css={{
        p: '16px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Grid.Container>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='Stable pool'
              value='USDC/USDT'
              icon={<FaCoins size={40} />}
              m={8}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='Total liquidity'
              value={`$${abbreviateNumber(pool.total)}`}
              icon={<AiOutlineGlobal size={40} />}
              m={8}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='Volume 24H'
              value={`$${abbreviateNumber(1532)}`}
              icon={<BiData size={40} />}
              m={8}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='Fees 24H'
              value={`$${abbreviateNumber(pool.volume * 0.003)}`}
              icon={<BiDollar size={40} />}
              m={8}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='Transactions 24H'
              value='12.3K'
              icon={<BiTransfer size={40} />}
              m={8}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <ItemDetailCard
              title='APR'
              value={`${pool.apr} %`}
              icon={<BiCalculator size={40} />}
              m={8}
            />
          </Grid>
        </Grid.Container>
      </Card>
    </Container>
  )
}
