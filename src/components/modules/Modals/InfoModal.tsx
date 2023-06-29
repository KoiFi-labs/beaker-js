import React from 'react'
import { Modal, Text, Container, Spacer } from '@nextui-org/react'

export type InfoModalProps = {
    isVisible: boolean,
    onHide: () => void,
    title: string,
    children: JSX.Element | JSX.Element[]

}

const InfoModal = ({ isVisible, onHide, title, children }: InfoModalProps) => {
  return (
    <Modal
      closeButton
      blur
      aria-labelledby='modal-title'
      open={isVisible}
      onClose={() => onHide()}
      css={{ minWidth: '300px', m: '16px', p: '8px', bc: '$kondorDark' }}
    >
      <Text b size={20}>
        {title}
      </Text>
      <Spacer y={1} />
      <Container display='flex' justify='flex-start' alignItems='center' css={{ padding: '8px' }}>
        {children}
      </Container>
    </Modal>
  )
}

export default InfoModal
