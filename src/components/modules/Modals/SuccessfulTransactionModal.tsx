import React from "react"
import { Modal, Text, Button, Container, Grid } from "@nextui-org/react"

    
export type SuccessfulTransactionModalProps = {
    isVisible: boolean,
    onHide: () => void,
    onPress: () => void
    children: JSX.Element | JSX.Element[];

}

const SuccessfulTransactionModal = ({isVisible, onHide, onPress, children}: SuccessfulTransactionModalProps) => {

    const handleOkButton = () => {
      onHide()
      onPress()
    }

  return (
    <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={isVisible}
        onClose={() => onHide()}
        css={{minWidth: "300px", m:"16px", p: "8px"}}
      >
        <Text b size={20}>
            Successful Transaction
        </Text>
        <Container css={{p:"8px"}}>
            {children}
        </Container>
            <Button
                css={{backgroundColor: "$kondorPrimary", minWidth: "136px", width: "100%"}}
                onPress={() => handleOkButton()}>
                    Ok
            </Button>
      </Modal>
  )
}

export default SuccessfulTransactionModal