import React, { useState } from 'react'
import { Button, Grid, Image, Text, Avatar } from '@nextui-org/react'
import { Asset } from '../../../config/Assets'
import AssetSelectModal from '../modules/Modals/AssetSelectModal'

export type AssetSelectProps = {
    asset: Asset,
    onPress: (asset: Asset) => void
}

const AssetSelect = ({ asset, onPress }: AssetSelectProps) => {
  const [assetSelectModalVisible, setAssetSelectModalVisible] = useState<boolean>(false)

  const handlerButton = (): void => {
    setAssetSelectModalVisible(true)
  }

  return (
    <>
      <Button onPress={handlerButton} rounded css={{ minWidth: '40px', width: '100px', background: '$gray300', maxWidth: '95px', padding: 0 }}>
        <Grid.Container css={{ padding: 0, width: '100%' }}>
          <Grid xs={3} css={{ padding: '8px 0px 0px 0px' }}>
            <Avatar size='xs' src={asset.icon} />
          </Grid>
          <Grid xs={6} css={{ padding: '5px' }}>
            <Text size={15}>{asset.symbol}</Text>
          </Grid>
          <Grid xs={3} css={{ padding: '5px' }}>
            <Image alt='icon' src='https://cdn-icons-png.flaticon.com/512/32/32195.png' css={{ maxWidth: '10px' }} />
          </Grid>
        </Grid.Container>
      </Button>
      <AssetSelectModal isVisible={assetSelectModalVisible} onPress={onPress} onHide={() => { setAssetSelectModalVisible(false) }} />
    </>
  )
}

export default AssetSelect
