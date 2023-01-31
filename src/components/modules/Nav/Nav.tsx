import React, {useState} from 'react'
import { Button, Navbar, Popover, Text, Card, Avatar, Container, Divider, Spacer, Grid } from '@nextui-org/react'
import ConnectWalletModal from '../Modals/ConnectWalletModal';
import { useWallet } from '../../../contexts/useWallet';
import Link from 'next/link'
import { ChevronIcon } from '../../../../public/icons/chevron-down';
import { Balance } from '../../../services/algoService';
import { microToStandard } from '../../../utils/math';
import { config } from '../../../../config';

const Nav: React.FC = (): JSX.Element => {

  const {isConnected, handleDisconnectWalletClick, account, balances } = useWallet()
  const [connectWalletModalVisible, setConnectWalletModalVisible] = useState<boolean>(false)
  const balancesToShow = balances.filter((b: Balance) => config.assetList.map(a => a.id).includes(b.assetId))

  const abbreviateWallet = (wallet: string): string => {
    return wallet.slice(0, 6) + "..." + wallet.slice(wallet.length - 4, wallet.length)
  }

  const handlerConnect = (): void => {
    setConnectWalletModalVisible(true)
  }

  const handlerDisconnect = (): void => {
    handleDisconnectWalletClick()
  }

  const getNavbarButton = () => {
    if(!isConnected){
      return(
        <>
          <Button 
            bordered
            onPress={handlerConnect}
            >Connect
          </Button>
          <ConnectWalletModal isVisible={connectWalletModalVisible} onHide={() => setConnectWalletModalVisible(false)}/>
        </>)
    }
    return (
      <Popover placement="bottom-right">
        <Popover.Trigger>
          <Button 
            bordered
            onPress={handlerDisconnect}
            >{account?.addr ? abbreviateWallet(account.addr) : null}
              <ChevronIcon size={20} fill="#17C964" />
          </Button>  
        </Popover.Trigger>
        <Popover.Content>
          <Card css={{padding:"20px"}}>
            {balancesToShow.map((balance: Balance) => {
              return (
                <Grid.Container css={{minWidth: "320px", margin: "5px  0"}} key={balance.assetId}>
                  <Grid xs={8}>
                    <Avatar src={balance.icon} size={"sm"} css={{margin:"0px 4px"}}/>
                    <Text >{balance.symbol || `id: ${balance.assetId}`}</Text>
                  </Grid>
                  <Grid xs={4}>
                    <Container display='flex' justify='flex-end' css={{padding:0}}>
                      <Text b>{microToStandard(balance.amount)}</Text>
                    </Container>
                  </Grid>
                  <Spacer y={0.4}/>
                  <Divider/>
                </Grid.Container>
              )
            })
            }
            <Button  css={{minWidth: "120px"}} onPress={handlerDisconnect}>Disconnect</Button>
          </Card>
        </Popover.Content>
      </Popover>
      
    )
  }

  return (
    <Navbar variant="sticky" maxWidth="fluid" isCompact >
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
         Kondor Finance
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" >
        <Link  href="home">Home</Link>
        <Link  href="#">About</Link>
        <Link  href="sandbox">Sandbox</Link>
        <Link  href="beaker">Beaker</Link>
        <Link  href="swap">Swap</Link>
      </Navbar.Content>
      <Navbar.Content >
        <Navbar.Item >
          <div>
          {getNavbarButton()}
          </div>
        </Navbar.Item>
    </Navbar.Content >
  </Navbar>
)}

export default Nav
