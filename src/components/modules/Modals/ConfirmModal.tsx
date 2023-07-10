import React from 'react'
import { Modal, Text, Button, Container, Grid, Spacer } from '@nextui-org/react'

export type ConfirmModalProps = {
    isVisible: boolean,
    onHide: () => void,
    title: string,
    onPress: () => void
    children: JSX.Element | JSX.Element[];
}

const ConfirmModal = ({ isVisible, onHide, title, onPress, children }: ConfirmModalProps) => {
  const handleConfirmButton = () => {
    onHide()
    onPress()
  }
  const handleCancelButton = () => {
    onHide()
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby='modal-title'
      open={isVisible}
      onClose={() => onHide()}
      css={{ minWidth: '300px', m: '16px', backgroundColor: '$kondorDark' }}
    >
      <Text b size={20}>
        {title}
      </Text>
      <Spacer y={1} />
      <Container>
        {children}
      </Container>
      <Grid.Container css={{ p: '8px' }}>
        <Grid xs={6}>
          <Button
            rounded
            bordered
            css={{
              borderColor: '$kondorPrimary',
              color: '$kondorLight',
              minWidth: '136px',
              width: '100%',
              m: '4px'
            }}
            onPress={() => handleCancelButton()}
          >
            Cancel
          </Button>
        </Grid>
        <Grid xs={6}>
          <Button
            bordered
            rounded
            css={{ borderColor: '$kondorPrimary', color: '$kondorLight', backgroundColor: '$kondorPrimary', minWidth: '136px', width: '100%', m: '4px' }}
            onPress={() => handleConfirmButton()}
          >
            Confirm
          </Button>
        </Grid>
      </Grid.Container>
    </Modal>
  )
}

export default ConfirmModal
