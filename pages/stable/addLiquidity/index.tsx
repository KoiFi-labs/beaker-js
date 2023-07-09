/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Text, Container, Card, Grid, useInput, Radio, Spacer, Tooltip } from '@nextui-org/react'
import { LigthInput } from '../../../src/components/LighInput/LigthInput'
import { DynamicButton } from '../../../src/components/DynamicButton/DynamicButton'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import InfoModal from '../../../src/components/modules/Modals/InfoModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber, isNumber } from '../../../src/utils/utils'
import { useRouter } from 'next/router'
import { hasOptin } from '../../../src/services/algoService'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { getMintAmount, mint, optin, calculateMint } from '../../../src/services/kondorServices/symmetricPoolServise'
import { config } from '../../../config'
import { useWallet } from '../../../src/contexts/useWallet'
import useTimer from '../../../src/hooks/useTimmer'
import { BiInfoCircle } from 'react-icons/bi'
import ExpectedAmountInfo from '../../../src/components/modules/Modals/ExpectedAmountInfo'
import ErrorModal from '../../../src/components/modules/Modals/ErrorModal'
import AssetInputCard from '../../../src/components/AssetInputCard/AssetInputCard'

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
  const [errorModalIsVisible, setErrorModalIsVisible] = useState<boolean>(false)
  const [infoModalIsVisible, setInfoModalIsVisible] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [isOptedin, setIsOptedin] = useState<boolean>(false)
  const [expectedAmount, setExpectedAmount] = useState<number>(0)
  const { isConnected, balances, account, reloadBalances, connectWallet } = useWallet()
  const { timerFlag, runTimer } = useTimer()
  const [style, setStyle] = useState<StyleType>(StyleType.ALIQUOT)
  const inputA = useInput('')
  const inputB = useInput('')
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const assetA = config.assetList.filter(a => a.id === config.stablePool.assetIdA)[0]
  const assetB = config.assetList.filter(a => a.id === config.stablePool.assetIdB)[0]
  const poolAsset = config.assetList.filter(a => a.id === config.stablePool.stablePoolAssetId)[0]
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
            .then((amount: number) => {
              inputB.setValue(amount.toFixed(6).toString())
              getExpectedAmount(Number(inputA.value), amount)
                .then((lpAmount: number) => setExpectedAmount(lpAmount))
            })
        }
        if (inputB.value) {
          getMintAmount(Number(inputB.value), config.stablePool.assetIdA)
            .then((amount: number) => {
              inputA.setValue(amount.toFixed(6).toString())
              getExpectedAmount(amount, Number(inputB.value))
                .then((lpAmount: number) => setExpectedAmount(lpAmount))
            })
        }
        break
      }
      case StyleType.ASSET_A:
        inputB.setValue('')
        getExpectedAmount(Number(inputA.value), 0)
          .then((lpAmount: number) => setExpectedAmount(lpAmount))
        break
      case StyleType.ASSET_B:
        inputA.setValue('')
        getExpectedAmount(0, Number(inputB.value))
          .then((lpAmount: number) => setExpectedAmount(lpAmount))
        break
      case StyleType.CUSTOM:
        getExpectedAmount(Number(inputA.value), Number(inputB.value))
          .then((lpAmount: number) => setExpectedAmount(lpAmount))
    }
  }, [style, timerFlag])

  const getExpectedAmount = async (aAmount: number, bAmount: number) => {
    if (aAmount > 0 || bAmount > 0) {
      return await calculateMint(aAmount || 0, bAmount || 0)
    } return 0
  }

  const onChangeInputA = (e: any) => {
    if (!isNumber(e.target.value)) return
    inputA.setValue(e.target.value)
    switch (style) {
      case StyleType.ALIQUOT:
        inputB.setValue('')
        runTimer()
        break
      case StyleType.CUSTOM:
      case StyleType.ASSET_A:
      case StyleType.ASSET_B:
        runTimer()
        break
    }
  }

  const onChangeInputB = (e: any) => {
    if (!isNumber(e.target.value)) return
    inputB.setValue(e.target.value)
    switch (style) {
      case StyleType.ALIQUOT:
        inputA.setValue('')
        runTimer()
        break
      case StyleType.CUSTOM:
      case StyleType.ASSET_A:
      case StyleType.ASSET_B:
        runTimer()
        break
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
    try {
      setLoading(true)
      const result = await mint(account.addr, Number(inputA.value), Number(inputB.value))
      setTransactionId(result.txId)
      setLoading(false)
      setSuccessfulTransactionModalIsVisible(true)
    } catch (e) {
      setLoading(false)
      setErrorModalIsVisible(true)
      console.log(e)
    }
  }

  const handleConfirmOptinButton = async () => {
    try {
      setLoading(true)
      const result = await optin(account.addr, config.stablePool.stablePoolAssetId)
      setTransactionId(result.txId)
      setLoading(false)
      setSuccessfulTransactionModalIsVisible(true)
    } catch (e) {
      setLoading(false)
      setErrorModalIsVisible(true)
      console.log(e)
    }
  }

  const handleAddLiquidityButton = () => {
    if (Number(inputA.value) > 0 || Number(inputB.value) > 0) {
      setConfirmModalIsVisible(true)
    }
  }

  const handleOptinButton = () => {
    setConfirmOptinModalIsVisible(true)
  }

  const handleOkErrorButton = () => {
    setErrorModalIsVisible(false)
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
              {AssetInputCard({ asset: assetA, value: inputA.value, onChange: onChangeInputA, label: `Add ${assetA.symbol}` })}
            </Container>
            <Container css={{ p: '8px 0px 16px 0px' }}>
              {AssetInputCard({ asset: assetB, value: inputB.value, onChange: onChangeInputB, label: `Add ${assetB.symbol}` })}
            </Container>
          </>
        )
      case StyleType.ASSET_A:
        return (
          <Container css={{ p: '16px 0px' }}>
            {AssetInputCard({ asset: assetA, value: inputA.value, onChange: onChangeInputA, label: `Add ${assetA.symbol}` })}
          </Container>
        )
      case StyleType.ASSET_B:
        return (
          <Container css={{ p: '16px 0px' }}>
            {AssetInputCard({ asset: assetB, value: inputB.value, onChange: onChangeInputB, label: `Add ${assetB.symbol}` })}
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
        <Container css={{ p: 0, d: 'flex', justifyContent: 'space-between' }}>
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
          <Tooltip content='Style info'>
            <BiInfoCircle size={20} onClick={() => setInfoModalIsVisible(true)} />
          </Tooltip>
        </Container>
        {getInputs()}
        <ExpectedAmountInfo amount={expectedAmount} slippage={5} asset={poolAsset.symbol} />
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
      <InfoModal
        isVisible={infoModalIsVisible}
        onHide={() => setInfoModalIsVisible(false)}
        title='Add liquidity styles'
      >
        <Container css={{ p: 0, textAlign: 'initial' }}>
          <Text b>Aliquot</Text>
          <Text size={14}>
            Commit two assets simultaneously in the liquidity pool.
            You specify the quantity of one asset, and the platform
            calculates the corresponding quantity of the other asset for an efficient commit based on market conditions.
          </Text>
          <Spacer y={0.5} />
          <Text b>Custom</Text>
          <Text size={14}>
            You have complete control over the proportion in which you contribute the assets. This provides flexibility to
            customize your contribution according to your preferences.
          </Text>
          <Spacer y={0.5} />
          <Text b>USDT</Text>
          <Text size={14}>
            Commit only USDT asset in the liquidity pool.
          </Text>
          <Spacer y={0.5} />
          <Text b>USDC</Text>
          <Text size={14}>
            Commit only USDC asset in the liquidity pool.
          </Text>
        </Container>
      </InfoModal>
      <ErrorModal
        isVisible={errorModalIsVisible}
        onHide={() => setErrorModalIsVisible(false)}
        onPress={() => { handleOkErrorButton() }}
      />
    </Container>
  )
}
