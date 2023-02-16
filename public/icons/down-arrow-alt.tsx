export const DownArrowAltIcon = ({
  fill = 'currentColor',
  filled = false,
  size = 24,
  height = 24,
  width = 24,
  label = 'down-arrow-alt',
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox='0 0 24 24'
      {...props}
    >
      <path d='m18.707 12.707-1.414-1.414L13 15.586V6h-2v9.586l-4.293-4.293-1.414 1.414L12 19.414z' />
    </svg>
  )
}
