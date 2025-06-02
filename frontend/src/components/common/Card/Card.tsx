import React from 'react';
import './Card.scss';

export interface CardProps {
  title: string;
  infoRows: Array<{
    label: string;
    value: string | number | null;
  }>;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  highlighted?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  infoRows,
  onClick,
  className = '',
  style = {},
  highlighted = false,
}) => {
  const cardClasses = [
    'card',
    className,
    onClick ? 'clickable' : '',
    highlighted ? 'highlighted' : '',
  ].filter(Boolean).join(' ');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="article"
      className={cardClasses}
      onClick={onClick}
      style={style}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <h3 className="card-title">{title}</h3>
      {infoRows.length > 0 && (
        <div className="card-info">
          {infoRows.map(({ label, value }, index) => (
            value !== null && (
              <div key={index} className="info-row">
                <div className="label">{label}</div>
                <div className="value">{value}</div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export { Card };

