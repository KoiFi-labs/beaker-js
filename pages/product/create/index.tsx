import { Button, Text, Container, Card, Grid, Input, useInput } from '@nextui-org/react'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { PoolType, getPoolBySymbol } from '../../../src/services/poolService'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { sleep } from '../../../src/utils/utils'
import { useRouter } from 'next/router'
import { createProduct, getBalances, getPrices } from '../../../src/services/mock'
import { Balance, Price } from '../../../interfaces'
import { BindingsChangeTarget } from '@nextui-org/react/types/use-input/use-input'

export default function CreateProduct () {
  const [inputsAmount, setInputsAmount] = useState<number>(2)
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [balances, setBalances] = useState<Balance[]>([])
  const [prices, setPrices] = useState<Price[]>([])
  const [assetInput1, setAssetInput1] = useState<string>('ALGO')
  const [assetInput2, setAssetInput2] = useState<string>('USDC')
  const [assetInput3, setAssetInput3] = useState<string>('USDT')
  const [assetInput4, setAssetInput4] = useState<string>('PLANET')
  const input1 = useInput('0')
  const input2 = useInput('0')
  const input3 = useInput('0')
  const input4 = useInput('0')
  const router = useRouter()

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
    console.log(input1.value)
  }, [input1.value])

  useEffect(() => {
    console.log(input2.value)
  }, [input2.value])

  useEffect(() => {
    console.log(input3.value)
  }, [input3.value])

  useEffect(() => {
    console.log(input4.value)
  }, [input4.value])

  const handleRemoveInputButton = () => {
    if (inputsAmount === 2) return
    setInputsAmount(inputsAmount - 1)
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

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/product')
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
    const price1 = prices.find(p => p.assetSymbol === assetInput1)
    const price2 = prices.find(p => p.assetSymbol === assetInput2)
    const price3 = inputsAmount > 2 ? prices.find(p => p.assetSymbol === assetInput3) : { price: 0 }
    const price4 = inputsAmount > 3 ? prices.find(p => p.assetSymbol === assetInput4) : { price: 0 }

    const total = Number(input1.value) * Number(price1?.price) + Number(input2.value) * Number(price2?.price) + Number(input3.value) * Number(price3?.price) + Number(input4.value) * Number(price4?.price)
    return total
  }

  const PoolInput = (asset: string, value:string, onChange: (event: BindingsChangeTarget) => void, onSelect: (pool: PoolType) => void) => {
    const pool = getPoolBySymbol(asset)!
    return (
      <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
        <Grid.Container justify='center' css={{ p: '8px' }}>
          <Grid xs={8}>
            <Input {...{ value, onChange }} label={`Add ${asset}`} underlined placeholder='0.00' />
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
        {PoolInput(assetInput1, input1.bindings.value, input1.bindings.onChange, handlePoolSelectButton1)}
        {PoolInput(assetInput2, input2.bindings.value, input2.bindings.onChange, handlePoolSelectButton2)}
        {inputsAmount > 2 ? PoolInput(assetInput3, input3.bindings.value, input3.bindings.onChange, handlePoolSelectButton3) : null}
        {inputsAmount > 3 ? PoolInput(assetInput4, input4.bindings.value, input4.bindings.onChange, handlePoolSelectButton4) : null}
        <Container display='flex' justify='center' css={{ p: 0 }}>
          {inputsAmount > 2
            ? <Button bordered rounded onPress={() => handleRemoveInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>-</Button>
            : null}
          <Button bordered rounded onPress={() => handleAddInputButton()} css={{ minWidth: '40px', width: '40px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>+</Button>
        </Container>
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
            <Text size={16} css={{ color: '$kondorGray' }}>{assetInput1} to be added</Text>
            <Text>{input1.value} {assetInput1}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{assetInput2} to be added</Text>
            <Text>{input2.value} {assetInput2}</Text>
          </Container>
          {inputsAmount > 2
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{assetInput3} to be added</Text>
                <Text>{input3.value} {assetInput3}</Text>
              </Container>)
            : null}
          {inputsAmount > 3
            ? (
              <Container css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{assetInput4} to be added</Text>
                <Text>{input4.value} {assetInput4}</Text>
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
