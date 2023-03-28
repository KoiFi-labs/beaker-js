/* eslint-disable no-unused-vars */
import { Button, Text, Container, Card, Grid, Input, useInput, Radio, Spacer, Collapse } from '@nextui-org/react'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { PoolType, getPoolBySymbol } from '../../../src/services/poolService'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber, sleep } from '../../../src/utils/utils'
import { useRouter } from 'next/router'
import { createProduct, getBalances, getPrices } from '../../../src/services/mock'
import { Balance, Price } from '../../../interfaces'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { getMintAmount } from '../../../src/services/kondorServices/symmetricPoolServise'
import { config } from '../../../config'

enum StyleType {
  ALIQUOT = 'aliquot',
  FREE = 'free',
  ASSET_A = 'asset_a',
  ASSET_B = 'asset_b'
}

type AssetInput = {
  asset: string,
  amount: number
}

export default function AddLiquidityPool () {
  const [inputsAmount, setInputsAmount] = useState<number>(1)
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balance[]>([])
  const [prices, setPrices] = useState<Price[]>([])
  const [assetPorcentageInput1, setAssetPorcentageInput1] = useState<string>('ALGO')
  const [assetPorcentageInput2, setAssetPorcentageInput2] = useState<string>('PLANET')
  const [assetSupplyInputByPorcentage, setAssetSupplyInputByPorcentage] = useState<string>('USDC')
  const [style, setStyle] = useState<StyleType>(StyleType.ALIQUOT)
  const input1 = useInput('')
  const input2 = useInput('')
  const inputAssetSupplyByPorcentage = useInput('')
  const inputPorcentage1 = useInput('')
  const inputPorcentage2 = useInput('')
  const [inputWithErrors, setInputWithErrors] = useState<boolean>(false)
  const router = useRouter()
  const [flag, setFlag] = useState<boolean>(false)
  const assetInput1 = ('USDC')
  const assetInput2 = ('USDT')

  const getPrice = (asset: string) => {
    const price = prices.find(p => p.assetSymbol === asset)
    return price?.price || 0
  }

  useEffect(() => {
    const fetchBalancesAndPrices = async () => {
      const balances = await getBalances()
      const prices = await getPrices()
      setBalances(balances)
      setPrices(prices)
    }
    fetchBalancesAndPrices()
  }, [])

  useEffect(() => {
    switch (style) {
      case StyleType.ALIQUOT: {
        if (input1.value) {
          getMintAmount(Number(input1.value), config.pond.assetIdB)
            .then((amount: number) => { input2.setValue(abbreviateNumber(amount)) })
        }
        if (input2.value) {
          getMintAmount(Number(input2.value), config.pond.assetIdA)
            .then((amount: number) => { input1.setValue(abbreviateNumber(amount)) })
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

  const getValueFromAsset = (asset: string) => {
    if (asset === assetInput1) return Number(input1.value)
    if (asset === assetInput2) return Number(input2.value)
    return 0
  }

  const handleConfirmButton = async () => {
    setSendingTransactionModalIsVisible(true)
    await sleep(3000)
    const assetsList = [assetInput1, assetInput2].slice(0, inputsAmount)
    const name = assetsList.join('/')
    await createProduct({
      name,
      id: Math.ceil(Math.random() * 9999999),
      assets: assetsList.map(asset => ({
        symbol: asset,
        amount: getValueFromAsset(asset)
      })),
      value: calculateTotalPrice()
    })
    setSendingTransactionModalIsVisible(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleCreateButton = () => {
    setConfirmModalIsVisible(true)
  }

  const getBalanceFromPool = (pool: PoolType) => {
    const balance = balances.find(b => b.assetSymbol === pool.pool)
    return balance?.amount || 0
  }

  const calculateTotalPrice = () => {
    const price1 = prices.find(p => p.assetSymbol === assetInput1)
    const price2 = prices.find(p => p.assetSymbol === assetInput2)
    const total = Number(input1.value) * Number(price1?.price) + Number(input2.value) * Number(price2?.price)
    return total
  }

  const calculateAssetAmountByPorcentage = (asset: string, porcentage: number) => {
    const supplyInput = Number(inputAssetSupplyByPorcentage.value)
    const supplyInputUSD = supplyInput * (prices.find(p => p.assetSymbol === assetSupplyInputByPorcentage)?.price || 0)
    const assetAmountUDS = (supplyInputUSD * porcentage) / 100
    const assetAmount = assetAmountUDS / (prices.find(p => p.assetSymbol === asset)?.price || 0)
    return assetAmount
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
          <Grid xs={12}>
            <Input
              {...{ value, onChange }}
              label={label || `Add ${asset}`}
              underlined
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
      case StyleType.FREE:
        return (
          <>
            {PoolInput(assetInput1, input1.value, onChangeInput1)}
            {PoolInput(assetInput2, input2.value, onChangeInput2)}
          </>
        )
      case StyleType.ASSET_A:
        return (<>{PoolInput(assetInput1, input1.value, onChangeInput1)}</>)
      case StyleType.ASSET_B:
        return (<>{PoolInput(assetInput2, input2.value, onChangeInput2)}</>)
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
          {
            getResumeDetails(
              'Total value',
              `≈ $${abbreviateNumber(calculateTotalPrice())}`)
          }
        </>
      </ConfirmModal>
    )
  }

  return (
    <Container display='flex' justify='center' alignContent='flex-start' css={{ minHeight: '85vh', p: '16px' }}>
      <Card css={{
        p: '8px',
        maxWidth: '400px',
        minHeight: '200px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Text size={20} css={{ color: '$kondorLight' }}>Add liquidity USDC / USDT Pool</Text>
        <Spacer y={0.5} />
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
          <Radio value={StyleType.FREE} size='xs'>
            Free
          </Radio>
          <Radio value={StyleType.ASSET_A} size='xs'>
            {assetInput1.toUpperCase()}
          </Radio>
          <Radio value={StyleType.ASSET_B} size='xs'>
            {assetInput2.toUpperCase()}
          </Radio>
        </Radio.Group>
        <Spacer y={1} />
        {getInputs()}
        <Button
          onPress={() => handleCreateButton()}
          bordered
          rounded
          css={{ withd: '100%', m: '4px 0', borderColor: '$kondorPrimary', color: '$white' }}
        >Create
        </Button>
      </Card>
      {getConfirmModal()}
      <SendingTransactionModal
        isVisible={sendingTransactionModalIsVisible}
        onHide={() => setSendingTransactionModalIsVisible(false)}
        onPress={() => { setSuccessfulTransactionModalIsVisible(true) }}
      />
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalIsVisible}
        onHide={() => setSuccessfulTransactionModalIsVisible(false)}
        onPress={() => { handleOkButton() }}
        transactionId='4UEKQ5H2YBDPW3FFXM36QDFT2AR6I7X4ZIPW7P32X3YHPTXVOHZQ'
      />
    </Container>
  )
}
