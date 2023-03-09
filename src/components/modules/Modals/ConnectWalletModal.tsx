import React from 'react'
import { Modal, Text, Button } from '@nextui-org/react'
import { useWallet, WALLET_PROVIDER } from '../../../contexts/useWallet'

export type ConnectWalletModalProps = {
    isVisible: boolean,
    onHide: () => void
}

const ConnectWalletModal = ({ isVisible, onHide }: ConnectWalletModalProps) => {
  const { handleConnectWalletClick } = useWallet()

  const handleButton = (walletProvider: WALLET_PROVIDER) => {
    handleConnectWalletClick(walletProvider)
    onHide()
  }
  return (
    <Modal
      closeButton
      blur
      aria-labelledby='modal-title'
      open={isVisible}
      onClose={() => onHide()}
    >
      <Modal.Header>
        <Text b id='modal-title' size={18}>
          Connect a Wallet
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Button
          bordered
          rounded
          css={{ borderColor: '$kondorPrimary', color: '$kondorLigth' }}
          onPress={() => handleButton(WALLET_PROVIDER.PERA)}
        >
          Connect with Pera
        </Button>
        <Button
          bordered
          rounded
          css={{ borderColor: '$kondorPrimary', color: '$kondorLigth' }}
          onPress={() => handleButton(WALLET_PROVIDER.MY_ALGO)}
        >
          Connect with MyAlgo
        </Button>
        <Button
          bordered
          rounded
          css={{ borderColor: '$kondorPrimary', color: '$kondorLigth', bc: '$black' }}
          onPress={() => handleButton(WALLET_PROVIDER.SANDBOX)}
        >
          Connect with Sandbox
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Text>
          By connecting a wallet, you agree to the Kondor Labs Terms of Service and agree to their Privacy Policy.
        </Text>
      </Modal.Footer>
    </Modal>
  )
}

export default ConnectWalletModal
