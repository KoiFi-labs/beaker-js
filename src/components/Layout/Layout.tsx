import { Box } from '../Box/Box'
import Nav from '../modules/Nav/Nav'
import SideBar from '../modules/SideBar/SideBar'
import { useState, useEffect } from 'react'

type Props = {
     children: JSX.Element | JSX.Element[];
    };

export const Layout = ({ children }: Props) => {
  const [isHydrating, setIsHydrating] = useState<boolean>(false)
  useEffect(() => {
    setIsHydrating(true)
  }, [])

  return (
    <>
      <Box css={{ maxW: '100%' }}>
        <Nav />
        <div style={{ display: 'flex' }}>
          {isHydrating && <SideBar />}
          <div style={{ width: '100%', padding: '36px' }}>
            {children}
          </div>
        </div>
      </Box>
    </>
  )
}
