interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClass = {
    small: 'loader--sm',
    medium: '',
    large: 'loader--lg'
  }[size];

  return (
    <div className="loading-spinner">
      <div className={`loader ${sizeClass}`} />
      <span className="loading-spinner__text">Loading...</span>
    </div>
  );
};

export default LoadingSpinner; 