// import Pool from '../../src/models/Pool'
import React, { useEffect, useState } from 'react'
import { transactions } from '../../config/data'
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
import { Container, Text, Button, Grid, Spacer } from '@nextui-org/react'
const SCALE_DECIMALS = 1000000
// const INITAL_A = 10000000 * SCALE_DECIMALS
// const INITAL_B = 10000000 * SCALE_DECIMALS
const INITAL_A = 100
const INITAL_B = 100
const fee = 3
const nT = 2 // number of assets in the pool
const maxLoopLimit = 15
const __A = 10
const A_PRECISION: number = 100
const A: number = __A * A_PRECISION

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Simulation () {
  const [assetASupply, setAssetASupply] = useState<number>(INITAL_A)
  const [assetBSupply, setAssetBSupply] = useState<number>(INITAL_B)
  const [amountToBuy, setAmountToBuy] = useState<number>(0)
  const [amountToSell, setAmountToSell] = useState<number>(0)
  const [sellingAssetA, setSellingAssetA] = useState<boolean>(true)
  const [counter, setCounter] = useState<number>(0)
  const [preventFirst, setPreventFirts] = useState<boolean>(true)
  const [counterY, setCounterY] = useState<number>(0)
  const [counterD, setCounterD] = useState<number>(0)
  const [fee, setFee] = useState<number>(0)

  useEffect(() => {
    if (preventFirst) {
      setPreventFirts(false)
      return
    }
    // runSimulation(counter)
    console.log('assetASupply in useEffect', assetASupply)
    console.log('assetBSupply in useEffect', assetBSupply)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter])

  const runSimulation = async (i: number) => {
    setAmountToSell(transactions[i].value as number)
    // const amountToSell = transactions[i].value
    const amountToSell = 10
    // const assetIdToSell = transactions[i].asset === 'USDC' ? 159719100 : 159703771
    const assetIdToSell = 159703771
    setSellingAssetA(assetIdToSell === 159703771)
    const [amountToBuy, fee, counterY, counterD] = calculateSwap(amountToSell, assetASupply, assetBSupply, sellingAssetA)
    setAmountToBuy(amountToBuy)
    const intermediateValueA = sellingAssetA ? (assetASupply + (amountToSell * SCALE_DECIMALS)) : (assetASupply - (amountToBuy * SCALE_DECIMALS))
    const intermediateValueB = sellingAssetA ? (assetBSupply - (amountToBuy * SCALE_DECIMALS)) : (assetBSupply + (amountToSell * SCALE_DECIMALS))
    setAssetASupply(intermediateValueA)
    setAssetBSupply(intermediateValueB)
    setCounterY(counterY)
    setCounterD(counterD)
    setFee(fee)
  }

  const labels = ['USDT', 'USDC']
  const data = {
    labels,
    datasets: [
      {
        label: 'Supply amount',
        data: [assetASupply / SCALE_DECIMALS, assetBSupply / SCALE_DECIMALS],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  const labelsCounters = ['Loops D', 'Loops Y']

  const dataCounters = {
    labels: labelsCounters,
    datasets: [
      {
        label: 'Current',
        data: [counterY, counterD],
        backgroundColor: 'rgb(255, 99, 132)'
      },
      {
        label: 'Free',
        data: [(12 - counterY), (12 - counterD)],
        backgroundColor: 'rgb(53, 162, 235)'
      }
    ]
  }

  const optionsCounters = {
    plugins: {
      title: {
        display: true,
        text: 'Number of loops trying to converge'
      }
    },
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
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
  // const usdtPrinceText = `1 USDT = ${(calculateSwap(1 * SCALE_DECIMALS, assetASupply, assetBSupply, true)[0] / SCALE_DECIMALS).toFixed(3)} USDC`
  // const usdcPrinceText = `1 USDC = ${(calculateSwap(1 * SCALE_DECIMALS, assetASupply, assetBSupply, false)[0] / SCALE_DECIMALS).toFixed(3)} USDT`
  const usdtPrinceText = 's'
  const usdcPrinceText = 's'
  const handleResetButton = () => {
    setAssetASupply(INITAL_A)
    setAssetBSupply(INITAL_B)
    setAmountToBuy(0)
    setAmountToSell(0)
    setFee(0)
    setCounterD(0)
    setCounterY(0)
  }

  return (
    <Container>
      <Text h1>Pool USDT | USDC</Text>
      <Grid.Container css={{ width: '100%' }}>
        <Grid xs={9} css={{ d: 'flex', flexDirection: 'column' }}>
          <Text size={18}>{swappingText}</Text>
          <Text size={18}>Protocol fee: {fee.toFixed(4)} {sellingAssetA ? 'USDC' : 'USDT'}</Text>
          <Text size={18}>{usdtPrinceText}</Text>
          <Text size={18}>{usdcPrinceText}</Text>
        </Grid>
        <Grid xs={3} css={{ d: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Button bordered rounded css={{ color: '$white' }} onPress={() => { runSimulation(1) }}>Run swap</Button>
          <Spacer y={0.5} />
          <Button bordered rounded css={{ color: '$white' }} onPress={() => { handleResetButton() }}>Reset pools</Button>
        </Grid>
      </Grid.Container>
      <Bar options={options} data={data} />
      <Bar options={optionsCounters} data={dataCounters} />
    </Container>
  )
}

function calculateSwap (
  dx: number,
  assetInBalance: number,
  assetOutBalance: number,
  assetInIsABalance: boolean
): [number, number, number, number] {
  console.log('assetInbalance', assetInBalance)
  console.log('assetOutbalance', assetOutBalance)
  const amountInBalance = assetInIsABalance ? assetInBalance : assetOutBalance
  const x: number = dx + amountInBalance
  const [y, counterY, counterD] = getY(x, assetInBalance, assetOutBalance, assetInIsABalance)
  const amountOutBalance = assetInIsABalance ? assetOutBalance : assetInBalance
  let dy: number = amountOutBalance - y
  const dyFee: number = dy * (fee / 1000)
  dy = Math.max(dy - dyFee, 0) // If dy negative return 0 assets out
  console.log('amount after swap asset_in: ', dx + assetInBalance)
  console.log('amount after swap asset_out: ', assetOutBalance - dy)
  console.log('toTransfer: ', dy)
  console.log('fee: ', dyFee)
  return [dy, dyFee, counterY, counterD]
}

function difference (a: number, b: number): number {
  return a > b ? a - b : b - a
}

function within1 (a: number, b: number): boolean {
  return difference(a, b) <= 1
}

function getD (poolABalance: number, poolBBalance: number): [number, number] {
  const s = poolABalance + poolBBalance
  if (s === 0) return [0, 0]
  let d = s
  const nA = A * nT
  let dInitial = 0
  let prevD = 0

  for (let i = 0; i < maxLoopLimit; i++) {
    let dp = d
    dp = (dp * d) / (poolABalance * nT)
    dp = (dp * d) / (poolBBalance * nT)
    prevD = d
    if (i === 0) {
      dInitial = d
    }
    d =
      ((((nA * s) / A_PRECISION + (dp * nT)) * d) /
        (((nA - A_PRECISION) * d) / A_PRECISION + ((nT + 1) * dp)))
    if (within1(d, prevD)) {
      // console.log('d en la vuelta', i, ': ', d)
      // console.log('diferencia en d', Math.abs(dInitial - d))
      return [d, i]
    }
  }
  console.log('dInitial', dInitial)
  console.log('A Balance', poolABalance)
  console.log('B Balance', poolBBalance)
  console.log('last d value', d)
  throw new Error('D does not converge')
}

function getY (x: number, assetInBalance: number, assetOutBalance: number, assetInIsABalance: boolean): [number, number, number] {
  const [d, counterD] = assetInIsABalance ? getD(assetInBalance, assetOutBalance) : getD(assetOutBalance, assetInBalance)

  const nT = 2
  const nA = nT * A

  let c = (d ** 2) / (x * nT)
  c = ((c * d) * A_PRECISION) / (nA * nT)
  const b = x + ((d * A_PRECISION) / nA)

  let y = d
  let yInitial = 0

  for (let i = 0; i < maxLoopLimit; i++) {
    const yPrev = y
    y = ((y * y) + c) / (((y * 2) + b) - d)

    if (i === 0) {
      yInitial = y
      // console.log('y en la primer vuelta :', y)
    }

    if (within1(y, yPrev)) {
      // console.log('y en la ', i, ': ', y)
      // console.log('diferencia de y :', Math.abs(yInitial - y))
      return [y, i, counterD]
    }
  }
  console.log('yInitial value: ', yInitial)
  throw new Error('Approximation did not converge')
}
