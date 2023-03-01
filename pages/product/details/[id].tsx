import { Text, Container, Tooltip, Card, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getProductById } from '../../../src/services/mock'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { InfoIcon } from '../../../public/icons/InfoIcon'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '../../../interfaces'
import Nft from '../../../src/components/Nft/Nft'
import { LinkButton } from '../../../src/components/LinkButton/LinkButton'

export default function Details () {
  const router = useRouter()
  const [product, setProduct] = useState<Product>()
  const { id } = router.query

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(Number(id))
      setProduct(product)
    }
    fetchProduct()
  }, [id])

  if (!product) return <Container><Text>Product not found</Text></Container>

  return (
    <Container display='flex' justify='center' alignContent='flex-start' css={{ minHeight: '85vh', p: '32px' }}>
      <Card css={{ p: '16px', maxWidth: '500px', minHeight: '200px' }}>
        <Container display='flex' justify='space-between' css={{ p: 0 }}>
          <Text size={20} css={{ color: '$kondorLight' }}>{product.name} Product</Text>
          <Tooltip content='Details'>
            <IconButton>
              <InfoIcon size={20} fill='#979797' />
            </IconButton>
          </Tooltip>
        </Container>
        <Spacer y={1} />
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Total value looked</Text>
          <Text>≈ $ {product.value}</Text>
        </Container>
        {
          product.assets.map((a, index) => {
            return (
              <Container key={index} css={{ p: 0 }} display='flex' justify='space-between'>
                <Text size={16} css={{ color: '$kondorGray' }}>{a.symbol} Pool</Text>
                <Text>{a.amount}</Text>
              </Container>
            )
          })
        }
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Rewards</Text>
          <Text>≈ $ {(product.value * 0.001).toFixed(2)}</Text>
        </Container>
        <Spacer />
        <Container css={{ p: '16px 0' }} display='flex' justify='center'>
          <Nft id={product.id} name={product.name} />
        </Container>
        <Link href={'/product/delete/' + product?.id}>
          <LinkButton>
            Remove NFT liquidity
          </LinkButton>
        </Link>
      </Card>
    </Container>
  )
}
