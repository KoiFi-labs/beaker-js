type IconProps = {
  fill?: string;
  size?: string | number;
  height?: string | number;
  width?: string | number;
  label?: string;
}

export const InfoIcon: React.FC<IconProps> = ({
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
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z">
      </path>
      <path
          stroke={fill}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 11h2v6h-2zm0-4h2v2h-2z">
      </path>
    </svg>
  );
};
