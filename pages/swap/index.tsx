import React, { useEffect, useState } from 'react'
import { Button, Text, Container, Card, Grid, Input, useInput, Loading, Spacer } from '@nextui-org/react'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'

import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { getSwapResult, swap } from '../../src/services/kondorServices/pondServise'
import { DownArrowAltIcon } from '../../public/icons/down-arrow-alt'
import ConfirmModal from '../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../src/components/modules/Modals/SuccessfulTransactionModal'

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
  const outInput = useInput('0')
  const inInput = useInput('0')
  const slippageText = 'If the price changes by more than your slippage tolerance your transaction will revert.'

  useEffect(() => {
    const outAmount = Number(outInput.value)
    if (outAmount > 0) {
      getSwapResult(outAmount, outAsset.id, inAsset.id)
        .then((result: number) => inInput.setValue(result.toFixed(4).toString()))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outInput, outAsset, inAsset])

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
      const amount = Number(outInput.value)
      const result = await swap(account.addr, amount, outAsset.id)
      setTransactionId(result.txId)
      outInput.setValue('')
      inInput.setValue('')
      reloadBalances()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
    setSuccessfulTransactionModalVisible(true)
  }

  const handleSwapButton = () => {
    console.log('outInput.value', outInput.value)
    if (Number(outInput.value) > 0) {
      console.log('outInput.value!!!!', outInput.value)
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

  return (
    <Container fluid display='flex' justify='center' alignItems='center' css={{ minHeight: '85vh' }}>
      <Card css={{
        mw: '330px',
        maxWidth: '500px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Card.Header>
          <Text b>Swap</Text>
        </Card.Header>
        <Container display='flex' justify='center' css={{ p: '10px' }}>
          <Card css={{ $$cardColor: '$colors$gray100' }}>
            <Card.Body>
              <Grid.Container justify='center' css={{ p: '10px 0 0 0' }}>
                <Grid xs={8}>
                  <Input {...outInput.bindings} label='From' underlined placeholder='0.00' />
                </Grid>
                <Grid xs={4}>
                  <AssetSelect asset={outAsset} onPress={handleSellAssetSelect} />
                </Grid>
                <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                  <Text size={14} css={{ color: '$kondorGray' }}>Balance {balanceToSell.toFixed(4)} {outAsset.symbol}</Text>
                </Container>
              </Grid.Container>
            </Card.Body>
          </Card>
          <Button
            onPress={() => { handleCentralButton() }}
            css={{
              margin: '20px',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              minWidth: '0px',
              backgroundColor: '$kondorPrimary'
            }}
          >
            <DownArrowAltIcon fill='#454545' />
          </Button>
          <Card css={{ $$cardColor: '$colors$gray100' }}>
            <Card.Body>
              <Grid.Container justify='center' css={{ p: '10px 0 0 0' }}>
                <Grid xs={8}>
                  <Input {...inInput.bindings} label='To' underlined placeholder='0.00' />
                </Grid>
                <Grid xs={4}>
                  <AssetSelect asset={inAsset} onPress={handleBuyAssetSelect} />
                </Grid>
                <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                  <Text size={14} css={{ color: '$kondorGray' }}>Balance {balanceToBuy.toFixed(4)} {inAsset.symbol}</Text>
                </Container>
              </Grid.Container>
            </Card.Body>
          </Card>
          <Container display='flex' justify='space-between' css={{ p: '16px 8px', m: 0 }}>
            <Text size={16} css={{ color: '$kondorGray' }}>
              You will receive a minimun of
            </Text>
            <Text size={16} css={{ color: '$kondorGray' }}>
              {(Number(inInput.value) * 0.995).toFixed(4)} {inAsset.symbol}
            </Text>
          </Container>
          {
                        !isConnected
                          ? <Button disabled size='xl' css={{ width: '100%', background: '$kondorPrimary' }}>Connect your wallet</Button>
                          : loading
                            ? <Button disabled size='xl' css={{ width: '100%' }}><Loading css={{ color: '$kondorGray' }} /></Button>
                            : <Button size='xl' css={{ width: '100%', background: '$kondorPrimary' }} onPress={() => handleSwapButton()}>Swap</Button>
                        }
        </Container>
      </Card>
      <ConfirmModal
        isVisible={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm swap'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Out</Text>
            <Text>{outInput.value} {outAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>In</Text>
            <Text>≈ {inInput.value} {inAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Slippage Tolerance</Text>
            <Text>0.05%</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>You will receive a minimun of</Text>
            <Text>{(Number(inInput.value) * 0.995).toFixed(4)} {inAsset.symbol}</Text>
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
