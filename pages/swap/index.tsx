/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Button, Text, Container, Card, Grid, useInput, Spacer } from '@nextui-org/react'
import { LightInput } from '../../src/components/LightInput/LightInput'
import { Asset } from '../../config/Assets'
import { config } from '../../config'
import AssetSelect from '../../src/components/AssetSelect/AssetSelect'
import { useWallet } from '../../src/contexts/useWallet'
import { Balance, hasOptin } from '../../src/services/algoService'
import { microToStandard } from '../../src/utils/math'
import { calculateInStableSwap, calculateOutStableSwap, optin } from '../../src/services/kondorServices/symmetricPoolServise'
import { swap, calculateSwap } from '../../src/services/kondorServices/swap'
import ConfirmModal from '../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../src/components/modules/Modals/SuccessfulTransactionModal'
import ErrorModal from '../../src/components/modules/Modals/ErrorModal'
import { BsArrowDownUp } from 'react-icons/bs'
import useTimer from '../../src/hooks/useTimmer'
import { DynamicButton } from '../../src/components/DynamicButton/DynamicButton'
import ExpectedAmountInfo from '../../src/components/modules/Modals/ExpectedAmountInfo'
import AssetSelectCard from '../../src/components/AssetSelectCard/AssetSelectCard'

enum Step {
  WALLET_CONNECT_NEEDED,
  INSUFFICIENT_BALANCE,
  OPT_IN_NEEDED,
  READY
}

export default function Swap () {
  const [outAsset, setOutAsset] = useState<Asset>(config.assetList[0])
  const [inAsset, setInAsset] = useState<Asset>(config.assetList[1])
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [balanceToSell, setBalanceToSell] = useState<number>(0)
  const [balanceToBuy, setBalanceToBuy] = useState<number>(0)
  const [confirmOptinModalIsvisible, setConfirmOptinModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<Step>(Step.WALLET_CONNECT_NEEDED)
  const [isOptedin, setIsOptedin] = useState<boolean>(false)
  const { isConnected, balances, account, reloadBalances, connectWallet } = useWallet()
  const { timerFlag, runTimer } = useTimer()
  const sellInput = useInput('')
  const buyInput = useInput('')
  const slippageText = 'If the price changes by more than your slippage tolerance your transaction will revert.'

  useEffect(() => {
    if (sellInput.value) {
      calculateSwap(Number(sellInput.value), inAsset.id, outAsset.id)
        .then((amount: number) => { buyInput.setValue(amount === 0 ? '0.00' : amount.toFixed(6)) })
    }
    if (buyInput.value) {
      calculateOutStableSwap(Number(buyInput.value), inAsset.id)
        .then((amount: number) => { sellInput.setValue(amount === 0 ? '0.00' : amount.toFixed(6)) })
    }
  }, [inAsset, outAsset, timerFlag])

  useEffect(() => {
    reloadState()
      .then(() => updateStep())
  }, [account, balances])

  useEffect(() => {
    updateStep()
  }, [sellInput, buyInput])

  const reloadState = async () => {
    if (isConnected) {
      hasOptin(account.addr, inAsset.id)
        .then((res: boolean) => setIsOptedin(res))
        .then(() => reloadBalances())
    }
  }

  const updateStep = () => {
    if (!isConnected) return setStep(Step.WALLET_CONNECT_NEEDED)
    if (!isOptedin) return setStep(Step.OPT_IN_NEEDED)
    setStep(Step.READY)
  }

  const onChangeSellInput = (e: any) => {
    sellInput.setValue(e.target.value)
    buyInput.setValue('')
    runTimer()
  }

  const onChangeBuyInput = (e: any) => {
    buyInput.setValue(e.target.value)
    sellInput.setValue('')
    runTimer()
  }

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
      const result = await swap(account.addr, amount, inAsset.id, outAsset.id)
      if (result?.txId) setTransactionId(result.txId)
      sellInput.setValue('')
      buyInput.setValue('')
      reloadBalances()
      setLoading(false)
      setSuccessfulTransactionModalIsVisible(true)
    } catch (e) {
      setLoading(false)
      setErrorModalVisible(true)
      console.log(e)
    }
  }

  const handleSwapButton = () => {
    if (Number(sellInput.value) > 0) {
      setConfirmModalVisible(true)
    }
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
  }

  const handleOptinButton = () => {
    setConfirmOptinModalIsVisible(true)
  }

  const handleConfirmOptinButton = async () => {
    setLoading(true)
    const result = await optin(account.addr, inAsset.id)
    setTransactionId(result.txId)
    setLoading(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const buttonOptions = [
    {
      text: 'Connect your wallet',
      onPress: () => { connectWallet() }
    },
    {
      text: `Insufficient ${outAsset.symbol} balance`,
      disabled: true
    },
    {
      text: `Opt-in ${inAsset.symbol} token`,
      onPress: () => { handleOptinButton() }
    },
    {
      text: 'Swap',
      onPress: () => { handleSwapButton() }
    }
  ]

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
    <Container fluid display='flex' justify='center' css={{ p: 0, width: '100%' }}>
      <Container css={{
        minWidth: '330px',
        width: '100%',
        maxWidth: '500px',
        p: 0
      }}
      >
        <Text h1>Swap</Text>
        <Container display='flex' justify='center' css={{ p: 0 }}>
          <AssetSelectCard
            asset={outAsset}
            input={sellInput}
            onChange={onChangeSellInput}
            balance={balanceToSell}
            onPressAssetSelec={handleSellAssetSelect}
          />
          <Button
            bordered
            rounded
            onPress={() => { handleCentralButton() }}
            css={{
              height: '40px',
              minWidth: '40px',
              w: '40px',
              color: '$kondorLight',
              borderColor: '$kondorPrimary',
              m: '16px',
              zIndex: 1
            }}
          >
            <BsArrowDownUp size={20} />
          </Button>
          <AssetSelectCard
            asset={inAsset}
            input={buyInput}
            onChange={onChangeBuyInput}
            balance={balanceToBuy}
            onPressAssetSelec={handleBuyAssetSelect}
          />
          <ExpectedAmountInfo amount={Number(buyInput.value)} slippage={5} asset={inAsset.symbol} />
          <DynamicButton items={buttonOptions} index={step} loading={loading} />
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
            <Text>≈ {Number(buyInput.value).toFixed(6)} {inAsset.symbol}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Slippage Tolerance</Text>
            <Text>0.05%</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>You will receive a minimun of</Text>
            <Text>{(Number(buyInput.value) * 0.995).toFixed(6)} {inAsset.symbol}</Text>
          </Container>
          <Spacer y={1} />
          <Container css={{ p: 0 }}>
            <Text size={12} css={{ color: '$kondorGray' }}>{slippageText}</Text>
          </Container>
        </>
      </ConfirmModal>
      <ConfirmModal
        isVisible={confirmOptinModalIsvisible}
        onHide={() => setConfirmOptinModalIsVisible(false)}
        onPress={handleConfirmOptinButton}
        title='Confirm transaction'
      >
        <Text>Opt-in {inAsset.symbol} asset</Text>
      </ConfirmModal>
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalIsVisible}
        onHide={() => setSuccessfulTransactionModalIsVisible(false)}
        onPress={() => { handleOkButton() }}
        transactionId={transactionId}
      />
      <ErrorModal
        isVisible={errorModalVisible}
        onHide={() => setErrorModalVisible(false)}
        onPress={() => { setErrorModalVisible(false) }}
      />
    </Container>
  )
}
