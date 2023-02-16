type IconProps = {
    fill?: string;
    size?: string | number;
    height?: string | number;
    width?: string | number;
    label?: string;
  }

export const PlusCircleIcon: React.FC<IconProps> = ({
  fill,
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'
      />
    </svg>
  )
}
