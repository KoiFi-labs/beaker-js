import React, { useEffect, useState } from 'react'
import { Button, Text, Container, Card, Grid, Input, useInput, Loading, Spacer } from '@nextui-org/react'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { getSwapResult, swap } from '../../src/services/kondorServices/symmetricPoolServise'
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
  const [inAmount, setInAmount] = useState<number>(0)
  const { isConnected, balances, account, reloadBalances } = useWallet()
  const outInput = useInput('0.00')
  const slippageText = 'If the price changes by more than your slippage tolerance your transaction will revert.'

  useEffect(() => {
    const outAmount = Number(outInput.value)
    if (outAmount > 0) {
      getSwapResult(outAmount, outAsset.id, inAsset.id)
        .then((result: number) => setInAmount(result))
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
      setInAmount(0)
      reloadBalances()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
    setSuccessfulTransactionModalVisible(true)
  }

  const handleSwapButton = () => {
    if (Number(outInput.value) > 0) {
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
    <Container fluid display='flex' justify='center' alignItems='center' css={{ minHeight: '85vh' }}>
      <Card css={{
        mw: '330px',
        maxWidth: '400px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Card.Header>
          <Text b>Swap</Text>
        </Card.Header>
        <Container display='flex' justify='center' css={{ p: '10px' }}>
          <Card>
            <Card.Body>
              <Grid.Container justify='center' css={{ p: 0 }}>
                <Grid xs={8} css={{ d: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Input
                    aria-label='Amount to sell'
                    underlined
                    fullWidth
                    {...outInput.bindings}
                    placeholder='0.00'
                  />
                  <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                    <Text size={12} css={{ color: '$kondorGray' }}>
                      Balance {balanceToSell ? balanceToSell.toFixed(4) : 0} {outAsset.symbol}
                    </Text>
                  </Container>
                </Grid>
                <Grid xs={4} css={{ d: 'flex', justifyContent: 'flex-end' }}>
                  <AssetSelect asset={outAsset} onPress={handleSellAssetSelect} />
                </Grid>
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
          <Card>
            <Card.Body>
              <Grid.Container justify='center'>
                <Grid xs={8} css={{ d: 'flex', flexDirection: 'column' }}>
                  <Text size={20} css={{ color: '$kondorGray' }}>
                    {inAmount ? inAmount.toFixed(6) : 0}
                  </Text>
                  <Container display='flex' justify='flex-start' css={{ p: 0 }}>
                    <Text size={12} css={{ color: '$kondorGray' }}>
                      Balance {balanceToBuy ? balanceToBuy.toFixed(4) : 0} {inAsset.symbol}
                    </Text>
                  </Container>
                </Grid>
                <Grid xs={4} css={{ d: 'flex', justifyContent: 'flex-end' }}>
                  <AssetSelect asset={inAsset} onPress={handleBuyAssetSelect} />
                </Grid>
              </Grid.Container>
            </Card.Body>
          </Card>
          <Container css={{ m: 0, p: '24px 8px' }}>
            <Container display='flex' justify='space-between' css={{ p: 0, m: 0 }}>
              <Text size={14} css={{ color: '$kondorGray' }}>
                You will receive a minimun of
              </Text>
              <Text size={14} css={{ color: '$kondorGray' }}>
                {inAmount ? (inAmount * 0.995).toFixed(4) : 0} {inAsset.symbol}
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
      </Card>
      <ConfirmModal
        isVisible={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm swap'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Out</Text>
            <Text>{outInput.value} {outAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>In</Text>
            <Text>≈ {inAmount.toFixed(4)} {inAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Slippage Tolerance</Text>
            <Text>0.05%</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>You will receive a minimun of</Text>
            <Text>{(inAmount * 0.995).toFixed(4)} {inAsset.symbol}</Text>
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
