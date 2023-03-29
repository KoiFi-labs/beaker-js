import { Container } from '@nextui-org/react'
import { Box } from '../Box/Box'
import Nav from '../modules/Nav/Nav'

type Props = {
     children: JSX.Element | JSX.Element[];
    };

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Box css={{ maxW: '100%' }}>
        <Nav />
        <Container css={{ p: '48px 16px', mw: '992px' }}>
          {children}
        </Container>
        {/* <Footer/> */}
      </Box>
    </>
  )
}
