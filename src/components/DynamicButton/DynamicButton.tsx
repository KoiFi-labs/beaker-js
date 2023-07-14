import { Button, CSS, Loading, Spacer } from '@nextui-org/react'

type Item = {
    text: string,
    onPress?: () => void,
    disabled?: boolean,
}

type Props = {
        items: Item[]
        index: number
        disabled?: boolean
        bordered?: boolean
        rounded?: boolean
        loading?: boolean
        css?: CSS
    }

export const DynamicButton = ({
  items,
  index,
  disabled = false,
  bordered = true,
  rounded = true,
  loading = false,
  css
}: Props) => {
  const cssProps = css || { width: '100%', color: '$white', borderColor: '$kondorPrimary' }
  const disabledValue = disabled || items[index]?.disabled || loading
  const onPress = items[index]?.onPress || (() => {})
  return (
    <Button
      onPress={onPress}
      bordered={bordered}
      rounded={rounded}
      disabled={disabledValue}
      css={cssProps}
    >
      {loading ? <><Loading size='sm' /><Spacer /></> : null}
      {items[index].text}
    </Button>
  )
}
