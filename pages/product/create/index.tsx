import { Button, Text, Container, Card, Grid, Input } from '@nextui-org/react'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { getPools, PoolType } from '../../../src/services/poolService'
import { useState } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'

export default function CreateProduct () {
  const pools = getPools()
  const [inputsAmount, setInputsAmount] = useState<number>(2)
  const [modalConfirmIsvisible, setModalConfirmIsvisible] = useState<boolean>(false)

  const handleRemoveInputButton = () => {
    if (inputsAmount === 2) return
    setInputsAmount(inputsAmount - 1)
  }

  const handleAddInputButton = () => {
    setInputsAmount(inputsAmount + 1)
  }

  const handlePoolSelectButton = (pool: PoolType) => {
    console.log(pool)
  }

  const handleConfirmButton = () => {
    setModalConfirmIsvisible(false)
  }

  const handleCreateButton = () => {
    setModalConfirmIsvisible(true)
  }

  const PoolInput = (pool: PoolType) => (
    <Card key={pool.pool} css={{ $$cardColor: '$colors$gray100', m: '4px 0px' }}>
      <Grid.Container justify='center' css={{ p: '8px' }}>
        <Grid xs={8}>
          <Input label='From' underlined placeholder='0.00' />
        </Grid>
        <Grid xs={4} css={{ d: 'flex', alignItems: 'center' }}>
          <PoolSelect pool={pool} onPress={handlePoolSelectButton} />
        </Grid>
        <Container display='flex' justify='flex-start' css={{ p: 0 }}>
          <Text size={14} css={{ color: '$kondorGray' }}>Balance 500 {pool.pool}</Text>
        </Container>
      </Grid.Container>
    </Card>)

  return (
    <Container display='flex' justify='center' alignContent='flex-start' css={{ minHeight: '85vh', p: '16px' }}>
      <Card css={{ p: '8px', maxWidth: '500px', minHeight: '200px' }}>
        <Text size={20} css={{ color: '$kondorLight' }}>Create Product</Text>
        {pools.map(p => PoolInput(p)).slice(0, inputsAmount)}
        <Container display='flex' justify='center' css={{ p: 0 }}>
          {inputsAmount > 2
            ? <Button bordered onPress={() => handleRemoveInputButton()} css={{ minWidth: '50px', width: '50px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>-</Button>
            : null}
          <Button bordered onPress={() => handleAddInputButton()} css={{ minWidth: '50px', width: '50px', m: '4px', borderColor: '$kondorPrimary', color: '$kondorPrimary' }}>+</Button>
        </Container>
        <Button
          onPress={() => handleCreateButton()}
          css={{ withd: '100%', m: '4px 0', backgroundColor: '$kondorPrimary' }}
        >Create
        </Button>

      </Card>
      <ConfirmModal
        title='Confirm create product'
        isVisible={modalConfirmIsvisible}
        onPress={handleConfirmButton}
        onHide={() => { setModalConfirmIsvisible(false) }}
      >
        <Text size={16} css={{ color: '$kondorGray' }}>Are you sure you want to create this product?</Text>
      </ConfirmModal>
    </Container>
  )
}
