import React from 'react'
import { Modal, Text, Container, Spacer } from '@nextui-org/react'
import { BiError } from 'react-icons/bi'
import { CustomButton } from '../../CustomButton/CustomButton'

export type ErrorModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: () => void,
    details: string
}

const ErrorModal = ({ isVisible, onHide, onPress, details }: ErrorModalProps) => {
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
      css={{ minWidth: '300px', m: '16px', p: '8px', bc: '$kondorDark', d: 'flex', width: '100%' }}
    >
      <Container css={{ alignItems: 'center', p: '8px', wordWrap: 'break-word' }}>
        <Container css={{ p: 0, d: 'flex', flexDirection: 'column', alignContent: 'center' }}>
          <BiError size={56} />
          <Text b size={20}>Error</Text>
        </Container>
        <Text>{details || 'There was an error processing your request.'}</Text>
      </Container>
      <Spacer y={0.5} />
      <CustomButton
        bordered
        rounded
        onPress={() => handleOkButton()}
      >
        Ok
      </CustomButton>
    </Modal>
  )
}

export default ErrorModal
