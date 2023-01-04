import React from 'react'
import { Modal, Text, Button } from '@nextui-org/react'
import { usePera } from '../../../contexts/usePera';
import { useMyAlgo } from '../../../contexts/useMyAlgo';
import { useSandbox } from '../../../contexts/useSandbox';

export type ConnectWalletModalProps = {
    isVisible: boolean,
    onHide: () => void
}
const ConnectWalletModal = ({isVisible, onHide}: ConnectWalletModalProps) => {
    const {handleConnectMyAlgoWalletClick } = useMyAlgo()
    const {handleConnectPeraWalletClick} = usePera()
    const {handleConnectSandboxWalletClick} = useSandbox()

    const handleButtonPera = () => {
        handleConnectPeraWalletClick()
        onHide()
    }

    const handleButtonMyAlgo = () => {
        handleConnectMyAlgoWalletClick()
        onHide()
    }

    const handleButtonSandbox = () => {
      handleConnectSandboxWalletClick()
      onHide()
  }

  return (
    <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={isVisible}
        onClose={() => onHide()}
      >
        <Modal.Header>
          <Text b id="modal-title" size={18}>
            Connect a Wallet 
          </Text>
        </Modal.Header>
        <Modal.Body>
            <Button 
                bordered 
                color="primary"
                onClick={handleButtonPera}
            >
                Connect with Pera
            </Button>
            <Button 
                bordered 
                color="primary"
                onClick={handleButtonMyAlgo}
                >
                Connect with MyAlgo
            </Button>
            <Button 
                bordered 
                color="primary"
                onClick={handleButtonSandbox}
                >
                Connect with Sandox
            </Button>
        </Modal.Body>
        <Modal.Footer>
          <Text>
            By connecting a wallet, you agree to the KoiFi Labs Terms of Service and agree to their Privacy Policy.
          </Text>
        </Modal.Footer>
      </Modal>
  )
}

export default ConnectWalletModal