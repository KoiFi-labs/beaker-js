import React, { useState } from 'react'
import { Button, Grid, Image, Text, Avatar } from '@nextui-org/react'
import PoolSelectModal from '../modules/Modals/PoolSelectModal'
import { PoolType } from '../../services/poolService'

export type PoolSelectProps = {
    pool: PoolType,
    onPress: (pool: PoolType) => void
}

const PoolSelect = ({ pool, onPress }: PoolSelectProps) => {
  const [poolSelectModalVisible, setPoolSelectModalVisible] = useState<boolean>(false)

  const handlerButton = (): void => {
    setPoolSelectModalVisible(true)
  }

  return (
    <>
      <Button onPress={handlerButton} rounded css={{ minWidth: '40px', width: '100px', background: '$gray300', maxWidth: '95px', padding: 0 }}>
        <Grid.Container css={{ padding: 0, width: '100%' }}>
          <Grid xs={3} css={{ padding: '8px 0px 0px 0px' }}>
            <Avatar size='xs' src={pool.icon} />
          </Grid>
          <Grid xs={6} css={{ padding: '5px' }}>
            <Text size={15}>{pool.pool}</Text>
          </Grid>
          <Grid xs={3} css={{ padding: '5px' }}>
            <Image alt='icon' src='https://cdn-icons-png.flaticon.com/512/32/32195.png' css={{ maxWidth: '10px' }} />
          </Grid>
        </Grid.Container>
      </Button>
      <PoolSelectModal isVisible={poolSelectModalVisible} onPress={onPress} onHide={() => { setPoolSelectModalVisible(false) }} />
    </>
  )
}

export default PoolSelect
