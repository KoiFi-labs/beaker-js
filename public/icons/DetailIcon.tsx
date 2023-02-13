type IconProps = {
    fill?: string;
    size?: string | number;
    height?: string | number;
    width?: string | number;
    label?: string;
  }
  
  export const DetailIcon: React.FC<IconProps> = ({
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
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
            stroke={fill}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14H5v-2h6v2zm8-4H5v-2h14v2zm0-4H5V7h14v2z">
        </path>
      </svg>
    );
  };
