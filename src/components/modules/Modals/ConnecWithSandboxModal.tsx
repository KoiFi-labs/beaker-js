import React, {useState} from 'react'
import { Modal, Text, Button, Input } from '@nextui-org/react'
import { useSandbox } from '../../../contexts/useSandbox'
import algoSdk from "algosdk"

export type ConnectWithSandboxModalProps = {
    isVisible: boolean,
    onHide: () => void
}
const ConnectWithSandboxModal = ({isVisible, onHide}: ConnectWithSandboxModalProps) => {
  const {setAccountAddress} = useSandbox()
    
  const handleSubmit = () => {
    const address = algoSdk.mnemonicToSecretKey("hundred repeat excuse stadium year reopen inmate cherry pelican check lady sell lazy weekend route comic because atom fatal dizzy dinner gain behind able antique")
    setAccountAddress([address.addr])
    console.log(address)
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
            Connect a Sandbox Wallet  
          </Text>          
        </Modal.Header>
        <Modal.Body>
          <Input 
            bordered 
            label="Mnemonic"
            placeholder='Enter the 25 words separated by a space'
            id="inputConnectWithSandboxModal"
            >
          </Input>
          <Button size={"sm"} onPress={() => handleSubmit()}>
            Connect
          </Button>
        </Modal.Body>
      </Modal>
  )
}

export default ConnectWithSandboxModal