import { Text, Container, Card, Grid } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { getPoolById } from '../../src/services/poolService'
import Link from 'next/link'
import { LinkButton } from '../../src/components/LinkButton/LinkButton'
import ItemDetailCard from '../../src/components/ItemDetailCard/ItemDetailCard'
import { abbreviateNumber } from '../../src/utils/utils'
import { BiTransfer, BiDollar, BiCalculator, BiData } from 'react-icons/bi'
import { AiOutlineGlobal } from 'react-icons/ai'

export default function Details () {
  const router = useRouter()
  const { id } = router.query
  const pool = getPoolById(id as string)
  if (!pool) return <Text>Pool not found</Text>

  return (
    <Container css={{ p: '8px', mw: '992px' }}>
      <Grid.Container css={{ m: 0, p: 0 }}>
        <Grid xs={6} css={{ m: 0, p: 0, d: 'flex', flexDirection: 'column' }}>
          <Text h1 css={{ color: '$kondorGray' }}>{pool.pool} Pool</Text>
          <Text h4 css={{ color: '$kondorGray' }}>Earn fees by providing liquidity.</Text>
        </Grid>
      </Grid.Container>
      <Card css={{
        p: '16px',
        bg: 'rgb(0, 0, 0, 0.6)',
        backdropFilter: 'saturate(180%) blur(10px);'
      }}
      >
        <Container display='flex' justify='flex-start' css={{ p: 0 }}>
          <ItemDetailCard
            title='Total liquidity'
            value={`$${abbreviateNumber(pool.total)}`}
            icon={<AiOutlineGlobal size={40} />}
            m={8}
          />
          <ItemDetailCard
            title='Volume 24H'
            value={`$${abbreviateNumber(pool.volume)}`}
            icon={<BiData size={40} />}
            m={8}
          />
          <ItemDetailCard
            title='Fees 24H'
            value={`$${abbreviateNumber(pool.volume * 0.003)}`}
            icon={<BiDollar size={40} />}
            m={8}
          />
          <ItemDetailCard
            title='Transactions 24H'
            value='12.3K'
            icon={<BiTransfer size={40} />}
            m={8}
          />
          <ItemDetailCard
            title='APR'
            value={`${pool.apr} %`}
            icon={<BiCalculator size={40} />}
            m={8}
          />
        </Container>
      </Card>
      <Link href={'/pool/addLiquidity/' + pool.id}>
        <LinkButton>
          Add liquidity
        </LinkButton>
      </Link>
    </Container>

  )
}
