import { Text, Card, Grid } from '@nextui-org/react'

type ItemDetailCardProps = {
  title: string
  value: string
  icon: React.ReactNode
  m?: number | string
}

export default function ItemDetailCard ({ title, value, icon, m }: ItemDetailCardProps) {
  return (
    <Card css={{
      p: '16px',
      width: '100%',
      m: m || 0
    }}
    >
      <Grid.Container>
        <Grid
          xs={0}
          sm={12}
          css={{
            d: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '112px'
          }}
        >
          {icon}
          <Text size={14} css={{ color: '$kondorGray' }}>{title}</Text>
          <Text b size={16}>{value}</Text>
        </Grid>
        <Grid xs={12} sm={0}>
          <Grid.Container css={{ height: '100%' }}>
            <Grid xs={6} css={{ d: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {icon}
              <Text size={14} css={{ color: '$kondorGray' }}>{title}</Text>
            </Grid>
            <Grid xs={6} css={{ d: 'flex', justifyContent: 'flex-end' }}>
              <Text b size={20}>{value}</Text>
            </Grid>
          </Grid.Container>
        </Grid>
      </Grid.Container>
    </Card>
  )
}
