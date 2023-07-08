import React from 'react'
import { Container, Text } from '@nextui-org/react'

type Props = {
    label: string,
    value: string,
}

const ResumeCardItem = ({ label, value }: Props) => {
  return (
    <Container css={{ p: 0, d: 'flex', minWidth: '150px', maxWidth: '200px', m: '16px', flexDirection: 'column' }}>
      <Text weight='semibold' css={{ color: '$kondorTextLight' }}>{label}</Text>
      <Text size={20} weight='semibold'>{value}</Text>
    </Container>
  )
}

export default ResumeCardItem
