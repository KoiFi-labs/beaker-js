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
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [errorModalIsVisible, setErrorModalIsVisible] = useState<boolean>(false)
  const [infoModalIsVisible, setInfoModalIsVisible] = useState<boolean>(false)
  const [errorDetails, setErrorDetails] = useState<string>('')
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const { isConnected, balances, account, reloadBalances, connectWallet } = useWallet()
  const [style, setStyle] = useState<StyleType>(StyleType.SINGLE)
  const inputAmount = useInput('')
  const inputAddress = useInput('')
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const [asset, setAsset] = useState<Asset>(
    config.assetList.filter(a => a.id === Number(router.query?.asset))[0] ||
    config.assetList.filter(a => a.id === config.stablePool.assetIdA)[0])
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    reloadState()
      .then(() => updateStep())
  }, [account, balances])

  useEffect(() => {
    updateStep()
  }, [inputAmount, asset])

  const reloadState = async () => {
    if (isConnected) reloadBalances()
  }

  useEffect(() => {
    if (isConnected) {
      setBalance(0)
      balances.forEach((b: Balance) => {
        if (b.assetId === asset.id) setBalance(microToStandard(b.amount))
      })
    } else {
      setBalance(0)
    }
  }, [asset, isConnected, balances])

  useEffect(() => {
    if (router.query) {
      const newAsset = getAssetById(Number(router.query.asset))
      setAsset(newAsset || config.assetList[0])
    }
  }, [router.query.asset])

  const updateStep = () => {
    if (!isConnected) return setStep(Step.WALLET_CONNECT_NEEDED)
    if (!isValidAlgorandAddress(inputAddress.value) && inputAddress.value !== '') return setStep(Step.INVALID_ALGORAND_ADDRESS)
    if (balance < Number(inputAmount.value)) return setStep(Step.INSUFFICIENT_BALANCE)
    setStep(Step.READY)
  }

  const onChangeInputAmount = (e: any) => {
    if (!isValidAlgorandAddress(inputAddress.value)) return
    if (!isNumber(e.target.value)) return
    inputAmount.setValue(e.target.value)
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/send')
  }

  const buttonOptions = [
    {
      text: 'Connect your wallet',
      onPress: () => { connectWallet() }
    },
    {
      text: 'Invalid Algorand address',
      disabled: true
    },
    {
      text: `Insufficient ${asset.symbol} balance`,
      disabled: true
    },
    {
      text: 'Send',
      onPress: () => { handleSendButton() }
    }
  ]

  const handleConfirmButton = async () => {
    try {
      setLoading(true)
      const result = await createTransaction(account.addr, Number(inputAmount.value), asset.id, inputAddress.value, tags)
      console.log(result)
      if (result?.txId) {
        setTransactionId(result.txId)
        setSuccessfulTransactionModalIsVisible(true)
      } else {
        setErrorModalIsVisible(true)
        setErrorDetails(result.errorDetails)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      setErrorModalIsVisible(true)
      console.log(e)
    }
  }

  const handleSendButton = () => {
    if (Number(inputAmount.value) > 0) {
      setConfirmModalIsVisible(true)
    }
  }

  const handleOkErrorButton = () => {
    setErrorModalIsVisible(false)
  }

  const handleAssetSelect = (asset: Asset) => {
    setAsset(asset)
    router.push({
      pathname: router.pathname,
      query: { asset: asset.id }
    })
  }

  const selectedTags = (tagsParams: string[]) => {
    setTags(tagsParams)
  }

  const getResumeDetails = (label: string, value: string) => {
    return (
      <Container css={{ p: 0 }} display='flex' justify='space-between'>
        <Text size={16} css={{ color: '$kondorGray' }}>{label}</Text>
        <Text>{value}</Text>
      </Container>
    )
  }

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
        <Spacer />
        <AddressInput
          input={inputAddress}
        />
        <Spacer />
        <AssetSelectCard
          asset={asset}
          input={inputAmount}
          onChange={onChangeInputAmount}
          balance={balance}
          onPressAssetSelec={handleAssetSelect}
        />
        <Spacer />
        <TagsInput tags={tags} selectedTags={selectedTags} />
        <Spacer />
        <DynamicButton items={buttonOptions} index={step} loading={loading} />
      </Container>
      <ConfirmModal
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm transaction'
      >
        {getResumeDetails(asset.name, `${abbreviateNumber(Number(inputAmount.value), 6)} ${asset.symbol}`)}
      </ConfirmModal>
      <SendingTransactionModal
        isVisible={sendingTransactionModalIsVisible}
        onHide={() => setSendingTransactionModalIsVisible(false)}
        onPress={() => { setSuccessfulTransactionModalIsVisible(true) }}
      />
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalIsVisible}
        onHide={() => setSuccessfulTransactionModalIsVisible(false)}
        onPress={() => { handleOkButton() }}
        transactionId={transactionId}
      />
      <InfoModal
        isVisible={infoModalIsVisible}
        onHide={() => setInfoModalIsVisible(false)}
        title='Send styles'
      >
        <Container css={{ p: 0, textAlign: 'initial' }}>
          <Text b>Single</Text>
          <Text size={14}>
            Send an Asset to any Algorand address.
          </Text>
          <Spacer y={0.5} />
          <Text b>Batch</Text>
          <Text size={14}>
            Send multiple transactions to differents addreses.
          </Text>
        </Container>
      </InfoModal>
      <ErrorModal
        isVisible={errorModalIsVisible}
        onHide={() => setErrorModalIsVisible(false)}
        onPress={() => { handleOkErrorButton() }}
        details={errorDetails}
      />
    </Container>
  )
}
