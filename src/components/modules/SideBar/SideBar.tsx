import React from 'react'
import { Sidebar, Menu, MenuItem, menuClasses, MenuItemStyles } from 'react-pro-sidebar'
import { Switch, Grid, Container, Text, Divider, Spacer, Badge } from '@nextui-org/react'
import { FiList, FiSend } from 'react-icons/fi'
import { TbArrowsExchange, TbDatabase } from 'react-icons/tb'
import { RxDashboard } from 'react-icons/rx'
import { BiNavigation, BiDollarCircle } from 'react-icons/bi'
import Link from 'next/link'

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489'
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0098e5',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e'
      },
      disabled: {
        color: '#9fb6cf'
      }
    }
  },
  dark: {
    sidebar: {
      backgroundColor: '#06171E',
      color: '#292929'
    },
    menu: {
      menuContent: '#292929',
      icon: '#ffffff',
      hover: {
        backgroundColor: '#6BAC96',
        color: '#c9c9c9'
      },
      disabled: {
        color: '#c1c1c1'
      }
    }
  }
}

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [toggled, setToggled] = React.useState(false)
  const theme = 'dark'

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '13px',
      fontWeight: 400
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color
      }
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9'
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, !collapsed ? 0.4 : 1)
          : 'transparent'
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 0.8),
        color: themes[theme].menu.hover.color
      }
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined
    })
  }

  return (
    <div
      style={{
        maxWidth: '250px',
        zIndex: 3
      }}
    >
      <Grid.Container>
        <Grid xs={0} sm={12}>
          <div style={{ position: 'fixed', display: 'flex', height: '100vh', direction: 'ltr' }}>
            <Sidebar
              collapsed={collapsed}
              toggled={toggled}
              onBackdropClick={() => setToggled(false)}
              rtl={false}
              backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 0.95)}
              rootStyles={{
                color: themes[theme].sidebar.color
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '820px' }}>
                <div style={{ padding: '20px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
                  <Switch
                    size='xs'
                    id='collapse'
                    checked={!collapsed}
                    onChange={() => setCollapsed(!collapsed)}
                  />
                </div>
                <div style={{ flex: 1, marginBottom: '32px' }}>
                  <Menu menuItemStyles={menuItemStyles}>
                    <Link href='/home'>
                      <MenuItem icon={<RxDashboard size={20} />}><Text b size={18}>Dashboard</Text></MenuItem>
                    </Link>
                    <Container><Divider height={2} /></Container>
                    <Spacer />
                    <Container css={{ p: '0px 28px' }}>
                      <Text size={20} weight='light' css={{ opacity: collapsed ? 0 : 0.7, transition: '0.3s' }}>
                        Payments
                      </Text>
                    </Container>
                    <Link href='/send'>
                      <MenuItem icon={<FiSend size={20} />}><Text b size={18}>Send</Text></MenuItem>
                    </Link>
                    <MenuItem icon={<FiSend size={20} style={{ transform: 'rotate(180deg)' }} />}><Text b size={18}>Receive</Text></MenuItem>
                    <MenuItem icon={<FiList size={20} />}><Text b size={18}>History</Text></MenuItem>
                    <Container><Divider height={2} /></Container>
                    <Spacer />
                    <Container css={{ p: '0px 28px' }}>
                      <Text size={20} weight='light' css={{ opacity: collapsed ? 0 : 0.7, transition: '0.3s' }}>
                        DeFi
                      </Text>
                    </Container>
                    <Link href='/swap'>
                      <MenuItem icon={<TbArrowsExchange size={20} />}><Text b size={18}>Swap</Text></MenuItem>
                    </Link>
                    <Link href='/stable'>
                      <MenuItem icon={<BiDollarCircle size={20} />}><Text b size={18}>Stable USD</Text></MenuItem>
                    </Link>
                    <MenuItem
                      disabled
                      icon={<TbDatabase size={20} />}
                      suffix={<Badge size='xs'>SOON</Badge>}
                    >
                      <Text b size={18}>Investment</Text>
                    </MenuItem>
                    <Spacer />
                    <Container css={{ p: '0px 28px' }}>
                      <Text size={20} weight='light' css={{ opacity: collapsed ? 0 : 0.7, transition: '0.3s' }}>
                        Fiat
                      </Text>
                    </Container>
                    <MenuItem
                      disabled
                      icon={<BiNavigation size={20} />}
                      suffix={<Badge size='xs'>SOON</Badge>}
                    >
                      <Text b size={18}>Off ramp</Text>
                    </MenuItem>
                    <MenuItem
                      disabled
                      icon={<BiNavigation size={20} style={{ transform: 'rotate(180deg)' }} />}
                      suffix={<Badge size='xs'>SOON</Badge>}
                    >
                      <Text b size={18}>On ramp</Text>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </Sidebar>
          </div>
          <div style={{ width: collapsed ? '80px' : '250px', height: 'calc(100vh - 54px)', display: 'flex', transition: '0.3s', minWidth: collapsed ? '80px' : '250px' }} />
        </Grid>
      </Grid.Container>
    </div>
  )
}

export default SideBar
