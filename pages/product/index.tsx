import { Text, Container, Grid, Loading } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getProducts } from '../../src/services/mock'
import { LinkButton } from '../../src/components/LinkButton/LinkButton'
import { Product } from '../../interfaces'
import ProductsTable from '../../src/components/modules/Tables/ProductsTable'

export default function MyProducts () {
  const [myProducts, setMyProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchMyProducts = async () => {
      const myProducts = await getProducts()
      setMyProducts(myProducts)
      setIsLoading(false)
    }
    fetchMyProducts()
  }, [])

  return (
    <Container css={{ p: '0', mw: '992px' }}>
      <Grid.Container css={{ p: '8px' }}>
        <Grid
          xs={12} md={8} css={{
            d: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            '@sm': {
              alignItems: 'flex-start'
            }
          }}
        >
          <Text h1 css={{ color: '$kondorGray' }}>Investment Products</Text>
          <Text h4 css={{ color: '$kondorGray' }}>Manage your products</Text>
        </Grid>
        <Grid
          xs={12} md={4} css={{
            m: 0,
            p: 0,
            d: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '@sm': {
              justifyContent: 'flex-end'
            }
          }}
        >
          <Link href='/product/create'>
            <LinkButton css={{ p: '16px' }}>
              Create new product
            </LinkButton>
          </Link>
        </Grid>
      </Grid.Container>
      {
        isLoading
          ? (
            <Container display='flex' justify='center'>
              <Loading />
            </Container>
            )
          : <ProductsTable products={myProducts} />
      }
    </Container>
  )
}
