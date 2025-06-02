import * as React from 'react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div data-testid="spinner-container" className="loading-spinner-container">
      <div data-testid="spinner" className="spinner" />
      {text && <div data-testid="loading-text" className="loading-text">{text}</div>}
    </div>
  );
};

export { LoadingSpinner };