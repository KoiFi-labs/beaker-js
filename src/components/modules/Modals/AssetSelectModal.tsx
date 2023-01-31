import React from 'react'
import { Modal, Text, Button, Divider } from '@nextui-org/react'
import { Asset } from '../../../../config/Assets'
import { config } from '../../../../config'

export type AssetSelectModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: (asset: Asset) => void
}

const AssetSelectModal = ({isVisible, onHide, onPress}: AssetSelectModalProps) => {

    const handleButton = (asset: Asset) => {
      onPress(asset)
      onHide()
  }

  return (
    <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={isVisible}
        onClose={() => onHide()}
        width={"270px"}
      >
        <Modal.Body>
          {config.assetList.map(a => (
            <div key={a.id}>
              <Button onPress={() => handleButton(a)} light css={{margin: 0, minHeight: "40px"}}>{a.symbol}</Button>
              <Divider/>
            </div>
          ))}
          
        </Modal.Body>
      </Modal>
  )
}

export default AssetSelectModal