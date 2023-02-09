import React, {useState} from 'react'
import { Modal, Text, Button, Input, useInput } from '@nextui-org/react'
import { useSandbox } from '../../../contexts/useSandbox'
import algoSdk from "algosdk"

export type ConnectWithSandboxModalProps = {
    isVisible: boolean,
    onHide: () => void
}
const ConnectWithSandboxModal = ({isVisible, onHide}: ConnectWithSandboxModalProps) => {
  const {setSandboxAccountAddress, setIsConnectedToSandboxWallet} = useSandbox()
    
  const handleSubmit = () => {
    const account = algoSdk.mnemonicToSecretKey(value)
    setSandboxAccountAddress(account)
    onHide()
    setIsConnectedToSandboxWallet(true)
    reset()

  }

  const {value, bindings, reset} = useInput("");


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
            Connect a Sandbox Wallet  
          </Text>          
        </Modal.Header>
        <Modal.Body>
          <Input 
            {...bindings}
            bordered 
            label="Mnemonic"
            placeholder='Enter the 25 words separated by a space'
            id="inputConnectWithSandboxModal"
            >
            </Input>
          <Button size={"sm"} onPress={handleSubmit} css={{background: "$kondorPrimary"}}>
            Connect
          </Button>
        </Modal.Body>
      </Modal>
  )
}

export default ConnectWithSandboxModal