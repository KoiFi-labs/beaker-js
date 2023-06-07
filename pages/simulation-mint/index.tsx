/* eslint-disable no-var */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Container, Text, Button } from '@nextui-org/react'
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

export type Wallet = {
  id: number,
  a: number, // amount asset a
  b: number, // amount asset b
  lp: number, // amount asset lp
  ls: number, // local state with reference a asset lp
  localState: number // local state with reference a shares
}

var aReserve = 0
var bReserve = 0
var localIssued = 0
var issued = 0
var aLocked = 0
var bLocked = 0

var wallet1: Wallet = {
  id: 1,
  a: 100 * 1000,
  b: 100 * 1000,
  lp: 0,
  ls: 0,
  localState: 0
}

var wallet2: Wallet = {
  id: 2,
  a: 200 * 1000,
  b: 200 * 1000,
  lp: 0,
  ls: 0,
  localState: 0
}

var wallet3: Wallet = {
  id: 3,
  a: 500 * 1000,
  b: 500 * 1000,
  lp: 0,
  ls: 0,
  localState: 0
}

var wallet4: Wallet = {
  id: 4,
  a: 500 * 1000,
  b: 500 * 1000,
  lp: 0,
  ls: 0,
  localState: 0
}

// Me quede en que tengo que probar agregar un mint mas para ver como se comporta cuando el mint inicial tiene lockeado 1000 tokens

