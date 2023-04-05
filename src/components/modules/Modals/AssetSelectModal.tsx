import React from 'react'
import { Modal, Button, Divider, Image, Spacer, Container } from '@nextui-org/react'
import { Asset } from '../../../../config/Assets'
import { config } from '../../../../config'

export type AssetSelectModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: (asset: Asset) => void
}

const AssetSelectModal = ({ isVisible, onHide, onPress }: AssetSelectModalProps) => {
  const handleButton = (asset: Asset) => {
    onPress(asset)
    onHide()
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby='modal-title'
      open={isVisible}
      onClose={() => onHide()}
      width='270px'
    >
      <Modal.Body>
        {config.assetList.map(a => (
          <Container key={a.id} css={{ d: 'flex', justifyContent: 'flex-start' }}>
            <Button onPress={() => handleButton(a)} light css={{ d: 'flex', justifyContent: 'flex-start', minHeight: '40px', minWidth: '60px' }}>
              <Image
                src={a.icon}
                alt={`${a.symbol} logo`}
                css={{
                  height: '28px',
                  width: '28px',
                  maxWidth: '28px',
                  maxHeight: '28px',
                  borderRadius: '50%',
                  bgColor: '$white'
                }}
              />
              <Spacer y={1} />
              {a.symbol}
            </Button>
            <Divider />
          </Container>
        ))}
      </Modal.Body>
    </Modal>
  )
}

export default AssetSelectModal
