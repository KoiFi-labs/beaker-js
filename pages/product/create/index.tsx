/* eslint-disable no-unused-vars */
import { Button, Text, Container, Card, Grid, useInput, Radio, Spacer, Collapse, Checkbox, Input, Modal } from '@nextui-org/react'
import { LigthInput } from '../../../src/components/LighInput/LigthInput'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { PoolType, getPoolBySymbol } from '../../../src/services/poolService'
import { useState, useEffect, Dispatch, MutableRefObject, SetStateAction } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { abbreviateNumber, sleep } from '../../../src/utils/utils'
import { compareWithTolerance } from '../../../src/utils/math'
import { useRouter } from 'next/router'
import { createProduct, getBalances, getPrices } from '../../../src/services/mock'
import { Balance, Price } from '../../../interfaces'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'
import { Asset, config } from '../../../config'
import { BiInfoCircle } from 'react-icons/bi'
import { IconButton } from '../../../src/components/IconButton/IconButton'

const assets = config.assetList

enum StyleType {
  BY_AMOUNT = 'byAmount',
  BY_PERCENTAGE = 'byPercentage'
}

type InputType = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  currentRef: MutableRefObject<string>;
  reset: () => void;
  bindings: {
      value: string;
      onChange: (event: BindingsChangeTarget) => void;
  }
}

type AssetInput = {
  asset: Asset
  input: InputType
}

