import React from "react"
import { Modal, Text, Card, Badge, Container } from "@nextui-org/react"

export type AccountCreatedModalProps = {
    isVisible: boolean,
    onHide: () => void,
    seed: string[],
    account: string
}
const AccountCreatedModal = ({isVisible, onHide, seed, account}: AccountCreatedModalProps) => {

    const handleButtonPera = () => {
        onHide()
    }

    const CardSeed = ({keys}: {keys: string[]}) => {
      return (
        <Card >
          <Card.Body>
            <Text h6 size={15} color="white" css={{ mt: 0 }}>
            {keys.map((k, index) => { return (
              <Badge key={k}>{index + 1}.{k}</Badge>
              )})
            }
            </Text>
          </Card.Body>
        </Card>
      );
    };

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
            Account created! 
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>Account address:</Text>
          <Text size="$xs">{account}</Text>
          <CardSeed keys={seed}></CardSeed>
        </Modal.Body>
        <Modal.Footer>
          <Text>
            Save off Mnemonic and address.
          </Text>
        </Modal.Footer>
      </Modal>
  )
}

export default AccountCreatedModal