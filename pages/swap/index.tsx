import React, { useEffect, useState } from 'react'
import { Button, Text, Container, Card, Grid, useInput, Loading, Spacer } from '@nextui-org/react'
import { Input } from '../../src/components/Input/Input'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { getSwapInput, getSwapOutput, swap } from '../../src/services/kondorServices/symmetricPoolServise'
import ConfirmModal from '../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../src/components/modules/Modals/SuccessfulTransactionModal'
import { BsArrowDownUp } from 'react-icons/bs'

export default function Swap () {
  const [outAsset, setOutAsset] = useState<Asset>(config.assetList[0])
  const [inAsset, setInAsset] = useState<Asset>(config.assetList[1])
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [balanceToSell, setBalanceToSell] = useState<number>(0)
  const [balanceToBuy, setBalanceToBuy] = useState<number>(0)
  const [successfulTransactionModalVisible, setSuccessfulTransactionModalVisible] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { isConnected, balances, account, reloadBalances } = useWallet()
  const [flag, setFlag] = useState<boolean>(false)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null)
  const sellInput = useInput('0.00')
  const buyInput = useInput('0.00')
  const slippageText = 'If the price changes by more than your slippage tolerance your transaction will revert.'

  useEffect(() => {
    if (sellInput.value) {
      getSwapInput(Number(sellInput.value), outAsset.id, inAsset.id)
        .then((amount: number) => { buyInput.setValue(amount === 0 ? '0.00' : amount.toFixed(6)) })
    }
    if (buyInput.value) {
      getSwapOutput(Number(buyInput.value), outAsset.id, inAsset.id)
        .then((amount: number) => { sellInput.setValue(amount === 0 ? '0.00' : amount.toFixed(6)) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAsset, outAsset, flag])

  const runTimmer = () => {
    if (timerId) {
      clearTimeout(timerId)
      setTimerId(null)
    }
    const newTimerId = setTimeout(() => {
      setFlag(!flag)
      setTimerId(null)
    }, 2000)
    setTimerId(newTimerId)
  }

  const onChangeSellInput = (e: any) => {
    sellInput.setValue(e.target.value)
    buyInput.setValue('')
    runTimmer()
  }

  const onChangeBuyInput = (e: any) => {
    buyInput.setValue(e.target.value)
    sellInput.setValue('')
    runTimmer()
  }

  // RUN TIMMER se encargara de setear el flag despues de un segundo. Esto es para evitar que se hagan muchas peticiones al servidor,
  // si el timmer esta corriendo, este volvera a correr y se cancelara la peticion anterior.

  const handleSellAssetSelect = (asset: Asset) => asset === inAsset
    ? (setInAsset(outAsset), setOutAsset(asset))
    : setOutAsset(asset)

  const handleBuyAssetSelect = (asset: Asset) => asset === outAsset
    ? (setOutAsset(inAsset), setInAsset(asset))
    : setInAsset(asset)

  const handleCentralButton = () => {
    const inAssetTemp: Asset = inAsset
    setInAsset(outAsset)
    setOutAsset(inAssetTemp)
  }

  const handleConfirmButton = async () => {
    try {
      setConfirmModalVisible(false)
      setLoading(true)
      const amount = Number(sellInput.value)
      const result = await swap(account.addr, amount, outAsset.id)
      setTransactionId(result.txId)
      sellInput.setValue('')
      buyInput.setValue('')
      reloadBalances()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
    setSuccessfulTransactionModalVisible(true)
  }

  const handleSwapButton = () => {
    if (Number(sellInput.value) > 0) {
      setConfirmModalVisible(true)
    }
  }

  useEffect(() => {
    if (isConnected) {
      setBalanceToSell(0)
      setBalanceToBuy(0)
      balances.forEach((b: Balance) => {
        if (b.assetId === outAsset.id) setBalanceToSell(microToStandard(b.amount))
        if (b.assetId === inAsset.id) setBalanceToBuy(microToStandard(b.amount))
      })
    } else {
      setBalanceToSell(0)
      setBalanceToBuy(0)
    }
  }, [outAsset, inAsset, isConnected, balances])

  const handleOkButton = () => {
    setSuccessfulTransactionModalVisible(false)
  }

  const getActionButton = () => {
    if (!isConnected) {
      return (
        <Button
          disabled
          bordered
          rounded
          css={{ borderColor: '$kondorPrimary', color: '$kondorLigth', width: '100%' }}
        >
          Connect your wallet
        </Button>
      )
    }
    if (loading) {
      return <Button disabled bordered rounded css={{ borderColor: '$kondorPrimary', color: '$kondorLigth', width: '100%' }}><Loading css={{ color: '$kondorGray' }} /></Button>
    }
    return (
      <Button
        rounded
        bordered
        css={{
          width: '100%',
          color: '$white',
          borderColor: '$kondorPrimary'
        }}
        onPress={() => handleSwapButton()}
      >
        Swap
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
        <Text h1>Swap</Text>
        <Container display='flex' justify='center' css={{ p: 0 }}>
          <Card css={{ p: '16px' }}>
            <Grid.Container justify='center' css={{ p: 0 }}>
              <Grid xs={8} css={{ d: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Input
                  aria-label='Amount to sell'
                  onChange={onChangeSellInput}
                  value={sellInput.value}
                  placeholder='0.00'
                />
                <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                  <Text size={14} css={{ color: '$kondorGray' }}>
                    Balance {balanceToSell ? balanceToSell.toFixed(4) : 0} {outAsset.symbol}
                  </Text>
                </Container>
              </Grid>
              <Grid xs={4} css={{ d: 'flex', justifyContent: 'flex-end' }}>
                <AssetSelect asset={outAsset} onPress={handleSellAssetSelect} />
              </Grid>
            </Grid.Container>
          </Card>
          <Button
            bordered
            rounded
            onPress={() => { handleCentralButton() }}
            css={{
              height: '40px',
              minWidth: '40px',
              w: '40px',
              color: '$kondorLigth',
              borderColor: '$kondorPrimary',
              m: '16px'
            }}
          >
            <BsArrowDownUp size={20} />
          </Button>
          <Card css={{ p: '16px' }}>
            <Grid.Container justify='center'>
              <Grid xs={8} css={{ d: 'flex', flexDirection: 'column' }}>
                <Input
                  aria-label='Amount to buy'
                  onChange={onChangeBuyInput}
                  value={buyInput.value}
                  placeholder='0.00'
                />
                <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                  <Text size={14} css={{ color: '$kondorGray' }}>
                    Balance {balanceToBuy ? balanceToBuy.toFixed(4) : 0} {inAsset.symbol}
                  </Text>
                </Container>
              </Grid>
              <Grid xs={4} css={{ d: 'flex', justifyContent: 'flex-end' }}>
                <AssetSelect asset={inAsset} onPress={handleBuyAssetSelect} />
              </Grid>
            </Grid.Container>
          </Card>
          <Container css={{ m: 0, p: '24px 16px' }}>
            <Container display='flex' justify='space-between' css={{ p: 0, m: 0 }}>
              <Text size={14} css={{ color: '$kondorGray' }}>
                You will receive a minimun of
              </Text>
              <Text size={14} css={{ color: '$kondorGray' }}>
                {Number(buyInput.value) ? (Number(buyInput.value) * 0.995).toFixed(4) : 0} {inAsset.symbol}
              </Text>
            </Container>
            <Container display='flex' justify='space-between' css={{ p: 0, m: 0 }}>
              <Text size={14} css={{ color: '$kondorGray' }}>
                Slippage tolerance
              </Text>
              <Text size={14} css={{ color: '$kondorGray' }}>
                0.5%
              </Text>
            </Container>
          </Container>
          {getActionButton()}
        </Container>
      </Container>
      <ConfirmModal
        isVisible={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm swap'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Out</Text>
            <Text>{sellInput.value} {outAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>In</Text>
            <Text>≈ {Number(buyInput.value).toFixed(4)} {inAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Slippage Tolerance</Text>
            <Text>0.05%</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>You will receive a minimun of</Text>
            <Text>{(Number(buyInput.value) * 0.995).toFixed(4)} {inAsset.symbol}</Text>
          </Container>
          <Spacer y={1} />
          <Container css={{ p: 0 }}>
            <Text size={12} css={{ color: '$kondorGray' }}>{slippageText}</Text>
          </Container>
        </>
      </ConfirmModal>
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalVisible}
        onHide={() => setSuccessfulTransactionModalVisible(false)}
        onPress={() => { handleOkButton() }}
        transactionId={transactionId}
      />
    </Container>
  )
}
