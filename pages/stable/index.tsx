import { Text, Grid, Button, Spacer } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import ItemDetailCard from '../../src/components/ItemDetailCard/ItemDetailCard'
import { abbreviateNumber } from '../../src/utils/utils'
import { FaCoins } from 'react-icons/fa'
import { AiOutlineGlobal } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { getStablePoolSupply } from '../../src/services/kondorServices/symmetricPoolServise'
// import { BiTransfer, BiDollar, BiCalculator, BiData } from 'react-icons/bi'

const DECIMALS = 1000000

export default function Stable () {
  const router = useRouter()
  const [aSupply, setASupply] = useState<number>(0)
  const [bSupply, setBSupply] = useState<number>(0)

  useEffect(() => {
    getStablePoolSupply()
      .then(res => {
        setASupply(res[0])
        setBSupply(res[1])
      })
  }, [])

  const data = [
    {
      title: 'Stable pool',
      value: 'USDC/USDT',
      icon: <FaCoins size={40} />
    },
    {
      title: 'Total liquidity',
      value: `$${abbreviateNumber((aSupply + bSupply) / DECIMALS)}`,
      icon: <AiOutlineGlobal size={40} />
    }
  ]

  return (
    <>
      <Grid.Container>
        <Grid
          xs={12} sm={9} css={{
            d: 'flex',
            flexDirection: 'column'
          }}
        >
          <Text h1>USD Stable</Text>
          <Text h4>Provide liquidity and earn fees.</Text>
        </Grid>
        <Grid
          xs={12} sm={3} css={{
            d: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Button
            rounded
            bordered
            css={{
              width: '100%',
              color: '$white',
              borderColor: '$kondorPrimary',
              zIndex: 1,
              m: '4px 0px'
            }}
            onPress={() => { router.push('/stable/addLiquidity') }}
          >
            Add liquidity pool
          </Button>
          <Button
            rounded
            bordered
            css={{
              width: '100%',
              color: '$white',
              borderColor: '$kondorPrimary',
              zIndex: 1,
              m: '4px 0px'
            }}
            onPress={() => { router.push('/stable/myPosition') }}
          >
            My position
          </Button>
        </Grid>
      </Grid.Container>
      <Spacer y={2} />
      <Grid.Container>
        {data.map((item, index) => (
          <Grid xs={12} sm={4} md={2} key={index}>
            <ItemDetailCard title={item.title} value={item.value} icon={item.icon} m={8} />
          </Grid>
        ))}
      </Grid.Container>
    </>
  )
}
