import React from 'react'
import { Text, Container } from '@nextui-org/react'

export type ExpectedAmountInfoProps = {
    amount: number,
    asset: string,
    slippage: number
}

const ExpectedAmountInfo = ({ amount, asset, slippage }: ExpectedAmountInfoProps) => {
  return (
    <Container css={{ m: 0, p: '24px 0px' }}>
      <Container display='flex' justify='space-between' css={{ p: 0, m: 0 }}>
        <Text size={14} css={{ color: '$kondorGray' }}>
          You will receive a minimun of
        </Text>
        <Text size={14} css={{ color: '$kondorGray' }}>
          {(amount * ((1000 - slippage) / 1000)).toFixed(6)} {asset}
        </Text>
      </Container>
      <Container display='flex' justify='space-between' css={{ p: 0, m: 0 }}>
        <Text size={14} css={{ color: '$kondorGray' }}>
          Slippage tolerance
        </Text>
        <Text size={14} css={{ color: '$kondorGray' }}>
          {slippage} %
        </Text>
      </Container>
    </Container>
  )
}

export default ExpectedAmountInfo
