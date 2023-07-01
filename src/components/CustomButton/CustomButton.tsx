import { Button, CSS, Loading } from '@nextui-org/react'

type Props = {
        bordered?: boolean
        rounded?: boolean
        loading?: boolean
        onPress?: () => void,
        disabled?: boolean,
        css?: CSS,
        children: JSX.Element | JSX.Element[] | string
    }

export const CustomButton = ({
  bordered = true,
  rounded = true,
  loading = false,
  disabled = false,
  onPress = () => {},
  children,
  css
}: Props) => {
  const cssProps = { width: '100%', color: '$white', borderColor: '$kondorPrimary' }
  Object.assign(cssProps, css)
  return (
    <Button
      onPress={onPress}
      bordered={bordered}
      rounded={rounded}
      disabled={disabled}
      css={cssProps}
    >
      {loading ? <Loading /> : null}
      {children}
    </Button>
  )
}
