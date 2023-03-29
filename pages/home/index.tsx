import { Container, Grid } from '@nextui-org/react'
import Image from 'next/image'

export default function Home () {
  return (
    <Container display='flex' justify='center' alignItems='center'>
      <Grid.Container gap={2} justify='center'>
        <Grid sm={12} xs={0} css={{ d: 'flex', justifyContent: 'center' }}>
          <Image alt='Kondor Finance logo' src='/Kondor_Logo_01.png' width={500} height={190} />
        </Grid>
        <Grid xs={12} sm={0} css={{ d: 'flex', justifyContent: 'center' }}>
          <Image alt='Kondor Finance logo' src='/Kondor_Logo_03.png' width={250} height={250} />
        </Grid>
      </Grid.Container>
    </Container>
  )
}
