import React from 'react'
import { Modal, Text, Button, Container, Link, Tooltip, Spacer } from '@nextui-org/react'
import { config } from '../../../../config'
import { abbreviateTransactionHash, copyToClipboard } from '../../../../src/utils/utils'
import { ClipboardIcon } from '../../../../public/icons/clipboard'
import { IconButton } from '../../../../src/components/IconButton/IconButton'

export type SuccessfulTransactionModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: () => void,
    transactionId: string
}

const SuccessfulTransactionModal = ({ isVisible, onHide, onPress, transactionId }: SuccessfulTransactionModalProps) => {
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
      css={{ minWidth: '300px', m: '16px', p: '8px' }}
    >
      <Text b size={20}>
        Successful Transaction
      </Text>
      <Spacer y={1} />
      <Container display='flex' justify='flex-start' alignItems='center' css={{ padding: '8px' }}>
        <Tooltip content='Copy to clipboard'>
          <IconButton onClick={() => copyToClipboard(transactionId)}><ClipboardIcon /></IconButton>
        </Tooltip>
        <Spacer x={0.5} />
        <Text>Transaction ID: {abbreviateTransactionHash(transactionId)}</Text>
        <Link underline isExternal href={`${config.network.explorer}/tx/${transactionId}`} target='_blank' rel='noreferrer' css={{ color: '$primary' }}>
          View transaction on AlgoExplorer
        </Link>
      </Container>
      <Spacer y={0.5} />
      <Button
        bordered
        rounded
        css={{ borderColor: '$kondorPrimary', color: '$kondorLigth', minWidth: '136px', width: '100%' }}
        onPress={() => handleOkButton()}
      >
        Ok
      </Button>
    </Modal>
  )
}

export default SuccessfulTransactionModal
