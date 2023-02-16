type IconProps = {
    fill?: string;
    size?: string | number;
    height?: string | number;
    width?: string | number;
    label?: string;
  }

export const DeleteIcon: React.FC<IconProps> = ({
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
        d='M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z'
      />
      <path
        stroke={fill}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M9 10h2v8H9zm4 0h2v8h-2z'
      />
    </svg>
  )
}
