import { Text, Container, Switch, Grid } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import PoolsTable from '../../src/components/modules/Tables/PoolsTable'
import { getPools, PoolType } from '../../src/services/stablePoolService'

export default function Pool () {
  const [myPoolsFilter, setMyPoolsFilter] = useState(false)
  const [itemsToShow, setItemsToShow] = useState<PoolType[]>()

  useEffect(() => {
    const pools = getPools()
    if (myPoolsFilter) {
      setItemsToShow(pools.filter(p => p.myStake))
    } else {
      setItemsToShow(pools)
    }
  }, [myPoolsFilter])

  return (
    <Container css={{ p: '8px', mw: '992px' }}>
      <Grid.Container css={{ m: 0, p: 0 }}>
        <Grid xs={6} css={{ m: 0, p: 0, d: 'flex', flexDirection: 'column' }}>
          <Text h1 css={{ color: '$kondorGray' }}>Pool</Text>
          <Text h4 css={{ color: '$kondorGray' }}>Earn fees by providing liquidity.</Text>
        </Grid>
        <Grid xs={6} css={{ m: 0, p: 0, d: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Switch
            color='primary'
            checked={myPoolsFilter}
            onChange={() => { setMyPoolsFilter(!myPoolsFilter) }}
            css={{ color: '$kondorGray' }}
          />
          <Text css={{ color: '$kondorGray' }}>Show only my pools</Text>
        </Grid>
      </Grid.Container>
      {
        itemsToShow
          ? (<PoolsTable pools={itemsToShow} />)
          : null
      }
    </Container>
  )
}
