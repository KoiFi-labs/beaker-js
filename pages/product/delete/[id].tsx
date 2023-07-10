import { Text, Container, Tooltip, Card, Button, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { InfoIcon } from '../../../public/icons/InfoIcon'
import { useState, useEffect } from 'react'
import ConfirmModal from '../../../src/components/modules/Modals/ConfirmModal'
import SuccessfulTransactionModal from '../../../src/components/modules/Modals/SuccessfulTransactionModal'
import SendingTransactionModal from '../../../src/components/modules/Modals/SendingTransaction'
import { Product } from '../../../interfaces'
import { getProductById, removeProduct } from '../../../src/services/mock'
import { sleep } from '../../../src/utils/utils'

export default function RemoveNftProductLiquidity () {
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successfulTransactionModalIsVisible, setSuccessfulTransactionModalIsVisible] = useState<boolean>(false)
  const [sendingTransactionModalIsVisible, setSendingTransactionModalIsVisible] = useState<boolean>(false)
  const [product, setProduct] = useState<Product>()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(Number(id))!
      setProduct(product)
    }
    fetchProduct()
  }, [id])

  const handleConfirmButton = async () => {
    setSendingTransactionModalIsVisible(true)
    await sleep(3000)
    await removeProduct(Number(id))
    setSendingTransactionModalIsVisible(false)
    setSuccessfulTransactionModalIsVisible(true)
    router.push('/product')
  }

  return (
    <Container display='flex' justify='center'>
      <Card css={{
        p: '8px',
        maxWidth: '400px',
        minHeight: '200px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Container display='flex' justify='space-between' css={{ p: 0 }}>
          <Text size={20} css={{ color: '$kondorLight' }}>Remove NFT Product liquidity</Text>
          <Tooltip content='Details'>
            <IconButton>
              <InfoIcon size={20} fill='#979797' />
            </IconButton>
          </Tooltip>
        </Container>
        <Spacer y={1} />

        {product?.assets.map(asset => (
          <Container key={asset.symbol} css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>{asset.symbol}</Text>
            <Text>{asset.amount} {asset.symbol}</Text>
          </Container>
        ))}
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Total value</Text>
          <Text>≈ $1500</Text>
        </Container>
        <Container css={{ p: '24px 0' }} display='flex' justify='space-between'>
          <Text size={14} css={{ color: '$kondorGray' }}>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</Text>
        </Container>
        <Button bordered rounded css={{ borderColor: '$kondorPrimary', color: '$kondorLight' }} onPress={() => { setConfirmModalVisible(true) }}>
          Remove liquidity
        </Button>
      </Card>
      <ConfirmModal
        isVisible={confirmModalVisible}
        onHide={() => setConfirmModalVisible(false)}
        onPress={handleConfirmButton}
        title='Confirm remove liquidity'
      >
        <>
          {product?.assets.map(asset => (
            <Container key={asset.symbol} css={{ p: 0 }} display='flex' justify='space-between'>
              <Text size={16} css={{ color: '$kondorGray' }}>{asset.symbol}</Text>
              <Text>0.00 {asset.symbol}</Text>
            </Container>
          ))}
          <Container css={{ p: 0 }} display='flex' justify='space-between'>
            <Text size={16} css={{ color: '$kondorGray' }}>Total value</Text>
            <Text>≈ $1500</Text>
          </Container>
          <Container css={{ p: '24px 0' }} display='flex' justify='space-between'>
            <Text size={14} css={{ color: '$kondorGray' }}>Output is estimated. If the price changes by more than 0.5% your transaction will revert.</Text>
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
        onPress={() => {}}
        transactionId='4UEKQ5H2YBDPW3FFXM36QDFT2AR6I7X4ZIPW7P32X3YHPTXVOHZQ'
      />
    </Container>
  )
}
