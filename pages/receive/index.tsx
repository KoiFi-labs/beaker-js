import { Text, Container, Spacer } from '@nextui-org/react'
import QRCode from 'qrcode.react'
import { useWallet } from '../../src/contexts/useWallet'
import { BiCopy } from 'react-icons/bi'
import { IconButton } from '../../src/components/IconButton/IconButton'
import { CustomButton } from '../../src/components/CustomButton/CustomButton'

export default function Receive () {
  const { account, isConnected, connectWallet } = useWallet()
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
          {isConnected
            ? (
              <>
                <Text b>Nextwork: Algorand</Text>
                <Spacer />
                <Text css={{ color: '$kondorTextGray' }}>DEPOSIT ADDRESS</Text>
                <QRCode value={account.addr} />
                <Spacer y={2} />
                <Text size={14}>{account.addr}</Text>
                <IconButton><BiCopy />Copy address</IconButton>
              </>
              )
            : (
              <Container css={{ p: 0, textAlign: 'center' }}>
                <Text>To make a deposit it is necessary to connect an algorand wallet to the application.</Text>
                <Spacer />
                <CustomButton onPress={() => { connectWallet() }}>Connect wallet</CustomButton>
              </Container>)}
        </Container>
      </Container>
    </Container>
  )
}
