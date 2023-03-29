import { Text, Grid, Divider, Container } from '@nextui-org/react'

type Detail = {
    title: string
    value: string
}

type MultiDetailsProps = {
    details: Detail[]

}

const MultiDetails = ({ details } : MultiDetailsProps) => {
  return (
    <Grid.Container>
      {details.map((detail, index) => (
        <Grid
          xs={12} sm={6} css={{
            d: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          key={index}
        >
          <Container css={{ p: '8px 16px' }}>
            <Text size={20}>{detail.title}</Text>
          </Container>
          <Container css={{ p: '8px 16px' }}>
            <Text size={16} css={{ color: '$kondorGray' }}>{detail.value}</Text>
          </Container>
          <Divider />
        </Grid>
      ))}
    </Grid.Container>
  )
}

export default MultiDetails
