import React from 'react'
import { Text, Card, Grid, Container } from '@nextui-org/react'
import { Asset } from '../../../config/Assets'
import { LightInput } from '../LightInput/LightInput'
import AssetSelect from '../AssetSelect/AssetSelect'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'

export type AssetSelectProps = {
    asset: Asset,
    input: {
      value: string
      bindings: {
        value: string;
        onChange: (event: BindingsChangeTarget) => void;
      }
    },
    onChange: (e: BindingsChangeTarget) => void,
    balance?: number,
    onPressAssetSelec: (a: Asset) => void
}

const AssetSelectCard = ({ asset, input, onChange, balance, onPressAssetSelec }: AssetSelectProps) => {
  return (
    <Card css={{ p: '16px', bgColor: '$kondorBlueCard' }}>
      <Grid.Container justify='center'>
        <Grid xs={6} css={{ d: 'flex', flexDirection: 'column' }}>
          <LightInput
            aria-label='Amount to buy'
            onChange={onChange}
            value={input.value}
            placeholder='0.00'
          />
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text size={14} css={{ color: '$kondorGray' }}>
              Balance {balance ? balance.toFixed(4) : 0} {asset.symbol}
            </Text>
          </Container>
        </Grid>
        <Grid xs={6} css={{ d: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <AssetSelect asset={asset} onPress={onPressAssetSelec} />
        </Grid>
      </Grid.Container>
    </Card>
  )
}

export default AssetSelectCard
