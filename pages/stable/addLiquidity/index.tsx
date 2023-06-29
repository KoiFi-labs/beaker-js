/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Text, Container, Card, Grid, useInput, Radio } from '@nextui-org/react'
import { LigthInput } from '../../../src/components/LighInput/LigthInput'
import { DynamicButton } from '../../../src/components/DynamicButton/DynamicButton'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber, isNumber } from '../../../src/utils/utils'
import { useRouter } from 'next/router'
import { hasOptin } from '../../../src/services/algoService'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { getMintAmount, mint, optin } from '../../../src/services/kondorServices/symmetricPoolServise'
import { Asset, config } from '../../../config'
import { useWallet } from '../../../src/contexts/useWallet'
import useTimer from '../../../src/hooks/useTimmer'

enum StyleType {
  ALIQUOT = 'aliquot',
  CUSTOM = 'custom',
  ASSET_A = 'asset_a',
  ASSET_B = 'asset_b'
}

enum Step {
  WALLET_CONNECT_NEEDED,
  INSUFFICIENT_A_BALANCE,
  INSUFFICIENT_B_BALANCE,
  OPT_IN_NEEDED,
  READY
}

export default function AddLiquidityPool () {
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [confirmOptinModalIsvisible, setConfirmOptinModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [isOptedin, setIsOptedin] = useState<boolean>(false)
  const { isConnected, balances, account, reloadBalances, connectWallet, getAssetBalance } = useWallet()
  const { timerFlag, runTimer } = useTimer()
  const [style, setStyle] = useState<StyleType>(StyleType.ALIQUOT)
  const inputA = useInput('')
  const inputB = useInput('')
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const assetA = config.assetList.filter(a => a.id === config.stablePool.assetIdA)[0]
  const assetB = config.assetList.filter(a => a.id === config.stablePool.assetIdB)[0]
  const DECIMALS = 1000000

  useEffect(() => {
    reloadState()
      .then(() => updateStep())
  }, [account, balances])

  useEffect(() => {
    updateStep()
  }, [inputA, inputB])

  const reloadState = async () => {
    if (isConnected) {
      hasOptin(account.addr, config.stablePool.stablePoolAssetId)
        .then((res: boolean) => setIsOptedin(res))
        .then(() => reloadBalances())
    }
  }

  const updateStep = () => {
    if (!isConnected) return setStep(Step.WALLET_CONNECT_NEEDED)
    if (!isOptedin) return setStep(Step.OPT_IN_NEEDED)
    setStep(Step.READY)
  }

  useEffect(() => {
    switch (style) {
      case StyleType.ALIQUOT: {
        if (inputA.value) {
          getMintAmount(Number(inputA.value), config.stablePool.assetIdB)
            .then((amount: number) => { inputB.setValue(amount.toFixed(6).toString()) })
        }
        if (inputB.value) {
          getMintAmount(Number(inputB.value), config.stablePool.assetIdA)
            .then((amount: number) => { inputA.setValue(amount.toFixed(6).toString()) })
        }
        break
      }
      case StyleType.ASSET_A:
        inputB.setValue('')
        break
      case StyleType.ASSET_B:
        inputA.setValue('')
        break
    }
  }, [style, timerFlag])

  const onChangeInputA = (e: any) => {
    if (!isNumber(e.target.value)) return
    inputA.setValue(e.target.value)
    if (style === StyleType.ALIQUOT) {
      inputB.setValue('')
      runTimer()
    }
  }

  const onChangeInputB = (e: any) => {
    if (!isNumber(e.target.value)) return
    inputB.setValue(e.target.value)
    if (style === StyleType.ALIQUOT) {
      inputA.setValue('')
      runTimer()
    }
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/stable')
  }

  const buttonOptions = [
    {
      text: 'Connect your wallet',
      onPress: () => { connectWallet() }
    },
    {
      text: `Insufficient ${assetA.symbol} balance`,
      disabled: true
    },
    {
      text: `Insufficient ${assetB.symbol} balance`,
      disabled: true
    },
    {
      text: 'Opt-in pool token',
      onPress: () => { handleOptinButton() }
    },
    {
      text: 'Add liquidity',
      onPress: () => { handleAddLiquidityButton() }
    }
  ]

  const handleConfirmButton = async () => {
    setLoading(true)
    const result = await mint(account.addr, Number(inputA.value), Number(inputB.value))
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleConfirmOptinButton = async () => {
    setLoading(true)
    const result = await optin(account.addr, config.stablePool.stablePoolAssetId)
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleAddLiquidityButton = () => {
    setConfirmModalIsVisible(true)
  }

  const handleOptinButton = () => {
    setConfirmOptinModalIsVisible(true)
  }

  const AssetInput = (
    asset: Asset,
    value:string,
    onChange: (event: BindingsChangeTarget) => void,
    label?: string
  ) => {
    return (
      <Card key={asset.id} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
            <Text>{label || `Add ${asset.symbol}`}</Text>
            <LigthInput
              value={value}
              onChange={onChange}
              aria-label={label || `Add ${asset}`}
              placeholder='0.00'
            />
          </Grid>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text size={14} css={{ color: '$kondorGray' }}>Balance {getAssetBalance(asset.id) / DECIMALS} {asset.symbol}</Text>
          </Container>
        </Grid.Container>
      </Card>
    )
  }

  const getResumeDetails = (label: string, value: string) => {
    return (
      <Container css={{ p: 0 }} display='flex' justify='space-between'>
        <Text size={16} css={{ color: '$kondorGray' }}>{label}</Text>
        <Text>{value}</Text>
      </Container>
    )
  }

  const getInputs = () => {
    switch (style) {
      case StyleType.ALIQUOT:
      case StyleType.CUSTOM:
        return (
          <>
            <Container css={{ p: '16px 0px 8px 0px' }}>
              {AssetInput(assetA, inputA.value, onChangeInputA)}
            </Container>
            <Container css={{ p: '8px 0px 16px 0px' }}>
              {AssetInput(assetB, inputB.value, onChangeInputB)}
            </Container>
          </>
        )
      case StyleType.ASSET_A:
        return (
          <Container css={{ p: '16px 0px' }}>
            {AssetInput(assetA, inputA.value, onChangeInputA)}
          </Container>
        )
      case StyleType.ASSET_B:
        return (
          <Container css={{ p: '16px 0px' }}>
            {AssetInput(assetB, inputB.value, onChangeInputB)}
          </Container>
        )
    }
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
        <Text h1>Add USD liquidity</Text>
        <Radio.Group
          orientation='horizontal'
          label='Select style'
          defaultValue={StyleType.ALIQUOT}
          size='xs'
          onChange={(value) => { setStyle(value as StyleType) }}
        >
          <Radio value={StyleType.ALIQUOT} size='xs'>
            Aliquot
          </Radio>
          <Radio value={StyleType.CUSTOM} size='xs'>
            Custom
          </Radio>
          <Radio value={StyleType.ASSET_A} size='xs'>
            {assetA.symbol.toUpperCase()}
          </Radio>
          <Radio value={StyleType.ASSET_B} size='xs'>
            {assetB.symbol.toUpperCase()}
          </Radio>
        </Radio.Group>
        {getInputs()}
        <DynamicButton items={buttonOptions} index={step} loading={loading} />
      </Container>
      <ConfirmModal
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm transaction'
      >
        <>
          {
            style === StyleType.ASSET_B
              ? null
              : getResumeDetails(
                assetA.name,
                `${abbreviateNumber(Number(inputA.value), 2)} ${assetA.symbol}`)
          }
          {
            style === StyleType.ASSET_A
              ? null
              : getResumeDetails(
                assetB.name,
                `${abbreviateNumber(Number(inputB.value), 2)} ${assetB.symbol}`)
          }
        </>
      </ConfirmModal>
      <ConfirmModal
        isVisible={confirmOptinModalIsvisible}
        onHide={() => setConfirmOptinModalIsVisible(false)}
        onPress={handleConfirmOptinButton}
        title='Confirm transaction'
      >
        <Text>
          Opt-in stable pool asset {config.stablePool.stablePoolAssetId}
        </Text>
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
    </Container>
  )
}
