const getFormattedMessage = (message: string | undefined, level: string) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

const log = (level: 'info' | 'warn' | 'error', message: string | undefined) => {
  const formattedMessage = getFormattedMessage(message, level);
  console.log(formattedMessage);
};

export const logger = {
  info: (message: string | undefined) => log('info', message),
  warn: (message: string | undefined) => log('warn', message),
  error: (message: string | Error | undefined) => {
    const errorMessage = message instanceof Error ? message.message : message;
    log('error', errorMessage);
  },
};
