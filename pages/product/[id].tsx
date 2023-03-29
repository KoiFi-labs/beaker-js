import { Text, Container, Card, Grid } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getProductById } from '../../src/services/mock'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Product } from '../../interfaces'
import Nft from '../../src/components/Nft/Nft'
import { LinkButton } from '../../src/components/LinkButton/LinkButton'
import { CiBadgeDollar, CiLock } from 'react-icons/ci'
import ItemDetailCard from '../../src/components/ItemDetailCard/ItemDetailCard'
import { abbreviateNumber } from '../../src/utils/utils'

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
    <Container display='flex' justify='center' css={{ p: 0, width: '100%' }}>
      <Container css={{
        minWidth: '330px',
        width: '100%',
        maxWidth: '500px',
        p: 0
      }}
      >
        <Text h1>{product.name} product</Text>
        <Grid.Container gap={1} justify='space-evenly'>
          <Grid xs={12} sm={6}>
            <ItemDetailCard
              title='Total value locked'
              value={`≈$ ${abbreviateNumber(product.value)}`}
              icon={<CiLock size={40} />}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <ItemDetailCard
              title='Total rewards'
              value={`≈$ ${abbreviateNumber(product.value * 0.001)}`}
              icon={<CiBadgeDollar size={40} />}
            />
          </Grid>
          <Grid xs={12}>
            <Card css={{ p: '16px' }}>
              {
                product.assets.map((a, index) => {
                  return (
                    <Container key={index} css={{ p: 0, m: 0 }} display='flex' justify='space-between'>
                      <Text size={16} css={{ color: '$kondorGray' }}>{a.symbol} Pool</Text>
                      <Text>{a.amount} {a.symbol}</Text>
                    </Container>
                  )
                })
              }
            </Card>
          </Grid>
        </Grid.Container>
        <Container css={{ p: '8px' }} display='flex' justify='center'>
          <Nft id={product.id} name={product.name} />
        </Container>
        <Link href={'/product/delete/' + product?.id}>
          <LinkButton>
            Remove NFT liquidity
          </LinkButton>
        </Link>
      </Container>
    </Container>
  )
}