export default function CreateProduct () {
  const [inputsAmount, setInputsAmount] = useState<number>(1)
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balance[]>([])
  const [converToMinimunStableAuto, setConverToMinimunStableAuto] = useState<boolean>(false)
  const [converToEqualWeigthStableAuto, setConverToEqualWeigthStableAuto] = useState<boolean>(false)
  const [hasErrorInsufficentStableQuota, setHasErrorInsufficentStableQuota] = useState<boolean>(false)
  const [hasErrorDifferentWeightStableQuota, setHasErrorDifferentWeightStableQuota] = useState<boolean>(false)
  const [hasErrorPercentage, setHasErrorPercentage] = useState<boolean>(false)
  const [infoStableModalIsVisible, setInfoStableModalIsVisible] = useState<boolean>(false)
  const [infoWeigthStableModalIsVisible, setInfoWeightStableModalIsVisible] = useState<boolean>(false)
  const [prices, setPrices] = useState<Price[]>([])
  const nameInput = useInput('')
  const [asset1, setAsset1] = useState<AssetInput>({
    asset: assets[0],
    input: useInput('')
  })
  const [asset2, setAsset2] = useState<AssetInput>({
    asset: assets[1],
    input: useInput('')
  })
  const [asset3, setAsset3] = useState<AssetInput>({
    asset: assets[2],
    input: useInput('')
  })
  const [asset4, setAsset4] = useState<AssetInput>({
    asset: assets[3],
    input: useInput('')
  })
  const [assetTotalSupply, setAssetTotalSupply] = useState<AssetInput>({
    asset: assets[0],
    input: useInput('')
  })

  const [style, setStyle] = useState<StyleType>(StyleType.BY_AMOUNT)
  const router = useRouter()

  const handleStyleChange = (value: StyleType) => {
    setStyle(value)
    clearInputs()
  }

  const clearInputs = () => {
    asset1.input.value = ''
    asset1.input.setValue('')
    asset2.input.value = ''
    asset2.input.setValue('')
    asset3.input.value = ''
    asset3.input.setValue('')
    asset4.input.value = ''
    asset4.input.setValue('')
    assetTotalSupply.input.value = ''
    assetTotalSupply.input.setValue('')
  }

  const getPrice = (asset: string) => {
    const price = prices.find(p => p.assetSymbol === asset)
    return price?.price || 0
  }

  const getBalance = (asset: string) => {
    const balance = balances.find(b => b.assetSymbol === asset)
    return balance?.amount || 0
  }

  const getAssetByName: (assetSymbol: string) => Asset | undefined = (assetSymbol: string) => {
    return assets.find(a => a.symbol === assetSymbol)
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
    switch (inputsAmount) {
      case 1:
        return
      case 2:
        asset1.input.setValue('')
        break
      case 3:
        asset2.input.setValue('')
        break
      case 4:
        asset3.input.setValue('')
        break
    }
    setInputsAmount(inputsAmount - 1)
  }

  const handleAddInputButton = () => {
    if (inputsAmount === 4) return
    setInputsAmount(inputsAmount + 1)
  }

  const handlePoolSelectButton1 = (pool: PoolType) => {
    const asset = getAssetByName(pool.pool)
    if (!asset) throw new Error(`Invalid asset, ${pool.pool} not found`)
    setAsset1({ asset, input: asset1.input })
  }

  const handlePoolSelectButton2 = (pool: PoolType) => {
    const asset = getAssetByName(pool.pool)
    if (!asset) throw new Error(`Invalid asset, ${pool.pool} not found`)
    setAsset2({ asset, input: asset2.input })
  }

  const handlePoolSelectButton3 = (pool: PoolType) => {
    const asset = getAssetByName(pool.pool)
    if (!asset) throw new Error(`Invalid asset, ${pool.pool} not found`)
    setAsset3({ asset, input: asset3.input })
  }

  const handlePoolSelectButton4 = (pool: PoolType) => {
    const asset = getAssetByName(pool.pool)
    if (!asset) throw new Error(`Invalid asset, ${pool.pool} not found`)
    setAsset4({ asset, input: asset4.input })
  }

  const handlePoolSelectButtonAssetSupply = (pool: PoolType) => {
    const asset = getAssetByName(pool.pool)
    if (!asset) throw new Error(`Invalid asset, ${pool.pool} not found`)
    setAssetTotalSupply({ asset, input: assetTotalSupply.input })
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/product')
  }

  const handleConfirmButton = async () => {
    setSendingTransactionModalIsVisible(true)
    await sleep(3000)
    const inputsList = [asset1, asset2, asset3, asset4].slice(0, inputsAmount)
    const name = nameInput.value || inputsList.map(i => i.asset.symbol).join('/')
    await createProduct({
      name,
      id: Math.ceil(Math.random() * 9999999),
      assets: inputsList.map(i => ({
        symbol: i.asset.symbol,
        amount: Number(i.input.value)
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
    if (style === StyleType.BY_PERCENTAGE) {
      return getPrice(assetTotalSupply.asset.symbol) * Number(assetTotalSupply.input.value)
    }
    // STYLE BY AMOUNT
    const price1 = getPrice(asset1.asset.symbol)
    const price2 = getPrice(asset2.asset.symbol)
    const price3 = inputsAmount > 2 ? getPrice(asset3.asset.symbol) : 0
    const price4 = inputsAmount > 3 ? getPrice(asset4.asset.symbol) : 0

    const total = Number(asset1.input.value) * price1 + Number(asset2.input.value) * price2 + Number(asset3.input.value) * price3 + Number(asset4.input.value) * price4
    return total
  }

  const PoolInput = (
    assetInput: AssetInput,
    setAsset: (asset: AssetInput) => void,
    onSelect: (pool: PoolType) => void
  ) => {
    const pool = getPoolBySymbol(assetInput.asset.symbol)!
    const onChange = (e: BindingsChangeTarget) => {
      assetInput.input.bindings.onChange(e)
      setAsset({ ...assetInput, input: { ...assetInput.input, value: assetInput.input.currentRef.current } })
    }
    return (
      <Card key={`${pool.pool}${Math.random}`} css={{ $$cardColor: '$colors$gray50', m: '8px 0px' }}>
        <Grid.Container justify='center' css={{ p: '16px' }}>
          <Grid xs={6} css={{ d: 'flex', flexDirection: 'column' }}>
            <LigthInput
              value={assetInput.input.currentRef.current}
              onChange={onChange}
              placeholder='0.00'
            />
            <Text size={14} css={{ color: '$kondorGray' }}>Balance {getBalanceFromPool(pool)} {pool.pool}</Text>
          </Grid>
          <Grid xs={6} css={{ d: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <PoolSelect pool={pool} onPress={onSelect} />
          </Grid>
        </Grid.Container>
      </Card>
    )
  }

  const calculateAssetAmountByPercentage = (asset: string, percentage: number) => {
    const supplyInput = Number(assetTotalSupply.input.value)
    const supplyInputUSD = supplyInput * getPrice(assetTotalSupply.asset.symbol)
    const assetAmountUDS = (supplyInputUSD * percentage) / 100
    const assetAmount = getPrice(asset) === 0 ? 0 : assetAmountUDS / getPrice(asset)
    return assetAmount
  }

  const calculateAssetAmountUSDByPercentage = (percentage: number) => {
    const supplyInput = Number(assetTotalSupply.input.value)
    const supplyInputUSD = supplyInput * getPrice(assetTotalSupply.asset.symbol)
    const assetAmountUDS = (supplyInputUSD * percentage) / 100
    return assetAmountUDS
  }

  useEffect(() => {
    checkErrorStableQuota()
    checkErrorDifferentWeightStableQuota()
    style === StyleType.BY_PERCENTAGE && checkErrorPercentage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset1, asset2, asset3, asset4, assetTotalSupply, converToMinimunStableAuto, style])

  const hasErrors = () => {
    return (
      hasErrorInsufficentStableQuota ||
      hasErrorPercentage ||
      hasErrorDifferentWeightStableQuota
    )
  }

  const checkErrorPercentage = () => {
    const percentage1 = Number(asset1.input.value)
    const percentage2 = Number(asset2.input.value)
    const percentage3 = Number(asset3.input.value)
    const percentage4 = Number(asset4.input.value)
    const totalPercentage = percentage1 + percentage2 + percentage3 + percentage4
    const hasError = totalPercentage !== 100 && totalPercentage !== 0
    setHasErrorPercentage(hasError)
  }

  const checkErrorStableQuota = () => {
    if (converToMinimunStableAuto) return setHasErrorInsufficentStableQuota(false)
    calculateAmountOfStablePercentage() < 5 ? setHasErrorInsufficentStableQuota(true) : setHasErrorInsufficentStableQuota(false)
  }

  const checkErrorDifferentWeightStableQuota = () => {
    if (converToEqualWeigthStableAuto) return setHasErrorDifferentWeightStableQuota(false)
    isBalancedOnStable() ? setHasErrorDifferentWeightStableQuota(false) : setHasErrorDifferentWeightStableQuota(true)
  }

  const errorDetails = () => {
    if (!hasErrors()) return null
    return (
      <Card css={{ bgColor: '#f59e98', p: '8px 16px', m: '8px 0px' }}>
        {hasErrorPercentage && <Text size={16} color='error'>The total percentage must be 100%</Text>}
        {hasErrorInsufficentStableQuota && <Text size={16} color='error'>Your investment must have at least 5% in our Stable Pool (USDC - USTD)</Text>}
        {hasErrorDifferentWeightStableQuota && <Text size={16} color='error'>Your investment must be balanced in USDC - USTD</Text>}
      </Card>
    )
  }

  const calculateAmountOfStablePercentage = () => {
    const inputs = [asset1, asset2, asset3, asset4]
    const stableInputs = inputs.filter(input => input.asset.symbol === 'USDT' || input.asset.symbol === 'USDC')

    if (style === StyleType.BY_PERCENTAGE) {
      const stablePercentage = stableInputs.reduce((acc, input) => acc + Number(input.input.value), 0)
      return stablePercentage
    }
    // BY_AMOUNT
    const totalValue = calculateTotalPrice()
    const stableValue = stableInputs.reduce((acc, input) => acc + Number(input.input.value) * getPrice(input.asset.symbol), 0)
    return (stableValue * 100) / totalValue
  }

  const isBalancedOnStable = () => {
    const inputs = [asset1, asset2, asset3, asset4]
    const usdcInputs = inputs.filter(input => input.asset.symbol === 'USDC')
    const usdtInputs = inputs.filter(input => input.asset.symbol === 'USDT')
    if (style === StyleType.BY_PERCENTAGE) {
      const usdcPercentage = usdcInputs.reduce((acc, input) => acc + Number(input.input.value), 0)
      const usdtPercentage = usdtInputs.reduce((acc, input) => acc + Number(input.input.value), 0)
      return usdcPercentage === usdtPercentage
    }
    // BY_AMOUNT
    const usdcValue = usdcInputs.reduce((acc, input) => acc + Number(input.input.value) * getPrice(input.asset.symbol), 0)
    const usdtValue = usdtInputs.reduce((acc, input) => acc + Number(input.input.value) * getPrice(input.asset.symbol), 0)
    return compareWithTolerance(usdcValue, usdtValue)
  }

  const PoolPercentageInput = (
    assetInput: AssetInput,
    setAsset: (asset: AssetInput) => void,
    onSelect: (pool: PoolType) => void
  ) => {
    const pool = getPoolBySymbol(assetInput.asset.symbol)!
    const assetAmount = calculateAssetAmountByPercentage(assetInput.asset.symbol, Number(assetInput.input.value))
    console.log(assetAmount)
    const assetAmountUDS = calculateAssetAmountUSDByPercentage(Number(assetInput.input.value))
    const assetAmountString = abbreviateNumber(assetAmount, 2)
    const assetAmountUSDString = abbreviateNumber(assetAmountUDS, 2)
    const onChange = (e: BindingsChangeTarget) => {
      assetInput.input.bindings.onChange(e)
      setAsset({ ...assetInput, input: { ...assetInput.input, value: assetInput.input.currentRef.current } })
    }
    const value = Number(assetInput.input.value)

    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray50', m: '8px 0px' }}>
        <Grid.Container justify='center' css={{ p: '16px' }}>
          <Grid xs={6} css={{ d: 'flex', flexDirection: 'column' }}>
            <Grid.Container>
              <Grid xs={6} css={{ d: 'flex', flexDirection: 'column' }}>
                <Text size={14} css={{ color: '$kondorGray' }}>{pool.pool} %</Text>
                <LigthInput
                  value={assetInput.input.currentRef.current}
                  onChange={onChange}
                  placeholder='0.00'
                />
              </Grid>
            </Grid.Container>
            <Container display='flex' justify='flex-start' css={{ p: 0 }}>
              {value > 100
                ? <Text size={14} b css={{ color: '$error' }}>Percentage must be less than 100</Text>
                : (
                  <>
                    <Text size={14} css={{ color: '$kondorGray' }}>≈{assetAmountString} {pool.pool} </Text>
                    <Spacer x={1} />
                    <Text size={14} css={{ color: '$kondorGray' }}>≈{assetAmountUSDString} USD</Text>
                  </>
                  )}
            </Container>
          </Grid>
          <Grid xs={6} css={{ d: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <PoolSelect pool={pool} onPress={onSelect} />
          </Grid>
        </Grid.Container>
      </Card>
    )
  }
  const getInputsByAmount = () => {
    return (
      <>
        {PoolInput(asset1, setAsset1, handlePoolSelectButton1)}
        {inputsAmount > 1 ? PoolInput(asset2, setAsset2, handlePoolSelectButton2) : null}
        {inputsAmount > 2 ? PoolInput(asset3, setAsset3, handlePoolSelectButton3) : null}
        {inputsAmount > 3 ? PoolInput(asset4, setAsset4, handlePoolSelectButton4) : null}
      </>
    )
  }

  const getInputsByPercentage = () => {
    return (
      <>
        <Text size={16} css={{ color: '$kondorGray' }}>Enter total supply</Text>
        {PoolInput(
          assetTotalSupply,
          setAssetTotalSupply,
          handlePoolSelectButtonAssetSupply
        )}
        <Spacer y={1} />
        <Text size={16} css={{ color: '$kondorGray' }}>Enter the percentages</Text>
        {PoolPercentageInput(
          asset1,
          setAsset1,
          handlePoolSelectButton1
        )}
        {
          inputsAmount > 1
            ? PoolPercentageInput(
              asset2,
              setAsset2,
              handlePoolSelectButton2)
            : null
        }
        {
          inputsAmount > 2
            ? PoolPercentageInput(
              asset3,
              setAsset3,
              handlePoolSelectButton3)
            : null
        }
        {
          inputsAmount > 3
            ? PoolPercentageInput(
              asset4,
              setAsset4,
              handlePoolSelectButton4)
            : null
        }
        <Card css={{ $$cardColor: '$colors$gray50', m: '8px 0px' }}>
          <Grid.Container justify='center' css={{ p: '16px' }}>
            <Grid xs={6} css={{ d: 'flex', flexDirection: 'column' }}>
              <Text>5%</Text>
            </Grid>
            <Grid xs={6} css={{ d: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text>Stable (USDC | USDT)</Text>
            </Grid>
          </Grid.Container>
        </Card>
      </>
    )
  }

  const getAmountInputsControler = () => {
    return (
      <Container display='flex' justify='center' css={{ p: 0 }}>
        {inputsAmount > 1
          ? (
            <Button
              bordered
              rounded
              onPress={() => handleRemoveInputButton()}
              css={{
                minWidth: '40px',
                width: '40px',
                m: '4px',
                borderColor: '$kondorPrimary',
                color: '$kondorPrimary',
                zIndex: 1
              }}
            >
              -
            </Button>
            )
          : null}
        {inputsAmount < 4
          ? (
            <Button
              bordered
              rounded
              onPress={() => handleAddInputButton()}
              css={{
                minWidth: '40px',
                width: '40px',
                m: '4px',
                borderColor: '$kondorPrimary',
                color: '$kondorPrimary',
                zIndex: 1
              }}
            >
              +
            </Button>
            )
          : null}
      </Container>
    )
  }

  const getResumeDetailByAsset = (asset: string, amount: number, amountUSD: number, percentage: number) => {
    return (
      <Grid.Container>
        <Grid xs={6}>
          <Text size={14} css={{ color: '$kondorGray' }}>{percentage}% {asset}</Text>
        </Grid>
        <Grid xs={6} css={{ d: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'column' }}>
          <Text size={14} css={{ color: '$kondorLight' }}>{abbreviateNumber(amount)} {asset}</Text>
          <Text size={12} css={{ color: '$kondorGray' }}>≈ ${abbreviateNumber(amountUSD)}</Text>
        </Grid>
      </Grid.Container>
    )
  }

  const getResumeByPercentage = () => {
    const assetSupply = Number(assetTotalSupply.input.value)
    const percentage1 = Number(asset1.input.value)
    const percentage2 = Number(asset2.input.value)
    const percentage3 = Number(asset3.input.value)
    const percentage4 = Number(asset4.input.value)
    const totalPercentage = percentage1 + percentage2 + percentage3 + percentage4
    const assetAmount1 = calculateAssetAmountByPercentage(asset1.asset.symbol, percentage1)
    const assetAmount2 = calculateAssetAmountByPercentage(asset2.asset.symbol, percentage2)
    const assetAmount3 = calculateAssetAmountByPercentage(asset3.asset.symbol, percentage3)
    const assetAmount4 = calculateAssetAmountByPercentage(asset4.asset.symbol, percentage4)
    const assetAmountUSD1 = calculateAssetAmountUSDByPercentage(percentage1)
    const assetAmountUSD2 = calculateAssetAmountUSDByPercentage(percentage2)
    const assetAmountUSD3 = calculateAssetAmountUSDByPercentage(percentage3)
    const assetAmountUSD4 = calculateAssetAmountUSDByPercentage(percentage4)

    if (totalPercentage !== 100 && totalPercentage !== 0) {
      return (
        <Container
          css={{ p: '4px', d: 'flex', justifyContent: 'center' }}
        >
          <Text size={14} css={{ color: '$error' }}>The total percentage must be 100%</Text>
        </Container>
      )
    }
    return (
      <Collapse.Group css={{ fontSize: '$xs', p: 0 }}>
        <Collapse title='Summary' css={{ fontSize: '$xs' }}>
          <Container css={{ p: 0 }}>
            <Container css={{ p: 0 }} display='flex' justify='space-between'>
              <Text size={16} css={{ color: '$kondorLigth' }}>Total investment amount</Text>
              <Text size={14} css={{ color: '$kondorLight' }}>{assetSupply} {assetTotalSupply.asset.symbol}</Text>
            </Container>
            <Container css={{ p: 0 }} display='flex' justify='space-between'>
              <Text size={16} css={{ color: '$kondorLigth' }}>Your investment will be divided into: </Text>
            </Container>
            {getResumeDetailByAsset(asset1.asset.symbol, assetAmount1, assetAmountUSD1, percentage1)}
            {inputsAmount > 1 ? getResumeDetailByAsset(asset2.asset.symbol, assetAmount2, assetAmountUSD2, percentage2) : null}
            {inputsAmount > 2 ? getResumeDetailByAsset(asset3.asset.symbol, assetAmount3, assetAmountUSD3, percentage3) : null}
            {inputsAmount > 3 ? getResumeDetailByAsset(asset4.asset.symbol, assetAmount4, assetAmountUSD4, percentage4) : null}
          </Container>
        </Collapse>
      </Collapse.Group>
    )
  }

  const getNameInput = () => {
    const handleNameInput = nameInput.bindings.onChange
    return (
      <Input
        label='Product name'
        placeholder='Choose a name for your product'
        color='secondary'
        size='lg'
        value={nameInput.bindings.value}
        onChange={handleNameInput}
        css={{ width: '100%', m: '4px 0', color: '$kondorPrimary' }}
      />
    )
  }

  const getStableDetails = () => {
    return (
      <>
        <Grid.Container>
          <Grid xs={10}>
            <Checkbox size='xs' isSelected={converToMinimunStableAuto} onChange={setConverToMinimunStableAuto}>
              Convert 5% to stablecoin (2.5% USDC - 2.5% USDT) automatically if needed
            </Checkbox>
          </Grid>
          <Grid xs={2} css={{ d: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => { setInfoStableModalIsVisible(true) }}>
              <BiInfoCircle size={24} />
            </IconButton>
          </Grid>
          <Modal
            closeButton
            aria-labelledby='infoStableModal'
            open={infoStableModalIsVisible}
            onClose={() => { setInfoStableModalIsVisible(false) }}
            css={{
              m: '16px',
              bgColor: '$black',
              border: '1px solid $kondorLigth'
            }}
          >
            <Text b size={20} css={{ color: '$kondorLigth' }}>Automatic Stablecoin conversion</Text>
            <Container css={{ p: '16px', textAlign: 'left' }}>
              <Text size={14} css={{ color: '$kondorLigth' }}>
                All products must have at least 5% invested in our stablecoin USD (2.5% USDC - 2.5% USDT).
                You can select this option to automatically convert 2.5% to USDT and 2.5% to USDC if you do not have the minimum.
              </Text>
            </Container>
          </Modal>
        </Grid.Container>
        <Grid.Container>
          <Grid xs={10}>
            <Checkbox size='xs' isSelected={converToEqualWeigthStableAuto} onChange={setConverToEqualWeigthStableAuto}>
              Balance stablecoin (USDC - USDT) automatically if needed
            </Checkbox>
          </Grid>
          <Grid xs={2} css={{ d: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => { setInfoWeightStableModalIsVisible(true) }}>
              <BiInfoCircle size={24} />
            </IconButton>
          </Grid>
          <Modal
            closeButton
            aria-labelledby='infoWeigthStableModal'
            open={infoWeigthStableModalIsVisible}
            onClose={() => { setInfoWeightStableModalIsVisible(false) }}
            css={{
              m: '16px',
              bgColor: '$black',
              border: '1px solid $kondorLigth'
            }}
          >
            <Text b size={20} css={{ color: '$kondorLigth' }}>Automatic balance stablecoin</Text>
            <Container css={{ p: '16px', textAlign: 'left' }}>
              <Text size={14} css={{ color: '$kondorLigth' }}>
                All products must have the same amount of USDT and USDC.
                You can select this option to automatically balance your investment in the same amount of USDT and USDC
              </Text>
            </Container>
          </Modal>
        </Grid.Container>
      </>
    )
  }

  const getConfirmButton = () => {
    return (
      <Button
        onPress={() => handleCreateButton()}
        bordered
        disabled={hasErrors()}
        rounded
        css={{ width: '100%', m: '4px 0', borderColor: '$kondorPrimary', color: '$white' }}
      >Create
      </Button>
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
        <Text h1>Create product</Text>
        <Spacer y={1.5} />
        {getNameInput()}
        <Spacer y={1} />
        <Radio.Group
          orientation='horizontal'
          label='Select style'
          defaultValue='byAmount'
          size='xs'
          onChange={(value) => { handleStyleChange(value as StyleType) }}
        >
          <Radio value={StyleType.BY_AMOUNT} size='xs'>
            By amount
          </Radio>
          <Radio value={StyleType.BY_PERCENTAGE} size='xs'>
            By percentage
          </Radio>
        </Radio.Group>
        <Spacer y={1} />
        {style === StyleType.BY_AMOUNT ? getInputsByAmount() : getInputsByPercentage()}
        <Spacer y={1} />
        {getAmountInputsControler()}
        <Spacer y={1} />
        {getStableDetails()}
        <Spacer y={1} />
        {errorDetails()}
        {style === StyleType.BY_PERCENTAGE && !hasErrors() ? getResumeByPercentage() : null}
        <Spacer y={1} />
        {getConfirmButton()}
      </Container>
      <ConfirmModal
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm create product'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{asset1.asset.symbol} to be added</Text>
            <Text>{abbreviateNumber(Number(asset1.input.value), 4)} {asset1.asset.symbol}</Text>
          </Container>
          {inputsAmount > 1
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{asset2.asset.symbol} to be added</Text>
                <Text>{abbreviateNumber(Number(asset2.input.value), 4)} {asset2.asset.symbol}</Text>
              </Container>)
            : null}
          {inputsAmount > 2
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{asset3.asset.symbol} to be added</Text>
                <Text>{abbreviateNumber(Number(asset3.input.value), 4)} {asset3.asset.symbol}</Text>
              </Container>)
            : null}
          {inputsAmount > 3
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{asset4.asset.symbol} to be added</Text>
                <Text>{abbreviateNumber(Number(asset4.input.value), 4)} {asset4.asset.symbol}</Text>
              </Container>)
            : null}
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Total value</Text>
            <Text>≈ ${calculateTotalPrice().toFixed(6)}</Text>
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
