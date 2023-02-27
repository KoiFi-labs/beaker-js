import React, { useEffect, useState } from 'react'
import { Button, Spacer, Text, Container, Card, Grid, Input, useInput, Loading, Modal, Divider } from '@nextui-org/react'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'

import { useWallet } from '../../src/contexts/useWallet'
import { Balance } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { getSwapResult, swap } from '../../src/services/kondorServices/pondServise'
import { abbreviateTransactionHash, copyToClipboard } from '../../src/utils/utils'
import { ClipboardIcon } from '../../public/icons/clipboard'
import { DownArrowAltIcon } from '../../public/icons/down-arrow-alt'
import { IconButton } from '../../src/components/IconButton/IconButton'

export default function Swap () {
  const [outAsset, setOutAsset] = useState<Asset>(config.assetList[0])
  const [inAsset, setInAsset] = useState<Asset>(config.assetList[1])
  const [loading, setLoading] = useState<boolean>(false)
  const [swapResultModalVisible, setSwapResultModalVisible] = useState<boolean>(false)
  const [balanceToSell, setBalanceToSell] = useState<number>(0)
  const [balanceToBuy, setBalanceToBuy] = useState<number>(0)
  const [swapTransactionId, setSwapTransactionId] = useState<string>('')
  const { isConnected, balances, account, reloadBalances } = useWallet()
  const outInput = useInput('0')
  const inInput = useInput('0')

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

  const openResultModal = (txId: string) => {
    setSwapTransactionId(txId)
    setSwapResultModalVisible(true)
  }

  const closeModalHandler = () => {
    setSwapResultModalVisible(false)
  }

  const handleSwap = async () => {
    if (outInput.value !== '') {
      const amount = Number(outInput.value)
      if (amount > 0) {
        setLoading(true)
        try {
          const result = await swap(account.addr, amount, outAsset.id)
          setLoading(false)
          if (result) {
            outInput.setValue('')
            inInput.setValue('')
            reloadBalances()
            openResultModal(result.txId)
          }
        } catch (e) {
          setLoading(false)
          console.log(e)
        }
      }
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
              You will receive a minumum of
            </Text>
            <Text size={16} css={{ color: '$kondorGray' }}>
              {inInput.value || 0} {inAsset.symbol}
            </Text>
          </Container>
          {
                        !isConnected
                          ? <Button disabled size='xl' css={{ width: '100%', background: '$kondorPrimary' }}>Connect your wallet</Button>
                          : loading
                            ? <Button disabled size='xl' css={{ width: '100%' }} onPress={() => handleSwap()}><Loading css={{ color: '$kondorGray' }} /></Button>
                            : <Button size='xl' css={{ width: '100%', background: '$kondorPrimary' }} onPress={() => handleSwap()}>Swap</Button>
                        }
        </Container>
      </Card>
      <Modal open={swapResultModalVisible} closeButton onClose={closeModalHandler}>
        <Modal.Header>
          <Text size='$xl' color='$primary'>Swap completed</Text>
        </Modal.Header>
        <Modal.Body>
          <Text>Swap completed successfully</Text>
          <Divider />
          <Spacer y={0.1} />
          <Container display='flex' justify='flex-start' alignItems='center' css={{ p: 0 }}>
            <IconButton onClick={() => copyToClipboard(swapTransactionId)}><ClipboardIcon /></IconButton>
            <Text>Transaction ID: {abbreviateTransactionHash(swapTransactionId)}</Text>
          </Container>
        </Modal.Body>
      </Modal>
    </Container>
  )
}
