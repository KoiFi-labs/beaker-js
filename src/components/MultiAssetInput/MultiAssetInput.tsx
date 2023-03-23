import React, { useState } from 'react'
import { Card, Container, Grid, Input, Text } from '@nextui-org/react'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { getPoolBySymbol, PoolType } from '../../../src/services/poolService'

export const MultiAssetInput = () => {
  const [balances, setBalances] = useState<Balance[]>([])

  const getBalanceFromPool = (pool: PoolType) => {
    const balance = balances.find(b => b.assetSymbol === pool.pool)
    return balance?.amount || 0
  }

  const PoolInput = (asset: string, value:string, onChange: (event: BindingsChangeTarget) => void, onSelect: (pool: PoolType) => void) => {
    const pool = getPoolBySymbol(asset)!
    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={8}>
            <Input {...{ value, onChange }} label={`Add ${asset}`} underlined placeholder='0.00' />
          </Grid>
          <Grid xs={4} css={{ d: 'flex', alignItems: 'center' }}>
            <PoolSelect pool={pool} onPress={onSelect} />
          </Grid>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text size={14} css={{ color: '$kondorGray' }}>Balance {getBalanceFromPool(pool)} {pool.pool}</Text>
          </Container>
        </Grid.Container>
      </Card>
    )
  }

  return (
    <div>MultiAssetInput</div>
  )
}
