import { Text, Card } from '@nextui-org/react'
import { useWallet } from '../../contexts/useWallet'
import { Balance } from '../../services/algoService'
import { config } from '../../../config'

const MyStake = () => {
  const { balances } : { balances: Balance[]} = useWallet()
  return (
    <Card
      css={{ p: '16px' }}
    >
      <Text size={16}>Pool tokens amount</Text>
      <Text b size={24}>{balances.filter(b => b.assetId === config.stablePool.stablePoolAssetId)[0]?.amount || 0} </Text>
      <Text size={16} css={{ color: '$kondorGray' }}>USDC / USDT Kondor Token</Text>
    </Card>
  )
}

export default MyStake
