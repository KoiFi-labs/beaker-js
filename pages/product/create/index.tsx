import { Button, Text, Container, Card, Grid, Input } from '@nextui-org/react'
import PoolSelect from '../../../src/components/PoolSelect/PoolSelect'
import { getPools, PoolType } from '../../../src/services/poolService'
import { useState } from 'react'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { ClipboardIcon } from '../../../public/icons/clipboard'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { sleep, copyToClipboard, abbreviateTransactionHash } from '../../../src/utils/utils'
import { useRouter } from 'next/router'

export default function CreateProduct () {
  const pools = getPools()
  const [inputsAmount, setInputsAmount] = useState<number>(2)
  const [confirmModalIsvisible, setConfirmModalIsVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const router = useRouter()

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

  const addLiquidity = async () => {
    await sleep(3000)
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalIsVisible(false)
    router.push('/product')
  }

  const handleConfirmButton = async () => {
    setSendingTransactionModalIsVisible(true)
    await addLiquidity()
    setSendingTransactionModalIsVisible(false)
    setSuccessfulTransactionModalIsVisible(true)
  }

  const handleCreateButton = () => {
    setConfirmModalIsVisible(true)
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
        isVisible={confirmModalIsvisible}
        onHide={() => setConfirmModalIsVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm add liquidity'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{pools[0]?.pool} to be added</Text>
            <Text>500 {pools[0]?.pool}</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Total value</Text>
            <Text>≈ $500</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Share of pool</Text>
            <Text>0.01%</Text>
          </Container>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>You will receive a minimun of</Text>
            <Text>15400 {pools[0]?.pool} KONDOR TOKEN</Text>
          </Container>
        </>
      </ConfirmModal>

      <SendingTransactionModal
        isVisible={sendingTransactionModalIsVisible}
        onHide={() => setSendingTransactionModalIsVisible(false)}
        onPress={() => { setSuccessfulTransactionModalIsVisible(true) }}
      />
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalIsVisible}
        onHide={() => setSuccessfulTransactionModalIsVisible(false)}
        onPress={() => { handleOkButton() }}
      >
        <>
          <Container display='flex' justify='flex-start' alignItems='center' css={{ padding: '8px' }}>
            <IconButton onClick={() => copyToClipboard('DSWX3GJBH3665JK3HI55NRM5R4UKCWDWGBHU6D2MHYJX5RVWEOSA')}><ClipboardIcon /></IconButton>
            <Text>Transaction ID: {abbreviateTransactionHash('DSWX3GJBH3665JK3HI55NRM5R4UKCWDWGBHU6D2MHYJX5RVWEOSA')}</Text>
          </Container>
        </>
      </SuccessfulTransactionModal>
    </Container>
  )
}