export default function Simulation () {
  const runSimulation = async () => {
    mint(100 * 1000, 100 * 1000, 1)
    console.log('wallet1', wallet1)
    console.log('localIssued', localIssued)
    console.log('aReserve', aReserve)
    console.log('bReserve', bReserve)
    console.log('First mint finished')

    for (let cont = 0; cont < 60; cont++) {
      swapAforB(10 * 1000, 3)
      swapBforA(10 * 1000, 3)
    }

    console.log('--------AFTER SWAP-------------')
    // console.log('issued', issued)
    // console.log('localIssued', localIssued)
    console.log('aReserve', aReserve)
    console.log('bReserve', bReserve)
    // console.log('aLocked', aLocked)
    // console.log('bLocked', bLocked)
    // console.log('totalBalance', aReserve + bReserve)
    // console.log('totalWithoutLocked', aReserve + bReserve - bLocked - aLocked)

    // mint(100 * 1000, 100 * 1000, 4)
    // console.log('--------AFTER MINT WALLET 4-------------')
    // console.log('wallet1', wallet1)
    // console.log('wallet4', wallet4)
    // console.log('issued', issued)
    // console.log('localIssued', localIssued)
    // console.log('aReserve', aReserve)
    // console.log('bReserve', bReserve)
    // console.log('aLocked', aLocked)
    // console.log('bLocked', bLocked)
    // console.log('totalBalance', aReserve + bReserve)
    // console.log('totalWithoutLocked', aReserve + bReserve - bLocked - aLocked)

    mint(10 * 1000, 10 * 1000, 2)
    console.log('--------AFTER MINT WALLET 2-------------')
    console.log('wallet1', wallet1)
    console.log('wallet2', wallet2)
    console.log('localIssued', localIssued)
    console.log('aReserve', aReserve)
    console.log('bReserve', bReserve)
    console.log('totalBalance', aReserve + bReserve)

    // getRewards(wallet4.id)
    // getRewards(wallet2.id)
    // getRewards(wallet1.id)
    // console.log('--------AFTER GET REWARDS-------------')
    // console.log('wallet1', wallet1)
    // console.log('wallet2', wallet2)
    // console.log('issued', issued)
    // console.log('localIssued', localIssued)
    // console.log('aReserve', aReserve)
    // console.log('bReserve', bReserve)
    // console.log('aLocked', aLocked)
    // console.log('bLocked', bLocked)
    // console.log('totalBalance', aReserve + bReserve)
    // console.log('totalWithoutLocked', aReserve + bReserve - bLocked - aLocked)
  }

  const burn = (lp: number, localState: number, walletId: number) => {
    const a = localState * aReserve / localIssued
    const b = localState * bReserve / localIssued

    const wallet = getWalletById(walletId)
    updateWallet({
      id: wallet.id,
      a: wallet.a + a,
      b: wallet.b + b,
      lp: wallet.lp - lp,
      ls: 0,
      localState: wallet.localState - localState
    })
    aReserve = aReserve - a
    bReserve = bReserve - b
    issued = issued - lp
    localIssued = localIssued - localState
  }

  const getRewards = (walletId: number) => {
    const wallet = getWalletById(walletId)
    const localState = wallet.localState
    const a = localState * aReserve / localIssued
    const b = localState * bReserve / localIssued
    // si lp != ls entonces no puede obtener los rewards
    const newLp = a + b

    // create transaction to user with LP that represent a + b

    // para calcular cuanto % me corresponde de las fee tengo que simular que vuelvo a
    // invertir. Para eso calculo cuanto a y b me corresponderia por mis LP

    updateWallet({
      id: wallet.id,
      a: wallet.a,
      b: wallet.b,
      lp: newLp, // acá debe recibir la diferencia entre lo que tiene de lp en su wallet y rewards
      ls: newLp,
      localState: wallet.localState
    })
  }

  const mint = (a: number, b: number, walletId: number) => {
    let localState = 0
    if (aReserve === 0 && bReserve === 0) {
      localState = calculateInitialMint(a, b)
      localIssued = localState + 1000
    } else {
      localState = calculateMint(a, b)
      localIssued = localIssued + localState
      // New Asset1 Reserves = Old Asset1 Reserves + Asset1 Amount
      // New Asset2 Reserves = Old Asset1 Reserves + Asset2 Amount
      // Calculated Asset1 Amount = floor((Pool Tokens Out * New Asset1 Reserves) / New Issued Pool Tokens)
      // Calculated Asset2 Amount =floor((Pool Tokens Out *New  Asset2 Reserves) / New Issued Pool Tokens)
      // Asset1 Swap Amount = Asset1 Amount - Calculated Asset1 Amount
      // Asset2 Swap Amount = Asset2 Amount - Calculated Asset2 Amount
      // Swap Amount = Max(Asset1 Swap Amount, Asset2 Swap Amount
      const newAReserve = (a + aReserve)
      const newBReserve = (b + bReserve)
      const calculatedAAmount = Math.floor((localState * newAReserve) / localIssued)
      const calculatedBAmount = Math.floor((localState * newBReserve) / localIssued)
      const aSwapAmount = a - calculatedAAmount
      const bSwapAmount = b - calculatedBAmount
      console.log('aSwapAmount', aSwapAmount)
      console.log('bSwapAmount', bSwapAmount)
    }
    const lp = a + b
    aReserve = (a + aReserve)
    bReserve = (b + bReserve)
    issued = issued + lp
    const wallet = getWalletById(walletId)
    updateWallet({
      id: walletId,
      a: wallet.a - a,
      b: wallet.b - b,
      lp,
      ls: lp,
      localState
    })
  }

  const getWalletById = (id: number) => {
    switch (id) {
      case 1 : return wallet1
      case 2 : return wallet2
      case 3 : return wallet3
      case 4 : return wallet4
      default: return wallet1
    }
  }

  const updateWallet = (wallet: Wallet) => {
    switch (wallet.id) {
      case 1:
        wallet1 = wallet
        break
      case 2: wallet2 = wallet
        break
      case 3: wallet3 = wallet
        break
      case 4: wallet4 = wallet
        break
    }
  }

  const calculateInitialMint = (a: number, b: number) => {
    return Math.sqrt(a * b) - 1000
  }

  const calculateMint = (a: number, b: number) => {
    const oldK = aReserve * bReserve
    const newK = (aReserve + a) * (bReserve + b)
    const r = Math.sqrt(oldK) / localIssued
    const newIssued = Math.sqrt(newK) / r
    const poolTokensOut = newIssued - localIssued
    return poolTokensOut
  }

  const swapAforB = (amountToSell: number, walletId: number) => {
    const [amountToBuy, fee] = calculateSwap(amountToSell, aReserve, bReserve, true)
    aReserve = aReserve + amountToSell
    bReserve = bReserve - amountToBuy

    bLocked = (aReserve + bReserve - issued) / (1 + (aReserve / bReserve))
    aLocked = (aReserve * bLocked) / bReserve

    const wallet = getWalletById(walletId)
    updateWallet({
      id: walletId,
      a: wallet.a - amountToSell,
      b: wallet.b + amountToBuy,
      lp: wallet.lp,
      ls: wallet.ls,
      localState: wallet.localState
    })
  }

  const swapBforA = (amountToSell: number, walletId: number) => {
    const [amountToBuy, fee] = calculateSwap(amountToSell, aReserve, bReserve, false)
    aReserve = aReserve - amountToBuy
    bReserve = bReserve + amountToSell
    bLocked = (aReserve + bReserve - issued) / (1 + (aReserve / bReserve))
    aLocked = (aReserve * bLocked) / bReserve

    const wallet = getWalletById(walletId)
    updateWallet({
      id: walletId,
      a: wallet.a + amountToBuy,
      b: wallet.b - amountToSell,
      lp: wallet.lp,
      ls: wallet.ls,
      localState: wallet.localState
    })
  }

  return (
    <Container>
      <Text h1>Simulation</Text>
      <Button bordered rounded css={{ color: '$white' }} onPress={() => { runSimulation() }}>Run simulation</Button>
    </Container>
  )
}

function calculateSwap (
  dx: number,
  assetInBalance: number,
  assetOutBalance: number,
  assetInIsABalance: boolean
): [number, number, number, number] {
  const amountInBalance = assetInIsABalance ? assetInBalance : assetOutBalance
  const x: number = dx + amountInBalance
  const [y, counterY, counterD] = getY(x, assetInBalance, assetOutBalance, assetInIsABalance)
  const amountOutBalance = assetInIsABalance ? assetOutBalance : assetInBalance
  let dy: number = amountOutBalance - y
  const dyFee: number = dy * (fee / 1000)
  dy = Math.max(dy - dyFee, 0) // If dy negative return 0 assets out
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
