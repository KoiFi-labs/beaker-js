import React, {useState} from "react"
import { Button, Navbar, Popover, Text, Card, Avatar, Container, Divider, Spacer, Grid, Dropdown } from "@nextui-org/react"
import ConnectWalletModal from "../Modals/ConnectWalletModal";
import { useWallet } from "../../../contexts/useWallet";
import { ChevronIcon } from "../../../../public/icons/chevron-down";
import { Balance } from "../../../services/algoService";
import { microToStandard } from "../../../utils/math";
import { config } from "../../../../config";
import { abbreviateWallet } from "../../../utils/utils";
import Link from "next/link";

const Nav: React.FC = (): JSX.Element => {

  const {isConnected, handleDisconnectWalletClick, account, balances } = useWallet()
  const [connectWalletModalVisible, setConnectWalletModalVisible] = useState<boolean>(false)
  const balancesToShow = balances.filter((b: Balance) => config.assetList.map(a => a.id).includes(b.assetId))

  type Page = {
    label: string;
    href: string;
  };

  const pages: Page[] = [
    {
      label: "Home",
      href: "/home",
    },
    {
      label: "Pools",
      href: "/pool",
    },
    {
      label: "MyPools",
      href: "/myPool",
    },
    {
      label: "MyProducts",
      href: "/product",
    }
  ];

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
            css={{color: "$kondorPrimary", borderColor: "$kondorPrimary"}}
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
            css={{color: "$kondorPrimary", borderColor: "$kondorPrimary"}}
            >{account?.addr ? abbreviateWallet(account.addr) : null}
              <ChevronIcon size={20} fill="#814350" />
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
                    <Container display="flex" justify="flex-end" css={{padding:0}}>
                      <Text b>{microToStandard(balance.amount)}</Text>
                    </Container>
                  </Grid>
                  <Spacer y={0.4}/>
                  <Divider/>
                </Grid.Container>
              )
            })
            }
            <Button  css={{minWidth: "120px", background:"$kondorPrimary"}} onPress={handlerDisconnect}>Disconnect</Button>
          </Card>
        </Popover.Content>
      </Popover>
      
    )
  }

  return (
    <Navbar variant="sticky" maxWidth="fluid" isCompact >
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand
          css={{
            "@xs": {
              w: "12%",
            },
          }}
        >
        <Link href="home">
            Kondor Finance
        </Link>
        </Navbar.Brand>
      <Navbar.Content hideIn="xs" >
        {pages.map((page) => (
            <Link href={page.href} key={page.label}>{page.label}</Link>
        ))}
      </Navbar.Content>


      <Navbar.Content >
        <Navbar.Item >
          <div>
          {getNavbarButton()}
          </div>
        </Navbar.Item>
      </Navbar.Content >


      <Navbar.Collapse >
          {pages.map((item, index) => (
            <Navbar.CollapseItem key={item.label}>
              <Link href={item.href}>
                {item.label}
              </Link>
            </Navbar.CollapseItem>
          ))}
        </Navbar.Collapse>
  </Navbar>
)}

export default Nav
