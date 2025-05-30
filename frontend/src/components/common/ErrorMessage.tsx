interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
