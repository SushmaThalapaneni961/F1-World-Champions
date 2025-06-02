import * as React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ArrowLeft: React.FC<IconProps> = ({ 
  size = 24, 
  color = 'currentColor',
  className = ''
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon ${className}`}
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
); 