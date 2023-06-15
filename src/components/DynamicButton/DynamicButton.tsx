import { Button, CSS, Loading } from '@nextui-org/react'

type Item = {
    text: string,
    onPress: () => void,
}

type Props = {
        items: Item[]
        index: number
        bordered?: boolean
        rounded?: boolean
        loading?: boolean
        disabled?: boolean
        css?: CSS
    };

export const DynamicButton = ({
  items,
  index,
  bordered = true,
  rounded = true,
  loading = false,
  disabled = false,
  css
}: Props) => {
  const cssProps = css || { width: '100%', color: '$white', borderColor: '$kondorPrimary' }
  if (loading) disabled = true
  return (
    <Button
      onPress={() => items[index].onPress()}
      bordered={bordered}
      rounded={rounded}
      disabled={disabled}
      css={cssProps}
    >
      {loading ? <Loading /> : null}
      {items[index].text}
    </Button>
  )
}
