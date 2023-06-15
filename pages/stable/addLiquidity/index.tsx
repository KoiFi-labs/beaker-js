/* eslint-disable no-unused-vars */
import { Text, Container, Card, Grid, useInput, Radio, Loading } from '@nextui-org/react'
import { LigthInput } from '../../../src/components/LighInput/LigthInput'
import { PoolType, getPoolBySymbol } from '../../../src/services/stablePoolService'
import { DynamicButton } from '../../../src/components/DynamicButton/DynamicButton'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber } from '../../../src/utils/utils'
import { useRouter } from 'next/router'
import { Balance, hasOptin } from '../../../src/services/algoService'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { getMintAmount, mint, optin } from '../../../src/services/kondorServices/symmetricPoolServise'
import { config } from '../../../config'
import { useWallet } from '../../../src/contexts/useWallet'

enum StyleType {
  ALIQUOT = 'aliquot',
  CUSTOM = 'custom',
  ASSET_A = 'asset_a',
  ASSET_B = 'asset_b'
}

enum Step {
  WALLET_CONNECT_NEEDED,
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
  const { isConnected, balances, account, reloadBalances } = useWallet()
  const [style, setStyle] = useState<StyleType>(StyleType.ALIQUOT)
  const input1 = useInput('')
  const input2 = useInput('')
  const router = useRouter()
  const [flag, setFlag] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const assetInput1 = ('USDT')
  const assetInput2 = ('USDC')
  const DECIMALS = 1000000

  useEffect(() => {
    reloadState()
      .then(() => updateStep())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, balances])

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
        if (input1.value) {
          getMintAmount(Number(input1.value), config.stablePool.assetIdB)
            .then((amount: number) => { input2.setValue(amount.toFixed(6).toString()) })
        }
        if (input2.value) {
          getMintAmount(Number(input2.value), config.stablePool.assetIdA)
            .then((amount: number) => { input1.setValue(amount.toFixed(6).toString()) })
        }
        break
      }
      case StyleType.ASSET_A:
        input2.setValue('')
        break
      case StyleType.ASSET_B:
        input1.setValue('')
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, flag])

  const onChangeInput1 = (e: any) => {
    input1.setValue(e.target.value)
    switch (style) {
      case StyleType.ALIQUOT:
        input2.setValue('')
        setFlag(!flag)
        break
    }
  }

  const onChangeInput2 = (e: any) => {
    input2.setValue(e.target.value)
    switch (style) {
      case StyleType.ALIQUOT:
        input1.setValue('')
        setFlag(!flag)
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
      onPress: () => { console.log('connect your wallet') }
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
    const result = await mint(account.addr, Number(input1.value), Number(input2.value))
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleConfirmOptinButton = async () => {
    setLoading(true)
    const result = await optin(account.addr)
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

  const getBalanceFromPool = (pool: PoolType) => {
    const balance = balances.find((b: Balance) => b.symbol === pool.pool)
    return balance?.amount / DECIMALS || 0
  }

  const PoolInput = (
    asset: string,
    value:string,
    onChange: (event: BindingsChangeTarget) => void,
    label?: string
  ) => {
    const pool = getPoolBySymbol(asset)!
    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={12} css={{ d: 'flex', flexDirection: 'column' }}>
            <Text>{label || `Add ${asset}`}</Text>
            <LigthInput
              value={value}
              onChange={onChange}
              aria-label={label || `Add ${asset}`}
              placeholder='0.00'
            />
          </Grid>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text size={14} css={{ color: '$kondorGray' }}>Balance {getBalanceFromPool(pool)} {pool.pool}</Text>
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
              {PoolInput(assetInput1, input1.value, onChangeInput1)}
            </Container>
            <Container css={{ p: '8px 0px 16px 0px' }}>
              {PoolInput(assetInput2, input2.value, onChangeInput2)}
            </Container>
          </>
        )
      case StyleType.ASSET_A:
        return (
          <Container css={{ p: '16px 0px' }}>
            {PoolInput(assetInput1, input1.value, onChangeInput1)}
          </Container>
        )
      case StyleType.ASSET_B:
        return (
          <Container css={{ p: '16px 0px' }}>
            {PoolInput(assetInput2, input2.value, onChangeInput2)}
          </Container>
        )
    }
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
            style === StyleType.ASSET_B
              ? null
              : getResumeDetails(
                assetInput1,
                `${abbreviateNumber(Number(input1.value), 2)} ${assetInput1}`)
          }
          {
            style === StyleType.ASSET_A
              ? null
              : getResumeDetails(
                assetInput2,
                `${abbreviateNumber(Number(input2.value), 2)} ${assetInput2}`)
          }
        </>
      </ConfirmModal>
    )
  }

  const getConfirmOptinModal = () => {
    return (
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
            {assetInput1.toUpperCase()}
          </Radio>
          <Radio value={StyleType.ASSET_B} size='xs'>
            {assetInput2.toUpperCase()}
          </Radio>
        </Radio.Group>
        {getInputs()}
        <DynamicButton items={buttonOptions} index={step} loading={loading} />
      </Container>
      {getConfirmModal()}
      {getConfirmOptinModal()}
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
