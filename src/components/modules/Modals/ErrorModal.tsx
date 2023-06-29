import React from 'react'
import { Modal, Text, Button, Container, Spacer } from '@nextui-org/react'
import { BiError } from 'react-icons/bi'

export type ErrorModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: () => void
}

const ErrorModal = ({ isVisible, onHide, onPress }: ErrorModalProps) => {
  const handleOkButton = () => {
    onHide()
    onPress()
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby='modal-title'
      open={isVisible}
      onClose={() => onHide()}
      css={{ minWidth: '300px', m: '16px', p: '8px', bc: '$kondorDark' }}
    >
      <Container css={{ d: 'flex', flexDirection: 'column', alignItems: 'center', p: '8px' }}>
        <BiError size={56} />
        <Text b size={20}>Error</Text>
        <Text>There was an error processing your request.</Text>
      </Container>
      <Spacer y={0.5} />
      <Button
        bordered
        rounded
        css={{ borderColor: '$kondorPrimary', color: '$kondorLigth', minWidth: '136px', width: '100%', bc: '$black' }}
        onPress={() => handleOkButton()}
      >
        Ok
      </Button>
    </Modal>
  )
}

export default ErrorModal
