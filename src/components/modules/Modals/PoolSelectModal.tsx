import React from 'react'
import { Modal, Button, Divider, Image, Container, Spacer } from '@nextui-org/react'
import { getPools, PoolType } from '../../../services/poolService'

export type PoolSelectModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: (pool: PoolType) => void
}

const PoolSelectModal = ({ isVisible, onHide, onPress }: PoolSelectModalProps) => {
  const pools = getPools()

  const handleButton = (pool: PoolType) => {
    onPress(pool)
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
        {pools.map(p => (
          <Container key={p.id} css={{ d: 'flex', justifyContent: 'flex-start' }}>
            <Button onPress={() => handleButton(p)} light css={{ d: 'flex', justifyContent: 'flex-start', minHeight: '40px', minWidth: '60px' }}>
              <Image
                src={p.icon!}
                alt={`${p.pool} logo`}
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
              {p.pool}
            </Button>
            <Divider />
          </Container>
        ))}
      </Modal.Body>
    </Modal>
  )
}

export default PoolSelectModal
