import { Text, Card } from '@nextui-org/react'

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
      width: '136px',
      height: '136px',
      d: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      m: m || 0
    }}
    >
      {icon}
      <Text size={14} css={{ color: '$kondorGray' }}>{title}</Text>
      <Text b size={16}>{value}</Text>
    </Card>
  )
}
