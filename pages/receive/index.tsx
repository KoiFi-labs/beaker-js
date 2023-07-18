import { Text, Container, Spacer } from '@nextui-org/react'
import QRCode from 'qrcode.react'
import { useWallet } from '../../src/contexts/useWallet'
import { BiCopy } from 'react-icons/bi'
import { IconButton } from '../../src/components/IconButton/IconButton'

export default function Receive () {
  const { account } = useWallet()
  return (
    <Container display='flex' justify='center' css={{ p: 0, width: '100%' }}>
      <Container css={{
        minWidth: '330px',
        width: '100%',
        maxWidth: '500px',
        p: 0
      }}
      >
        <Text h1>Receive</Text>
        <Container css={{
          p: '16px',
          bgColor: '$kondorBlueLight',
          borderRadius: '16px',
          d: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        >
          <Text b>Nextwork: Algorand</Text>
          <Spacer />
          <Text css={{ color: '$kondorTextGray' }}>DEPOSIT ADDRESS</Text>
          <QRCode value={account.addr} />
          <Spacer y={2} />
          <Text size={14}>{account.addr}</Text>
          <IconButton><BiCopy />Copy address</IconButton>
        </Container>
      </Container>
    </Container>
  )
}
