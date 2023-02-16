import React from 'react'
import { Modal, Button, Divider } from '@nextui-org/react'
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
          <div key={p.id}>
            <Button onPress={() => handleButton(p)} light css={{ margin: 0, minHeight: '40px' }}>{p.pool}</Button>
            <Divider />
          </div>
        ))}

      </Modal.Body>
    </Modal>
  )
}

export default PoolSelectModal
