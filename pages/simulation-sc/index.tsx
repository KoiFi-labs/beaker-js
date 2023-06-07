import React, { useEffect, useState } from 'react'
import { transactions } from '../../config/data'
import { config } from '../../config'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Container, Text, Button, Grid } from '@nextui-org/react'
import { swap, getPoolSupply, calculateSwap } from '../../src/services/kondorServices/symmetricPoolServise'
import { useWallet } from '../../src/contexts/useWallet'

const SCALE_DECIMALS = 1000000

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Simulation () {
  const [assetASupply, setAssetASupply] = useState<number>(0)
  const [assetBSupply, setAssetBSupply] = useState<number>(0)
  const [amountToBuy, setAmountToBuy] = useState<number>(0)
  const [amountToSell, setAmountToSell] = useState<number>(0)
  const [sellingAssetA, setSellingAssetA] = useState<boolean>(true)
  const [aPrice, setAPrice] = useState<number>(0)
  const [bPrice, setBPrice] = useState<number>(0)
  const [counter, setCounter] = useState<number>(0)
  const [preventFirst, setPreventFirts] = useState<boolean>(true)
  const { account } = useWallet()

  useEffect(() => {
    if (preventFirst) {
      setPreventFirts(false)
      return
    }
    runSimulation(counter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])

  useEffect(() => {
    getPoolSupply()
      .then(([aSupply, bSupply]) => {
        setAssetASupply(aSupply)
        setAssetBSupply(bSupply)
      })
      .then(res => calculateSwap(1, config.stablePool.assetIdA))
      .then(res => setAPrice(res[0]))
      .then(res => calculateSwap(1, config.stablePool.assetIdB))
      .then(res => setBPrice(res[0]))
  }, [])

  const runSimulation = async (i: number) => {
    if (!account?.addr) throw new Error('Wallet not connected')
    setAmountToSell(transactions[i].value as number)
    const amountToSell = transactions[i].value
    const assetIdToSell = transactions[i].asset === 'USDT' ? config.stablePool.assetIdA : config.stablePool.assetIdB
    setSellingAssetA(assetIdToSell === config.stablePool.assetIdA)
    const res = await swap(account.addr, amountToSell, assetIdToSell)
    console.log(res)
    setAmountToBuy(0)
    const [aSupply, bSupply] = await getPoolSupply()
    setAssetASupply(aSupply)
    setAssetBSupply(bSupply)
    const [aValue] = await calculateSwap(10, config.stablePool.assetIdA)
    const [bValue] = await calculateSwap(10, config.stablePool.assetIdB)
    setAPrice(aValue)
    setBPrice(bValue)
  }

  const labels = ['USDT', 'USDC']
  const data = {
    labels,
    datasets: [
      {
        label: 'Supply amount',
        data: [assetASupply / 1000000, assetBSupply / 1000000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Pool USDT | USDC'
      }
    }
  }

  const swappingText = `Swaped ${amountToSell.toFixed(3)} ${sellingAssetA ? 'USDT' : 'USDC'} to ${amountToBuy.toFixed(3)} ${sellingAssetA ? 'USDC' : 'USDT'}`
  const usdtPrinceText = `1 USDT = ${aPrice / SCALE_DECIMALS} USDC`
  const usdcPrinceText = `1 USDC = ${bPrice / SCALE_DECIMALS} USDT`

  return (
    <Container>
      <Text h1>Pool USDT | USDC</Text>
      <Grid.Container css={{ width: '100%' }}>
        <Grid xs={9} css={{ d: 'flex', flexDirection: 'column' }}>
          <Text size={18}>{swappingText}</Text>
          <Text size={18}>{usdtPrinceText}</Text>
          <Text size={18}>{usdcPrinceText}</Text>
        </Grid>
        <Grid xs={3} css={{ d: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Button bordered rounded css={{ color: '$white' }} onPress={() => { setCounter(counter + 1) }}>Run swap</Button>
        </Grid>
      </Grid.Container>
      <Bar options={options} data={data} />
    </Container>
  )
}
