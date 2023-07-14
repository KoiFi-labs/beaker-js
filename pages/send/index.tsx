/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Text, Container, Radio, Tooltip, Spacer } from '@nextui-org/react'
import { useState } from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import SendSingle from '../../src/components/SendSingle/SendSingle'
import SendBatch from '../../src/components/SendBatch/SendBatch'
import InfoModal from '../../src/components/modules/Modals/InfoModal'

enum StyleType {
  SINGLE = 'single',
  BATCH = 'batch'
}

enum Step {
  WALLET_CONNECT_NEEDED,
  INVALID_ALGORAND_ADDRESS,
  INSUFFICIENT_BALANCE,
  READY
}

export default function Send () {
  const [infoModalIsVisible, setInfoModalIsVisible] = useState<boolean>(false)
  const [style, setStyle] = useState<StyleType>(StyleType.SINGLE)

  return (
    <Container display='flex' justify='center' css={{ p: 0, width: '100%' }}>
      <Container css={{
        minWidth: '330px',
        width: '100%',
        maxWidth: '500px',
        p: 0
      }}
      >
        <Text h1>Send</Text>
        <Container css={{ p: 0, d: 'flex', justifyContent: 'space-between' }}>
          <Radio.Group
            orientation='horizontal'
            label='Select style'
            defaultValue={StyleType.SINGLE}
            size='xs'
            onChange={(value) => { setStyle(value as StyleType) }}
          >
            <Radio value={StyleType.SINGLE} size='xs'>
              Single
            </Radio>
            <Radio value={StyleType.BATCH} size='xs'>
              Batch
            </Radio>
          </Radio.Group>
          <Tooltip content='Style info'>
            <BiInfoCircle size={20} onClick={() => setInfoModalIsVisible(true)} />
          </Tooltip>
        </Container>
      </Container>
      <InfoModal
        isVisible={infoModalIsVisible}
        onHide={() => setInfoModalIsVisible(false)}
        title='Send options'
      >
        <Container css={{ p: 0, textAlign: 'initial' }}>
          <Text b>Single</Text>
          <Text size={14}>
            Send Algo or any Algorand Standard Asset in one transaction.
          </Text>
          <Spacer y={0.5} />
          <Text b>Batch</Text>
          <Text size={14}>
            Effortlessly send multiple transactions of Algo or any Algorand Standard Asset
          </Text>
          <Spacer y={0.5} />
          <Text b>Tag field</Text>
          <Text size={14}>
            Allows adding descriptive words to precisely identify the transaction.
          </Text>
        </Container>
      </InfoModal>
      {style === StyleType.SINGLE ? <SendSingle /> : <SendBatch />}
    </Container>
  )
}
