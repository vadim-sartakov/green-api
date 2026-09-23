export { cn } from 'cn';

export const normalizePhoneNumber = (phoneNumber: string | number) => {
  return String(phoneNumber).replace(/\D/g, '');
};

type RetryOptions = {
  maxRetries: number;
  retryDelay?: number;
  backoffFactor?: number;
};

export const retry = async <T>(
  fn: () => Promise<T>,
  { maxRetries, retryDelay = 1000, backoffFactor = 2 }: RetryOptions,
): Promise<T> => {
  let retryCount = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retryCount >= maxRetries) throw error;

      const delay = retryDelay * backoffFactor ** retryCount;
      retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const getInitials = (phoneNumber: string) => {
  return phoneNumber.replace(/\D/g, '').slice(-2) || '••';
};
