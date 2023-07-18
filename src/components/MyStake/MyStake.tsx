import { Text, Card } from '@nextui-org/react'
import { useWallet } from '../../contexts/useWallet'
import { Balance } from '../../services/algoClient'
import { config } from '../../../config'
import { useState, useEffect } from 'react'
const DECIMALS = 1000000
const MyStake = () => {
  const { balances, isConnected } : { balances: Balance[], isConnected: boolean} = useWallet()
  const [poolBalance, setPoolBalance] = useState<number>(0)

  useEffect(() => {
    if (isConnected) {
      const pBalance = balances.filter(b => b.assetId === config.stablePool.stablePoolAssetId)[0]?.amount || 0
      setPoolBalance(pBalance / DECIMALS)
    } else {
      setPoolBalance(0)
    }
  }, [balances, isConnected])

  return (
    <Card css={{ p: '16px' }}>
      <Text size={16}>Pool tokens amount</Text>
      <Text b size={24}>{poolBalance} </Text>
      <Text size={16} css={{ color: '$kondorGray' }}>USDC / USDT Kondor Token</Text>
    </Card>
  )
}

export default MyStake
