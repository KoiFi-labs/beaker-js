/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Text, Container, useInput, Radio, Spacer, Tooltip } from '@nextui-org/react'
import { DynamicButton } from '../../src/components/DynamicButton/DynamicButton'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../src/components/modules/Modals/SuccessfulTransactionModal'
import InfoModal from '../../src/components/modules/Modals/InfoModal'
import SendingTransactionModal from '../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber, isNumber, isValidAlgorandAddress } from '../../src/utils/utils'
import { useRouter } from 'next/router'
import { Balance } from '../../src/services/algoService'
import { config, Asset } from '../../config'
import { useWallet } from '../../src/contexts/useWallet'
import { BiInfoCircle } from 'react-icons/bi'
import ErrorModal from '../../src/components/modules/Modals/ErrorModal'
import AssetSelectCard from '../../src/components/AssetSelectCard/AssetSelectCard'
import { microToStandard } from '../../src/utils/math'
import AddressInput from '../../src/components/AddressInput/AddressInput'
import TagsInput from '../../src/components/TagsInput/TagsInput'
import { getAssetById } from '../../src/services/kondorServices/symmetricPoolServise'
import { createTransaction } from '../../src/services/kondorServices/transactions'
import SendSingle from '../../src/components/SendSingle/SendSingle'

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
      <SendSingle />
    </Container>
  )
}
