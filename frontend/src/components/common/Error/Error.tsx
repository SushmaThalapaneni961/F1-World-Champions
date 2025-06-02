import * as React from 'react';
import './Error.scss';

export type ErrorType = 'network' | 'api' | 'empty' | 'timeout' | 'unknown';

interface ErrorProps {
  message: string;
  type?: ErrorType;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  details?: string;
}

const NetworkErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="error-icon"
  >
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const TimeoutErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="error-icon"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const EmptyStateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="error-icon empty"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const DefaultErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="error-icon"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const getIconByType = (type: ErrorType = 'unknown', customIcon?: React.ReactNode) => {
  if (customIcon) return customIcon;

  switch (type) {
    case 'network':
      return <NetworkErrorIcon />;
    case 'timeout':
      return <TimeoutErrorIcon />;
    case 'empty':
      return <EmptyStateIcon />;
    default:
      return <DefaultErrorIcon />;
  }
};

const Error: React.FC<ErrorProps> = ({
  message,
  type = 'unknown',
  icon,
  action,
  secondaryAction,
  details,
}) => {
  return (
    <div className={`error-container ${type}`}>
      <div className="error-content">
        <svg
          data-testid="error-icon"
          className="error-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {getIconByType(type, icon)}
        </svg>
        <div className="error-text">
          <p className="error-message">{message}</p>
          {details && (
            <p data-testid="error-details" className="error-details">
              {details}
            </p>
          )}
        </div>
        <div className="error-actions">
          {action && (
            <button className="error-action primary" onClick={action.onClick}>
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button className="error-action secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { Error };
