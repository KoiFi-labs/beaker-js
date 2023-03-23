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

enum StyleType {
  BY_AMOUNT = 'byAmount',
  BY_PORCENTAGE = 'byPorcentage'
}

type AssetInput = {
  asset: string,
  amount: number
}

export default function CreateProduct () {
  const [inputsAmount, setInputsAmount] = useState<number>(1)
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balance[]>([])
  const [prices, setPrices] = useState<Price[]>([])
  const [assetInput1, setAssetInput1] = useState<string>('ALGO')
  const [assetInput2, setAssetInput2] = useState<string>('USDC')
  const [assetInput3, setAssetInput3] = useState<string>('USDT')
  const [assetInput4, setAssetInput4] = useState<string>('PLANET')
  const [assetPorcentageInput1, setAssetPorcentageInput1] = useState<string>('ALGO')
  const [assetPorcentageInput2, setAssetPorcentageInput2] = useState<string>('PLANET')
  const [assetPorcentageInput3, setAssetPorcentageInput3] = useState<string>('USDC')
  const [assetPorcentageInput4, setAssetPorcentageInput4] = useState<string>('USDT')
  const [assetSupplyInputByPorcentage, setAssetSupplyInputByPorcentage] = useState<string>('USDC')
  const [style, setStyle] = useState<StyleType>(StyleType.BY_AMOUNT)
  const input1 = useInput('')
  const input2 = useInput('')
  const input3 = useInput('')
  const input4 = useInput('')
  const inputAssetSupplyByPorcentage = useInput('')
  const inputPorcentage1 = useInput('')
  const inputPorcentage2 = useInput('')
  const inputPorcentage3 = useInput('')
  const inputPorcentage4 = useInput('')
  const [inputWithErrors, setInputWithErrors] = useState<boolean>(false)
  const router = useRouter()

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

  const handleRemoveInputButton = () => {
    if (inputsAmount === 1) return
    setInputsAmount(inputsAmount - 1)
    if (style === StyleType.BY_PORCENTAGE) {
      switch (inputsAmount) {
        case 2:
          inputPorcentage2.setValue('')
          break
        case 3:
          inputPorcentage3.setValue('')
          break
        case 4:
          inputPorcentage4.setValue('')
          break
      }
    }
  }

  const handleAddInputButton = () => {
    if (inputsAmount === 4) return
    setInputsAmount(inputsAmount + 1)
  }

  const handlePoolSelectButton1 = (pool: PoolType) => {
    setAssetInput1(pool.pool)
  }

  const handlePoolSelectButton2 = (pool: PoolType) => {
    setAssetInput2(pool.pool)
  }

  const handlePoolSelectButton3 = (pool: PoolType) => {
    setAssetInput3(pool.pool)
  }

  const handlePoolSelectButton4 = (pool: PoolType) => {
    setAssetInput4(pool.pool)
  }

  const handlePoolSelectButtonAssetSupply = (pool: PoolType) => {
    setAssetSupplyInputByPorcentage(pool.pool)
  }

  const handlePoolSelectButtonPorcentage1 = (pool: PoolType) => {
    setAssetPorcentageInput1(pool.pool)
  }

  const handlePoolSelectButtonPorcentage2 = (pool: PoolType) => {
    setAssetPorcentageInput2(pool.pool)
  }

  const handlePoolSelectButtonPorcentage3 = (pool: PoolType) => {
    setAssetPorcentageInput3(pool.pool)
  }

  const handlePoolSelectButtonPorcentage4 = (pool: PoolType) => {
    setAssetPorcentageInput4(pool.pool)
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/product')
  }

  const getAsset1Input: () => AssetInput = () => {
    if (style === StyleType.BY_AMOUNT) {
      return { asset: assetInput1, amount: Number(input1.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput1, Number(inputPorcentage1.value))
    return { asset: assetPorcentageInput1, amount }
  }

  const getAsset2Input: () => AssetInput = () => {
    if (style === StyleType.BY_AMOUNT) {
      return { asset: assetInput2, amount: Number(input2.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput2, Number(inputPorcentage2.value))
    return { asset: assetPorcentageInput2, amount }
  }

  const getAsset3Input: () => AssetInput = () => {
    if (style === StyleType.BY_AMOUNT) {
      return { asset: assetInput3, amount: Number(input3.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput3, Number(inputPorcentage3.value))
    return { asset: assetPorcentageInput3, amount }
  }

  const getAsset4Input: () => AssetInput = () => {
    if (style === StyleType.BY_AMOUNT) {
      return { asset: assetInput4, amount: Number(input4.value) }
    }
    const amount = calculateAssetAmountByPorcentage(assetPorcentageInput3, Number(inputPorcentage3.value))
    return { asset: assetPorcentageInput4, amount }
  }

  const getValueFromAsset = (asset: string) => {
    if (asset === assetInput1) return Number(input1.value)
    if (asset === assetInput2) return Number(input2.value)
    if (asset === assetInput3) return Number(input3.value)
    if (asset === assetInput4) return Number(input4.value)
    return 0
  }

  const handleConfirmButton = async () => {
    setSendingTransactionModalIsVisible(true)
    await sleep(3000)
    const assetsList = [assetInput1, assetInput2, assetInput3, assetInput4].slice(0, inputsAmount)
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
    const price3 = inputsAmount > 2 ? prices.find(p => p.assetSymbol === getAsset3Input().asset) : { price: 0 }
    const price4 = inputsAmount > 3 ? prices.find(p => p.assetSymbol === getAsset4Input().asset) : { price: 0 }

    const total = getAsset1Input().amount * Number(price1?.price) + getAsset2Input().amount * Number(price2?.price) + getAsset3Input().amount * Number(price3?.price) + getAsset4Input().amount * Number(price4?.price)
    return total
  }

  const PoolInput = (
    asset: string,
    value:string,
    onChange: (event: BindingsChangeTarget) => void,
    onSelect: (pool: PoolType) => void,
    label?: string
  ) => {
    const pool = getPoolBySymbol(asset)!
    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={8}>
            <Input
              {...{ value, onChange }}
              label={label || `Add ${asset}`}
              underlined
              placeholder='0.00'
            />
          </Grid>
          <Grid xs={4} css={{ d: 'flex', alignItems: 'center' }}>
            <PoolSelect pool={pool} onPress={onSelect} />
          </Grid>
          <Container display='flex' justify='flex-start' css={{ p: 0 }}>
            <Text size={14} css={{ color: '$kondorGray' }}>Balance {getBalanceFromPool(pool)} {pool.pool}</Text>
          </Container>
        </Grid.Container>
      </Card>
    )
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
        {PoolInput(assetInput1, input1.bindings.value, input1.bindings.onChange, handlePoolSelectButton1)}
        {inputsAmount > 1 ? PoolInput(assetInput2, input2.bindings.value, input2.bindings.onChange, handlePoolSelectButton2) : null}
        {inputsAmount > 2 ? PoolInput(assetInput3, input3.bindings.value, input3.bindings.onChange, handlePoolSelectButton3) : null}
        {inputsAmount > 3 ? PoolInput(assetInput4, input4.bindings.value, input4.bindings.onChange, handlePoolSelectButton4) : null}
        <Container display='flex' justify='center' css={{ p: 0 }}>
          {inputsAmount > 1
            ? <Button bordered rounded onPress={() => handleRemoveInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>-</Button>
            : null}
          <Button bordered rounded onPress={() => handleAddInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>+</Button>
        </Container>
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
          handlePoolSelectButtonAssetSupply,
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
        {
          inputsAmount > 2
            ? PoolPorcentageInput(
              assetPorcentageInput3,
              inputPorcentage3.bindings.value,
              inputPorcentage3.bindings.onChange,
              handlePoolSelectButtonPorcentage3)
            : null
        }
        {
          inputsAmount > 3
            ? PoolPorcentageInput(
              assetPorcentageInput4,
              inputPorcentage4.bindings.value,
              inputPorcentage4.bindings.onChange,
              handlePoolSelectButtonPorcentage4)
            : null
        }
        <Container display='flex' justify='center' css={{ p: 0 }}>
          {inputsAmount > 1
            ? <Button bordered rounded onPress={() => handleRemoveInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>-</Button>
            : null}
          <Button bordered rounded onPress={() => handleAddInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>+</Button>
        </Container>
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
    const porcentage3 = Number(inputPorcentage3.bindings.value)
    const porcentage4 = Number(inputPorcentage4.bindings.value)
    const totalPorcentage = porcentage1 + porcentage2 + porcentage3 + porcentage4
    const assetAmount1 = calculateAssetAmountByPorcentage(assetPorcentageInput1, porcentage1)
    const assetAmount2 = calculateAssetAmountByPorcentage(assetPorcentageInput2, porcentage2)
    const assetAmount3 = calculateAssetAmountByPorcentage(assetPorcentageInput3, porcentage3)
    const assetAmount4 = calculateAssetAmountByPorcentage(assetPorcentageInput4, porcentage4)
    const assetAmountUSD1 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput1, porcentage1)
    const assetAmountUSD2 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput2, porcentage2)
    const assetAmountUSD3 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput3, porcentage3)
    const assetAmountUSD4 = calculateAssetAmountUSDByPorcentage(assetPorcentageInput4, porcentage4)

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
            {inputsAmount > 2 ? getResumeDetailByAsset(assetPorcentageInput3, assetAmount3, assetAmountUSD3, porcentage3) : null}
            {inputsAmount > 3 ? getResumeDetailByAsset(assetPorcentageInput4, assetAmount4, assetAmountUSD4, porcentage4) : null}
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
        <Text size={20} css={{ color: '$kondorLight' }}>Create Product</Text>
        <Spacer y={0.5} />
        <Radio.Group
          orientation='horizontal'
          label='Select style'
          defaultValue='byAmount'
          size='xs'
          onChange={(value) => { setStyle(value as StyleType) }}
        >
          <Radio value={StyleType.BY_AMOUNT} size='xs'>
            By amount
          </Radio>
          <Radio value={StyleType.BY_PORCENTAGE} size='xs'>
            By porcentage
          </Radio>
        </Radio.Group>
        <Spacer y={1} />
        {style === StyleType.BY_AMOUNT ? getInputsByAmount() : getInputsByPorcentage()}
        {style === StyleType.BY_AMOUNT ? null : getResumeByPorcentage()}
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
          {inputsAmount > 2
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{getAsset3Input().asset} to be added</Text>
                <Text>{abbreviateNumber(getAsset3Input().amount)} {getAsset3Input().asset}</Text>
              </Container>)
            : null}
          {inputsAmount > 3
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{getAsset4Input().asset} to be added</Text>
                <Text>{abbreviateNumber(getAsset4Input().amount, 4)} {getAsset4Input().asset}</Text>
              </Container>)
            : null}
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
