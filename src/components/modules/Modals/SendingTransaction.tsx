import React from 'react'
import { Modal, Text, Container, Loading } from '@nextui-org/react'

export type SendingTransactionModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: () => void
    children?: JSX.Element | JSX.Element[];

}

const SendingTransactionModal = ({ isVisible, onHide, onPress, children }: SendingTransactionModalProps) => {
  return (
    <Modal
      blur
      preventClose
      aria-labelledby='modal-title'
      open={isVisible}
      css={{ minWidth: '300px', m: '16px', p: '8px' }}
    >
      <Text b size={20}>
        Sending transaction...
      </Text>
      <Container css={{ p: '8px' }}>
        {children || (<Text>Waiting for confirmation...</Text>)}
      </Container>
      <Loading />
    </Modal>
  )
}

export default SendingTransactionModal
