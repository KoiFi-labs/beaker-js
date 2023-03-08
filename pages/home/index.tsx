import { Container } from '@nextui-org/react'
import Image from 'next/image'

export default function Home () {
  return (
    <Container
      fluid
      display='flex'
      direction='column'
      justify='center'
      alignItems='center'
      css={{
        minHeight: '92vh',
        position: 'relative'
      }}
    >
      <Image alt='Kondor Finance logo' src='/Kondor_Logo_01.png' width={500} height={190} />

    </Container>
  )
}
