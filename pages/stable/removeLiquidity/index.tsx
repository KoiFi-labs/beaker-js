/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Text, Container, Card, Grid, useInput } from '@nextui-org/react'
import { LigthInput } from '../../../src/components/LighInput/LigthInput'
import { DynamicButton } from '../../../src/components/DynamicButton/DynamicButton'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { useRouter } from 'next/router'
import { Balance, hasOptin } from '../../../src/services/algoService'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { burn, optin } from '../../../src/services/kondorServices/symmetricPoolServise'
import { Asset, config } from '../../../config'
import { useWallet } from '../../../src/contexts/useWallet'
import { isNumber } from '../../../src/utils/utils'

enum Step {
  WALLET_CONNECT_NEEDED,
  INSUFFICIENT_BALANCE,
  OPT_IN_A_NEEDED,
  OPT_IN_B_NEEDED,
  READY
}

export default function AddLiquidityPool () {
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [confirmOptinAModalIsvisible, setConfirmOptinAModalIsVisible] = useState<boolean>(false)
  const [confirmOptinBModalIsvisible, setConfirmOptinBModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [isOptedinA, setIsOptedinA] = useState<boolean>(false)
  const [isOptedinB, setIsOptedinB] = useState<boolean>(false)
  const { isConnected, balances, account, getAssetBalance, connectWallet } = useWallet()
  const input = useInput('')
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const lpAsset = config.assetList.filter(a => a.id === config.stablePool.stablePoolAssetId)[0]
  const DECIMALS = 1000000

  useEffect(() => {
    reloadState()
      .then(() => updateStep())
  }, [account, balances])

  useEffect(() => {
    updateStep()
  }, [input])

  const reloadState = async () => {
    if (isConnected) {
      hasOptin(account.addr, config.stablePool.assetIdA)
        .then((res: boolean) => setIsOptedinA(res))
        .then(() => hasOptin(account.addr, config.stablePool.assetIdB))
        .then((res: boolean) => setIsOptedinB(res))
    }
  }

  const updateStep = () => {
    if (!isConnected) return setStep(Step.WALLET_CONNECT_NEEDED)
    if (getAssetBalance(lpAsset.id) / DECIMALS < Number(input.value)) return setStep(Step.INSUFFICIENT_BALANCE)
    if (!isOptedinA) return setStep(Step.OPT_IN_A_NEEDED)
    if (!isOptedinB) return setStep(Step.OPT_IN_B_NEEDED)
    setStep(Step.READY)
  }

  const onChangeInput = (e: any) => {
    if (isNumber(e.target.value)) {
      input.setValue(e.target.value)
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
      text: `Insufficient ${lpAsset.symbol} balance`,
      disabled: true
    },
    {
      text: 'Opt-in A token',
      onPress: () => { handleOptinAButton() }
    },
    {
      text: 'Opt-in B token',
      onPress: () => { handleOptinBButton() }
    },
    {
      text: 'Remove liquidity',
      onPress: () => { handleRemoveLiquidityButton() }
    }
  ]

  const handleConfirmButton = async () => {
    setLoading(true)
    const result = await burn(account.addr, Number(input.value))
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleConfirmOptinAButton = async () => {
    setLoading(true)
    const result = await optin(account.addr, config.stablePool.assetIdA)
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleConfirmOptinBButton = async () => {
    setLoading(true)
    const result = await optin(account.addr, config.stablePool.assetIdB)
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleRemoveLiquidityButton = () => {
    setConfirmModalIsVisible(true)
  }

  const handleOptinAButton = () => {
    setConfirmOptinAModalIsVisible(true)
  }

  const handleOptinBButton = () => {
    setConfirmOptinBModalIsVisible(true)
  }

  const AssetInput = (
    asset: Asset,
    value:string,
    onChange: (event: BindingsChangeTarget) => void,
    label?: string
  ) => {
    return (
      <Card key={asset.name} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
            <Text>{label || `Remove ${asset.name}`}</Text>
            <LigthInput
              value={value}
              onChange={onChange}
              aria-label={label || `Remove ${asset.name}`}
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

  const getConfirmModal = () => {
    return (
      <ConfirmModal
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm transaction'
      >
        <>
          {
              getResumeDetails(
                lpAsset.name,
                `${Number(input.value)} ${lpAsset.symbol}`)
          }
        </>
      </ConfirmModal>
    )
  }

  const getConfirmOptinAModal = () => {
    return (
      <ConfirmModal
        isVisible={confirmOptinAModalIsvisible}
        onHide={() => setConfirmOptinAModalIsVisible(false)}
        onPress={handleConfirmOptinAButton}
        title='Confirm transaction'
      >
        <Text>
          Opt-in A asset {config.stablePool.assetIdA}
        </Text>
      </ConfirmModal>
    )
  }

  const getConfirmOptinBModal = () => {
    return (
      <ConfirmModal
        isVisible={confirmOptinBModalIsvisible}
        onHide={() => setConfirmOptinBModalIsVisible(false)}
        onPress={handleConfirmOptinBButton}
        title='Confirm transaction'
      >
        <Text>
          Opt-in B asset {config.stablePool.assetIdB}
        </Text>
      </ConfirmModal>
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
        <Text h1>Remove USD liquidity</Text>
        <Container css={{ p: '16px 0px 8px 0px' }}>
          {AssetInput(lpAsset, input.value, onChangeInput)}
        </Container>
        <DynamicButton items={buttonOptions} index={step} loading={loading} />
      </Container>
      {getConfirmModal()}
      {getConfirmOptinAModal()}
      {getConfirmOptinBModal()}
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
