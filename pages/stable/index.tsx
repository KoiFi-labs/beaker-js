import { Text, Container } from '@nextui-org/react'
import React from 'react'

export default function Pool () {
  return (
    <Container css={{ p: '8px', mw: '992px' }}>
      <Text h1>USD Stable</Text>
      <Text h4>Earn fees by providing liquidity.</Text>
    </Container>
  )
}
