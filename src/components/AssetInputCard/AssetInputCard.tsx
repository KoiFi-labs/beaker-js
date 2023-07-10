import React from 'react'
import { Grid, Text, Card, Container } from '@nextui-org/react'
import { Asset } from '../../../config'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { LightInput } from '../LightInput/LightInput'
import { useWallet } from '../../contexts/useWallet'

const DECIMALS = 1000000
export type AssetInputCardProps = {
  asset: Asset,
  value:string,
  onChange: (event: BindingsChangeTarget) => void,
  label: string
}

const AssetInputCard = ({ asset, value, onChange, label }: AssetInputCardProps) => {
  const { getAssetBalance } = useWallet()

  return (
    <Card key={asset.id} css={{ bgColor: '$kondorBlueCard', m: '4px 0px' }}>
      <Grid.Container justify='center' css={{ p: '8px' }}>
        <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
          <Text>{label || `Add ${asset.symbol}`}</Text>
          <LightInput
            value={value}
            onChange={onChange}
            aria-label={label}
            placeholder='0.00'
          />
        </Grid>
        <Container display='flex' justify='flex-start' css={{ p: 0 }}>
          <Text size={14} css={{ color: '$kondorGray' }}>Balance {getAssetBalance(asset.id) / DECIMALS} {asset.symbol}</Text>
        </Container>
      </Grid.Container>
    </Card>
  )
}

export default AssetInputCard
