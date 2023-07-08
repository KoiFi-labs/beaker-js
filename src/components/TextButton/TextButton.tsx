import { Text } from '@nextui-org/react'

type Props = {
        onPress?: () => void,
        color?: string,
        text: string
    }

export const TextButton = ({
  onPress = () => {},
  color,
  text
}: Props) => {
  return (
    <button
      onClick={onPress}
      style={{
        background: 'none',
        border: 'none',
        margin: 0,
        padding: 0
      }}
    >
      <a>
        <Text css={{ color }}>{text}</Text>
      </a>
    </button>
  )
}
