import React from 'react'
import { usePera } from '../../../contexts/usePera'
import { Button, Navbar, Text } from '@nextui-org/react'

const Nav: React.FC = (): JSX.Element => {
    const {accountAddress, handleConnectWalletClick, handleDisconnectWalletClick } = usePera()
    const isConnectedToPeraWallet = accountAddress?.length;
    

    const toggleConnectWallet = () => {
        const toggle = isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick
        return toggle
    }

  return (
    <Navbar variant="sticky" css={{backgroundColor: 'transparent'}} >
        <Navbar.Brand >
          <Text b color="inherit" hideIn="xs">
            KoiFi
          </Text>
        </Navbar.Brand>
        <Navbar.Content hideIn="xs" >
          <Navbar.Link href="#">Swap</Navbar.Link>
          <Navbar.Link isActive href="#">About</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Item>
            <Button 
                    shadow
                    color="gradient"
                    onClick={toggleConnectWallet()}> {isConnectedToPeraWallet ? 'Disconnect' : 'Connect with Pera Wallet'}
                </Button>
          </Navbar.Item>
        </Navbar.Content >
    </Navbar>
  )
}

export default Nav
