const getFormattedMessage = (message: string, level: string) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

const log = (level: 'info' | 'warn' | 'error', message: string) => {
  const formattedMessage = getFormattedMessage(message, level);
};

export const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string | Error) => {
    const errorMessage = message instanceof Error ? message.message : message;
    log('error', errorMessage);
  },
};
