import React from 'react'
import { Text, Grid } from '@nextui-org/react'
import styles from './SuccessfulCard.module.css'
import { AiFillCheckCircle } from 'react-icons/ai'

type SuccessfulCardProps = {
  title: string,
  details: string,
}

const SuccessfulCard = ({ title, details }: SuccessfulCardProps) => {
  return (
    <Grid.Container className={styles.successfulCard}>
      <Grid sm={2} css={{ d: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AiFillCheckCircle size={36} color='#00da73' />
      </Grid>
      <Grid sm={10} css={{ d: 'flex', flexDirection: 'column' }}>
        <Text size={18} b css={{ color: '$successful' }}>{title}</Text>
        {details.split('\n').map((ln, index) => <p key={index}>{ln}</p>)}
      </Grid>
    </Grid.Container>
  )
}

export default SuccessfulCard
