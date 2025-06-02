import * as React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <button className={`button ${variant} ${className} ${icon ? 'with-icon' : ''}`} {...props}>
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
    </button>
  );
};

export { Button };
