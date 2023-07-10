import { Text, Container, Tooltip, Card, Input, Grid, Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getPoolById } from '../../../src/services/stablePoolService'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { InfoIcon } from '../../../public/icons/InfoIcon'
import { useState } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { sleep } from '../../../src/utils/utils'

export default function AddLiquidity () {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successfulTransactionModalVisible, setSuccessfulTransactionModalVisible] = useState<boolean>(false)
  const [sendingTransactionModalVisible, setSendingTransactionModalVisible] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query
  const pool = getPoolById(id as string)

  const addLiquidity = async () => {
    await sleep(3000)
  }

  const handleOkButton = () => {
    setSuccessfulTransactionModalVisible(false)
    router.push('/myPool')
  }

  const handleConfirmButton = async () => {
    setSendingTransactionModalVisible(true)
    await addLiquidity()
    setSendingTransactionModalVisible(false)
    setSuccessfulTransactionModalVisible(true)
  }

  return (
    <Container display='flex' justify='center' alignContent='flex-start' css={{ minHeight: '85vh', p: '16px' }}>
      <Card css={{
        p: '8px',
        maxWidth: '400px',
        minHeight: '200px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Container display='flex' justify='space-between' css={{ p: 0 }}>
          <Text size={20} css={{ color: '$kondorLight' }}>Add liquidity {pool?.pool} Pool</Text>
          <Tooltip content='Details'>
            <IconButton>
              <InfoIcon size={20} fill='#979797' />
            </IconButton>
          </Tooltip>
        </Container>
        <Card css={{ m: '8px 0', p: '8px' }}>
          <Grid.Container>
            <Grid xs={10}>
              <Input label='Amount' underlined placeholder='0.00' css={{ width: '100%' }} />
            </Grid>
            <Grid xs={2} css={{ display: 'flex', alignItems: 'end', padding: '0 8px' }}>
              <Text size={16}>{pool?.pool}</Text>
            </Grid>
          </Grid.Container>
          <Text size={16}>Balance 51300.4521 {pool?.pool}</Text>

        </Card>
        <Container css={{ p: '24px 0' }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</Text>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>{pool?.pool} to be added</Text>
          <Text>500 {pool?.pool}</Text>
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
          <Text>15400 {pool?.pool} KONDOR TOKEN</Text>
        </Container>
        <Spacer />
        <Button bordered rounded css={{ borderColor: '$kondorPrimary', color: '$kondorLight' }} onPress={() => { setConfirmModalVisible(true) }}>
          Add liquidity
        </Button>
      </Card>
      <ConfirmModal
        isVisible={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm add liquidity'
      >
        <>
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{pool?.pool} to be added</Text>
            <Text>500 {pool?.pool}</Text>
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
            <Text>15400 {pool?.pool} KONDOR TOKEN</Text>
          </Container>
        </>
      </ConfirmModal>

      <SendingTransactionModal
        isVisible={sendingTransactionModalVisible}
        onHide={() => setSendingTransactionModalVisible(false)}
        onPress={() => { setSuccessfulTransactionModalVisible(true) }}
      />
      <SuccessfulTransactionModal
        isVisible={successfulTransactionModalVisible}
        onHide={() => setSuccessfulTransactionModalVisible(false)}
        onPress={() => { handleOkButton() }}
        transactionId='4UEKQ5H2YBDPW3FFXM36QDFT2AR6I7X4ZIPW7P32X3YHPTXVOHZQ'
      />
    </Container>
  )
}
