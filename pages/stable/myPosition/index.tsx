import { Button, Grid, Spacer, Text } from '@nextui-org/react'
import MyStake from '../../../src/components/MyStake/MyStake'
import MultiDetails from '../../../src/components/MultiDetails/MultiDetails'
import { useRouter } from 'next/router'

const MyPosition = () => {
  const router = useRouter()

  const details = [
    {
      title: 'Your Pool USD balance',
      value: '≈$24120'
    },
    {
      title: 'Your Pool participation',
      value: '0.21%'
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
          <Text h1>My USD Position</Text>
          <Text h4>Manage your Stable stake.</Text>
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
              bgColor: '$black',
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
              bgColor: '$black',
              borderColor: '$kondorPrimary',
              zIndex: 1,
              m: '4px 0px'
            }}
            onPress={() => { router.push('/stable/removeLiquidity') }}
          >
            Remove liquidity pool
          </Button>
        </Grid>
      </Grid.Container>
      <Spacer y={2} />
      <MyStake />
      <Spacer y={2} />
      <MultiDetails details={details} />
    </>
  )
}

export default MyPosition
