import React, {useState, useEffect} from 'react'
import { Button, Navbar, Text } from '@nextui-org/react'
import ConnectWalletModal from '../Modals/ConnectWalletModal';
import { usePera } from '../../../contexts/usePera';
import { useMyAlgo } from '../../../contexts/useMyAlgo';

const Nav: React.FC = (): JSX.Element => {

  const {isConnectedToMyAlgoWallet, handleDisconnectMyAlgoWalletClick} = useMyAlgo()
  const {isConnectedToPeraWallet, handleDisconnectPeraWalletClick} = usePera()

  const [connectWalletModalVisible, setConnectWalletModalVisible] = useState<boolean>(false)

  const handlerConnect = (): void => {
    setConnectWalletModalVisible(true)
  }

  const handlerDisconnect = (): void => {
    handleDisconnectMyAlgoWalletClick()
    handleDisconnectPeraWalletClick()
  }

  const getNavbarButton = () => {
    if(!isConnectedToPeraWallet && !isConnectedToMyAlgoWallet){
      return(
        <>
          <Button 
            shadow
            color="gradient"
            onClick={handlerConnect}
            >Connect
          </Button>
          <ConnectWalletModal isVisible={connectWalletModalVisible} onHide={() => setConnectWalletModalVisible(false)}/>
        </>)
    }
    return (
      <Button 
        shadow
        color="gradient"
        onClick={handlerDisconnect}
        >Disconnect
    </Button>
    )
  }

  return (
    <Navbar variant="sticky" maxWidth="fluid" >
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
          <div>
          {getNavbarButton()}
          </div>
        </Navbar.Item>
    </Navbar.Content >
  </Navbar>
)}

export default Nav
