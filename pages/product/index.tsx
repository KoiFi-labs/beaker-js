import { Text, Container, Grid, Loading, Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { getProducts } from '../../src/services/mock'
import { Product } from '../../interfaces'
import ProductsTable from '../../src/components/modules/Tables/ProductsTable'
import { useRouter } from 'next/router'

export default function MyProducts () {
  const [myProducts, setMyProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

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
    <Container css={{ p: '16px', mw: '992px' }}>
      <Grid.Container>
        <Grid
          xs={12} sm={10} css={{
            d: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text h1>Investment Products</Text>
          <Text h4>Manage your products</Text>
        </Grid>
        <Grid
          xs={12} sm={2} css={{
            d: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Button
            rounded
            bordered
            css={{
              width: '100%',
              color: '$white',
              bgColor: '$black',
              borderColor: '$kondorPrimary',
              zIndex: 1
            }}
            onPress={() => { router.push('/product/create') }}
          >
            Create new product
          </Button>
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
