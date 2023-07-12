import React from 'react'
import { Container } from '@nextui-org/react'
import ResumeCardItem from '../../ResumeCardItem/ResumeCardItem'

const ResumeCard = () => {
  return (
    <Container css={{
      bgColor: '$kondorBlueCard',
      borderRadius: '14px',
      d: 'flex',
      justifyContent: 'space-between',
      p: 0,
      m: 0
    }}
    >
      <ResumeCardItem label='Current balance' value='= $17876.09' />
      <ResumeCardItem label='Incoming 7D' value='= $17876.09' />
      <ResumeCardItem label='Outcoming 7D' value='≈ $8745.60' />
      <ResumeCardItem label='P&L 7D' value='+ ≈ $5147.17' color='$kondorGreen' />
    </Container>
  )
}

export default ResumeCard
