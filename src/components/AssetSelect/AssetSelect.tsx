import React, { useState } from 'react'
import { Button, Spacer, Image, Text } from '@nextui-org/react'
import { Asset } from '../../../config/Assets'
import AssetSelectModal from '../modules/Modals/AssetSelectModal'
import { RiArrowDropDownLine } from 'react-icons/ri'

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
      <Button onPress={handlerButton} rounded bordered css={{ d: 'flex', width: 'auto', minWidth: '80px', p: '8px' }}>
        <Image src={asset.icon} alt={`${asset.symbol} logo`} css={{ height: '28px', width: '28px', maxWidth: '28px', borderRadius: '50%', bgColor: '$white' }} />
        <Spacer x={0.5} />
        <Text size={16}>{asset.symbol}</Text>
        <RiArrowDropDownLine size={36} />
      </Button>
      <AssetSelectModal isVisible={assetSelectModalVisible} onPress={onPress} onHide={() => { setAssetSelectModalVisible(false) }} />
    </>
  )
}

export default AssetSelect
