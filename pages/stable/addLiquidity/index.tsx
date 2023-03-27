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
  const [assetInput1, setAssetInput1] = useState<string>('USDC')
  const [assetInput2, setAssetInput2] = useState<string>('USDT')
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
    if (style === StyleType.ALIQUOT) {
      if (input1.value) {
        getMintAmount(Number(input1.value), config.pond.assetIdB)
          .then((amount: number) => { input2.setValue(abbreviateNumber(amount)) })
      }
      if (input2.value) {
        getMintAmount(Number(input2.value), config.pond.assetIdA)
          .then((amount: number) => { input1.setValue(abbreviateNumber(amount)) })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style, flag])

  const onChangeInput1 = (e: any) => {
    input1.setValue(e.target.value)
    input2.setValue('')
    setFlag(!flag)
  }

  const onChangeInput2 = (e: any) => {
    input2.setValue(e.target.value)
    input1.setValue('')
    setFlag(!flag)
  }

  const handlePoolSelectButtonPorcentage1 = (pool: PoolType) => {
    setAssetPorcentageInput1(pool.pool)
  }

  const handlePoolSelectButtonPorcentage2 = (pool: PoolType) => {
    setAssetPorcentageInput2(pool.pool)
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/product')
  }

  const getAsset1Input: () => AssetInput = () => {
    if (style === StyleType.ALIQUOT) {
      return { asset: assetInput1, amount: Number(input1.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput1, Number(inputPorcentage1.value))
    return { asset: assetPorcentageInput1, amount }
  }

  const getAsset2Input: () => AssetInput = () => {
    if (style === StyleType.ALIQUOT) {
      return { asset: assetInput2, amount: Number(input2.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput2, Number(inputPorcentage2.value))
    return { asset: assetPorcentageInput2, amount }
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
    const price1 = prices.find(p => p.assetSymbol === getAsset1Input().asset)
    const price2 = prices.find(p => p.assetSymbol === getAsset2Input().asset)
    const total = getAsset1Input().amount * Number(price1?.price) + getAsset2Input().amount * Number(price2?.price)
    return total
  }

  const calculateAssetAmountByPorcentage = (asset: string, porcentage: number) => {
    const supplyInput = Number(inputAssetSupplyByPorcentage.value)
    const supplyInputUSD = supplyInput * (prices.find(p => p.assetSymbol === assetSupplyInputByPorcentage)?.price || 0)
    const assetAmountUDS = (supplyInputUSD * porcentage) / 100
    const assetAmount = assetAmountUDS / (prices.find(p => p.assetSymbol === asset)?.price || 0)
    return assetAmount
  }

  const calculateAssetAmountUSDByPorcentage = (asset: string, porcentage: number) => {
    const supplyInput = Number(inputAssetSupplyByPorcentage.value)
    const supplyInputUSD = supplyInput * (prices.find(p => p.assetSymbol === assetSupplyInputByPorcentage)?.price || 0)
    const assetAmountUDS = (supplyInputUSD * porcentage) / 100
    return assetAmountUDS
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

  const PoolPorcentageInput = (
    asset: string,
    value:string,
    onChange: (event: BindingsChangeTarget) => void,
    onSelect: (pool: PoolType) => void,
    label?: string
  ) => {
    const pool = getPoolBySymbol(asset)!
    const supplyAvailable = balances.find(b => b.assetSymbol === assetSupplyInputByPorcentage)?.amount || 0
    const supplyInput = Number(inputAssetSupplyByPorcentage.value)
    const assetAmount = calculateAssetAmountByPorcentage(asset, Number(value))
    const assetAmountUDS = calculateAssetAmountUSDByPorcentage(asset, Number(value))
    const assetAmountString = abbreviateNumber(assetAmount, 2)
    const assetAmountUSDString = abbreviateNumber(assetAmountUDS, 2)

    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={6}>
            <Grid.Container>
              <Grid xs={6}>
                <Input
                  {...{ value, onChange }}
                  label={label || `${asset}`}
                  underlined
                  placeholder='0.00'
                  color={Number(value) > 100 ? 'error' : 'default'}
                />
              </Grid>
              <Grid xs={2} css={{ d: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                <Text size={14} css={{ color: '$kondorGray' }}>%</Text>
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={2} />
          <Grid xs={4} css={{ d: 'flex', alignItems: 'center' }}>
            <PoolSelect pool={pool} onPress={onSelect} />
          </Grid>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            {Number(value) > 100
              ? <Text size={14} b css={{ color: '$error' }}>Porcentage must be less than 100</Text>
              : (
                <>
                  <Text size={14} css={{ color: '$kondorGray' }}>≈{assetAmountString} {pool.pool} </Text>
                  <Spacer x={1} />
                  <Text size={14} css={{ color: '$kondorGray' }}>≈{assetAmountUSDString} USD</Text>
                </>
                )}
          </Container>
        </Grid.Container>
      </Card>
    )
  }
  const getInputsByAmount = () => {
    return (
      <>
        {PoolInput(assetInput1, input1.value, onChangeInput1)}
        {PoolInput(assetInput2, input2.value, onChangeInput2)}
      </>
    )
  }

  const getInputsByPorcentage = () => {
    return (
      <>
        {PoolInput(
          assetSupplyInputByPorcentage,
          inputAssetSupplyByPorcentage.bindings.value,
          inputAssetSupplyByPorcentage.bindings.onChange,
          'Total investment amount'
        )}
        <Spacer y={1} />
        <Text size={14} css={{ color: '$kondorGray' }}>Enter the percentages</Text>
        {PoolPorcentageInput(
          assetPorcentageInput1,
          inputPorcentage1.bindings.value,
          inputPorcentage1.bindings.onChange,
          handlePoolSelectButtonPorcentage1
        )}
        {
          inputsAmount > 1
            ? PoolPorcentageInput(
              assetPorcentageInput2,
              inputPorcentage2.bindings.value,
              inputPorcentage2.bindings.onChange,
              handlePoolSelectButtonPorcentage2)
            : null
        }
      </>
    )
  }

  const getResumeDetailByAsset = (asset: string, amount: number, amountUSD: number, porcentage: number) => {
    return (
      <Grid.Container>
        <Grid xs={6}>
          <Text size={14} css={{ color: '$kondorGray' }}>{porcentage}% {asset}</Text>
        </Grid>
        <Grid xs={6} css={{ d: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'column' }}>
          <Text size={14} css={{ color: '$kondorLight' }}>{abbreviateNumber(amount)} {asset}</Text>
          <Text size={12} css={{ color: '$kondorGray' }}>≈ ${abbreviateNumber(amountUSD)}</Text>
        </Grid>
      </Grid.Container>
    )
  }

  const getResumeByPorcentage = () => {
    const assetSupply = Number(inputAssetSupplyByPorcentage.bindings.value)
    const porcentage1 = Number(inputPorcentage1.bindings.value)
    const porcentage2 = Number(inputPorcentage2.bindings.value)
    const totalPorcentage = porcentage1 + porcentage2
    const assetAmount1 = calculateAssetAmountByPorcentage(assetPorcentageInput1, porcentage1)
    const assetAmount2 = calculateAssetAmountByPorcentage(assetPorcentageInput2, porcentage2)
    const assetAmountUSD1 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput1, porcentage1)
    const assetAmountUSD2 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput2, porcentage2)

    if (totalPorcentage !== 100 && totalPorcentage !== 0) {
      return (
        <Container
          css={{ p: '4px', d: 'flex', justifyContent: 'center' }}
        >
          <Text size={14} css={{ color: '$error' }}>The total percentage must be 100%</Text>
        </Container>
      )
    }
    return (
      <Collapse.Group css={{ fontSize: '$xs' }}>
        <Collapse title='Resume' css={{ fontSize: '$xs' }}>
          <Container css={{ p: 0 }}>
            <Container css={{ p: 0 }} display='flex' justify='space-between'>
              <Text size={16} css={{ color: '$kondorLigth' }}>Total investment amount</Text>
              <Text size={14} css={{ color: '$kondorLight' }}>{assetSupply} {assetSupplyInputByPorcentage}</Text>
            </Container>
            <Container css={{ p: 0 }} display='flex' justify='space-between'>
              <Text size={16} css={{ color: '$kondorLigth' }}>Your investment will be divided into: </Text>
            </Container>
            {getResumeDetailByAsset(assetPorcentageInput1, assetAmount1, assetAmountUSD1, porcentage1)}
            {inputsAmount > 1 ? getResumeDetailByAsset(assetPorcentageInput2, assetAmount2, assetAmountUSD2, porcentage2) : null}
          </Container>
        </Collapse>
      </Collapse.Group>
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
          defaultValue='byAmount'
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
        {style === StyleType.ALIQUOT ? getInputsByAmount() : getInputsByPorcentage()}
        <Button
          onPress={() => handleCreateButton()}
          bordered
          rounded
          css={{ withd: '100%', m: '4px 0', borderColor: '$kondorPrimary', color: '$white' }}
        >Create
        </Button>
      </Card>
      <ConfirmModal
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm create product'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{getAsset1Input().asset} to be added</Text>
            <Text>{abbreviateNumber(getAsset1Input().amount, 4)} {getAsset1Input().asset}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{getAsset2Input().asset} to be added</Text>
            <Text>{abbreviateNumber(getAsset2Input().amount, 4)} {getAsset2Input().asset}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Total value</Text>
            <Text>≈ ${calculateTotalPrice()}</Text>
          </Container>
        </>
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
        transactionId='4UEKQ5H2YBDPW3FFXM36QDFT2AR6I7X4ZIPW7P32X3YHPTXVOHZQ'
      />
    </Container>
  )
}
