export { cn } from 'cn';

export const normalizePhoneNumber = (phoneNumber: string | number) => {
  return String(phoneNumber).replace(/\D/g, '');
};

export const getInitials = (phoneNumber: string) => {
  return phoneNumber.replace(/\D/g, '').slice(-2) || '••';
};
