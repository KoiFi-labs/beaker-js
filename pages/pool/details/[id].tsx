import { Text, Container, Tooltip, Card, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getPoolById } from '../../../src/services/poolService'
import { IconButton } from '../../../src/components/IconButton/IconButton'
import { InfoIcon } from '../../../public/icons/InfoIcon'
import Link from 'next/link'
import { LinkButton } from '../../../src/components/LinkButton/LinkButton'

export default function Details () {
  const router = useRouter()
  const { id } = router.query
  const pool = getPoolById(id as string)

  return (
    <Container display='flex' justify='center' alignContent='flex-start' css={{ minHeight: '85vh', p: '16px' }}>
      <Card css={{
        p: '8px',
        maxWidth: '400px',
        minHeight: '200px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Container display='flex' justify='space-between' css={{ p: 0 }}>
          <Text size={20} css={{ color: '$kondorLight' }}>{pool?.pool} Pool</Text>
          <Tooltip content='Details'>
            <IconButton>
              <InfoIcon size={20} fill='#979797' />
            </IconButton>
          </Tooltip>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Total value looked</Text>
          <Text>${pool?.total}</Text>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Volume 24H</Text>
          <Text>${pool?.volume}</Text>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Fees 24H</Text>
          <Text>$9.25k</Text>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>Transactions 24H</Text>
          <Text>$1.2k</Text>
        </Container>
        <Container css={{ p: 0 }} display='flex' justify='space-between'>
          <Text size={16} css={{ color: '$kondorGray' }}>APR</Text>
          <Text>15.93%</Text>
        </Container>
        <Spacer />
        <Link href={'/pool/addLiquidity/' + pool?.id}>
          <LinkButton>
            Add liquidity
          </LinkButton>
        </Link>
      </Card>
    </Container>
  )
}
