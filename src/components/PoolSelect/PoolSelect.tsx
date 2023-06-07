import React, { useState } from 'react'
import { Button, Text, Spacer, Image } from '@nextui-org/react'
import PoolSelectModal from '../modules/Modals/PoolSelectModal'
import { PoolType } from '../../services/stablePoolService'
import { RiArrowDropDownLine } from 'react-icons/ri'

export type PoolSelectProps = {
    selected: PoolType,
    options: PoolType[],
    onPress: (pool: PoolType) => void
}

const PoolSelect = ({ selected, options, onPress }: PoolSelectProps) => {
  const [poolSelectModalVisible, setPoolSelectModalVisible] = useState<boolean>(false)

  const handlerButton = (): void => {
    setPoolSelectModalVisible(true)
  }

  return (
    <>
      <Button onPress={handlerButton} rounded css={{ bg: '$gray300', d: 'flex', width: 'auto', minWidth: '80px', p: '8px' }}>
        <Image src={selected.icon!} alt={`${selected.pool} logo`} css={{ height: '28px', width: '28px', maxWidth: '28px', borderRadius: '50%', bgColor: '$white' }} />
        <Spacer x={0.5} />
        <Text size={16}>{selected.pool}</Text>
        <RiArrowDropDownLine size={36} />
      </Button>
      <PoolSelectModal options={options} isVisible={poolSelectModalVisible} onPress={onPress} onHide={() => { setPoolSelectModalVisible(false) }} />
    </>
  )
}

export default PoolSelect
