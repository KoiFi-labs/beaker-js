import React from 'react'
import { Text, Grid } from '@nextui-org/react'
import styles from './ErrorCard.module.css'
import { AiFillCloseCircle } from 'react-icons/ai'

type CardErrorProps = {
  title: string,
  details: string,
}

const CardError = ({ title, details }: CardErrorProps) => {
  console.log(details)
  return (
    <Grid.Container className={styles.cardError}>
      <Grid sm={2} css={{ d: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <AiFillCloseCircle size={36} color='#a7124f' />
      </Grid>
      <Grid sm={10} css={{ d: 'flex', flexDirection: 'column' }}>
        <Text size={18} b css={{ color: '$error' }}>{title}</Text>
        {details.split('\n').map((ln, index) => <p key={index}>{ln}</p>)}
      </Grid>
    </Grid.Container>
  )
}

export default CardError
