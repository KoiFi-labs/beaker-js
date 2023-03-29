import { Text, Card } from '@nextui-org/react'

const MyStake = () => {
  return (
    <Card
      css={{ p: '16px' }}
    >
      <Text size={16}>Pool tokens amount</Text>
      <Text b size={24}>2.789542 </Text>
      <Text size={16} css={{ color: '$kondorGray' }}>USDC / USDT Kondor Token</Text>
    </Card>
  )
}

export default MyStake
